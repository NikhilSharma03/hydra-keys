// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clusterApiUrl, Connection } from '@solana/web3.js'
import { clusters, memberShipTypes, PrismaClient } from '@prisma/client';
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    /* Flow:
     *   - Validate parameters
     *   - Save wallet into database
     *   - Forward serialized transaction
     *   - If transaction fails, remove wallet from database
     *   - Otherwise, return created wallet data
     */

    const {
      tx, // Serialzied  transaction
      name,
      pubkey,
      authority,
      memberShipType,
      acceptSPL,
      splToken,
      totalShares,
      cluster,
    } = req.body

    let insertedIntoDb = false
    let sentTransaction = false

    try {
      /* We may validate the parameters here or through middleware */
      const existingWallet = await prisma.wallet.findFirst({
        where: {
          name: {
            equals: name
          }
        }
      })

      if (existingWallet) {
        throw {
          response: {
            msg: 'A wallet already exists with the same name',
          },
        }
      }
      let type:memberShipTypes="NFT"

      if(memberShipType=="Wallet membership"){
        type=memberShipTypes.Wallet;
      }
      else if (memberShipType=="NFT membership"){
        type=memberShipTypes.NFT;
      }
      else if (memberShipType=="SPL membership"){
        type=memberShipTypes.SPL;
      }
      else{
        throw {
          response: {
            msg: `Transaction failed: Failed to create hydrawallet`,
          },
        }

      }

      // Save wallet into database
      const savedWallet = await prisma.wallet.create({
        data: {
          name: name,
          pubkey: pubkey,
          authority: authority,
          memberShipType: type,
          acceptSPL: acceptSPL,
          splToken: splToken,
          // TODO: Include mint public key for Token membership model
          totalShares: totalShares,
          cluster:<keyof typeof clusters> cluster,
        },
      })
      insertedIntoDb = true

      // Forward serialized transaction
      const connection = new Connection(clusterApiUrl(cluster), 'confirmed')
      const signature = await connection.sendEncodedTransaction(tx)
      const result = await connection.confirmTransaction({
        ...(await connection.getLatestBlockhash()),
        signature,
      })

      // Transaction failed?
      if (result.value.err) {
        throw {
          response: {
            msg: `Transaction failed: ${result.value.err.toString()}`,
          },
        }
      }

      sentTransaction = true
      res.status(200).json({ data: savedWallet })
    } catch (error: any) {
      if (insertedIntoDb && !sentTransaction) {
        await prisma.wallet.delete({
          where: {
            cluster_pubkey: {
              pubkey: pubkey,
              cluster:<keyof typeof clusters> cluster,
            },
          },
        })
      }

      console.error(error)

      res
        .status(400)
        .json(
          error.response
            ? error.response
            : { msg: 'Failed to create Hydra Wallet' }
        )
    }
  } else {
    res.status(405).json({ msg: 'Only POST requests are allowed' })
  }
}
