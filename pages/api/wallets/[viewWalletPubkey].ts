// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clusters, Membership, PrismaClient, memberShipTypes } from '@prisma/client';
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'
import { Fanout, FanoutClient, FanoutMint } from '@glasseaters/hydra-sdk'
import { type } from 'os';

const prisma = new PrismaClient()

const GetMembershipModel = {
  0: 'Wallet membership',
  1: 'NFT membership',
  2: 'Token membership',
}

async function fetchSPLDetails(cluster, viewWalletPubkey, splTokenKey) {
  const connection = new Connection(
    clusterApiUrl(cluster as Cluster),
    'confirmed'
  )
  try {
    let publickey = new PublicKey(viewWalletPubkey)
    const splTK = new PublicKey(splTokenKey)
    const [fanoutMintKey] = await FanoutClient.fanoutForMintKey(
      publickey,
      splTK
    )
    const fanoutMint = await FanoutMint.fromAccountAddress(
      connection,
      fanoutMintKey
    )
    // returning SPL token
    return fanoutMint.mint.toBase58()
  } catch (err) {
    console.log(err)
    return null
  }
}

async function validateWallet(cluster, viewWalletPubkey) {
  const connection = new Connection(
    clusterApiUrl(cluster as Cluster),
    'confirmed'
  )
  try {
    let publickey = new PublicKey(viewWalletPubkey)
    // Fetching wallet data
    const walletData = await Fanout.fromAccountAddress(connection, publickey)
    // Returning Fanout wallet Object
    return walletData
  } catch (error: any) {
    console.log('wallet not on blockchain')
    return null
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { cluster, viewWalletPubkey } = req.query
  if (cluster == undefined) {
    cluster = 'devnet' //can later change to mainnet-beta
  }

  const wallets = await prisma.wallet.findMany()
  const membersdb: Membership[] = await prisma.membership.findMany()
  const result=await prisma.membership.findMany(
    {
      where:{
        walletPubkey:viewWalletPubkey.toString(),
        cluster:<keyof typeof clusters> cluster
      },
      
    }
  );

  for (let index = 0; index < wallets.length; index++) {
    const element = wallets[index]
    //I can do this since wallet addresses must be unique and there will be no two wallets with the same address
    if (element.pubkey === viewWalletPubkey && element.cluster == cluster) {
      if (element.validated) {
        res.status(200).json({
          found: true,
          wallet: element,
          members: result,
        })
        return
      } else {
        // Fetch Fanout Wallet Object
        const fanoutObj = await validateWallet(cluster, viewWalletPubkey)
        // If exits
        if (fanoutObj) {
          // Fetch SPL Details and Update wallet if it accept SPL token
          if (element.acceptSPL) {
            let splToken = await fetchSPLDetails(
              cluster,
              viewWalletPubkey,
              element.splToken
            )
            if (splToken) {
              await prisma.wallet.update({
                where: {
                  cluster_pubkey: {
                    pubkey: viewWalletPubkey,
                    cluster:<keyof typeof clusters> cluster,
                  },
                },
                data: {
                  acceptSPL: {
                    set: true,
                  },
                  splToken: {
                    set: splToken,
                  },
                },
              })
            } else {
              await prisma.wallet.update({
                where: {
                  cluster_pubkey: {
                    pubkey: viewWalletPubkey,
                    cluster: cluster,
                  },
                },
                data: {
                  acceptSPL: {
                    set: false,
                  },
                  splToken: {
                    set: undefined,
                  },
                },
              })
            }
          }
          // Initialize Object with Wallet Data
          const walletData = {
            name: fanoutObj.name,
            totalShares: fanoutObj.totalShares.toString(),
            membershipModel: <keyof typeof memberShipTypes> GetMembershipModel[fanoutObj.membershipModel],
          }
          let type:memberShipTypes="NFT"
          
          if(walletData.membershipModel=="Wallet"){
            type=memberShipTypes.Wallet;
          }
          else if (walletData.membershipModel=="NFT"){
            type=memberShipTypes.NFT;
          }
          else if (walletData.membershipModel=="SPL"){
            type=memberShipTypes.SPL;
          }
          // Update wallet in DB
          await prisma.wallet.update({
            where: {
              cluster_pubkey: {
                pubkey: viewWalletPubkey,
                cluster:<keyof typeof clusters> cluster,
              },
            },
            data: {
              name: {
                set: walletData.name,
              },
              totalShares: {
                set: +walletData.totalShares,
              },
              memberShipType: {
                set: type,
              },
              validated: {
                set: true,
              },
            },
          })

          element.validated = true
          res.status(200).json({
            found: true,
            wallet: element,
            members: result,
          })
          return
        } else {
          await prisma.wallet.delete({
            where: {
              cluster_pubkey: {
                pubkey: viewWalletPubkey,
                cluster:<keyof typeof clusters> cluster,
              },
            },
          })
          console.log('wallet deleted')
          res.status(200).json({ found: false })
          return
        }
      }
    }
  }

  res.status(200).json({ found: false })
}
