// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient } from '@prisma/client'
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'
import { Fanout } from '@glasseaters/hydra-sdk'

const prisma = new PrismaClient()

const GetMembershipModel = {
  0: 'Wallet membership',
  1: 'NFT membership',
  2: 'Token membership',
}

async function fetchSPLDetails(cluster, viewWalletPubkey) {
  const connection = new Connection(
    clusterApiUrl(cluster as Cluster),
    'confirmed'
  )
  try {
    let publickey = new PublicKey(viewWalletPubkey)
    // TODO ***
    // get SPL details and return
  } catch (err) {
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
  console.log(req.query)
  let { cluster, viewWalletPubkey } = req.query
  if (cluster == undefined) {
    cluster = 'devnet' //can later change to mainnet-beta
  }

  console.log(viewWalletPubkey)
  const wallets = await prisma.wallet.findMany()
  const membersdb: Membership[] = await prisma.membership.findMany()
  console.log(wallets)
  console.log(membersdb)
  const result =
    await prisma.$queryRaw`SELECT * FROM membership WHERE walletPubkey=${viewWalletPubkey} AND cluster=${cluster}`
  console.log('result')
  console.log(result)

  for (let index = 0; index < wallets.length; index++) {
    const element = wallets[index]
    console.log(element.pubkey) //I can do this since wallet addresses must be unique and there will be no two wallets with the same address
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
          // Fetch SPL Details (if accept)
          // TODO

          // Initialize Object with Wallet Data
          const walletData = {
            name: fanoutObj.name,
            totalShares: fanoutObj.totalShares.toString(),
            membershipModel: GetMembershipModel[fanoutObj.membershipModel],
            // Field for SPL Token
          }
          console.log(walletData)
          // Update wallet in DB
          await prisma.wallet.update({
            where: {
              cluster_pubkey: {
                pubkey: viewWalletPubkey,
                cluster: cluster,
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
                set: walletData.membershipModel,
              },
              //   Update SPL Token
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
                cluster: cluster,
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
