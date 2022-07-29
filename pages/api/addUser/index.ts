// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { PrismaClient } from '@prisma/client'

import {
  clusterApiUrl,
  Connection,
  SendTransactionError,
} from '@solana/web3.js'
import { PrismaClientKnownRequestError } from '@prisma/client/runtime'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    /* Flow:
     *   - Validate parameters
     *   - Save member into database
     *   - Forward serialized transaction
     *   - If transaction fails, remove member from database
     *   - Otherwise, return saved member data
     */

    const {
      tx, // Serialzied  transaction
      memberPubkey,
      ownerPubkey,
      shareCount,
      walletPubKey,
      cluster,
    } = req.body

    let insertedIntoDb = false
    let sentTransaction = false
    try {
      //Body for new user should be as follows:
      //memberPubkey
      //shareCount
      //walletPubkey

      const addedUser = await prisma.membership.create({
        data: {
          memberPubkey: memberPubkey,
          ownerPubkey: ownerPubkey,
          shareCount: shareCount,
          walletPubkey: walletPubKey,
          cluster: cluster,
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

      // Transaction confirmation failed?
      if (result.value.err) {
        throw {
          response: {
            msg: `Transaction confirmation failed: ${result.value.err.toString()}`,
          },
        }
      }

      sentTransaction = true
      res.status(200).json({ data: addedUser })
    } catch (error: any) {
      if (insertedIntoDb && !sentTransaction) {
        await prisma.membership.delete({
          where: {
            cluster_walletPubkey_memberPubkey: {
              memberPubkey: memberPubkey,
              walletPubkey: walletPubKey,
              cluster: cluster,
            },
          },
        })
      }

      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          res
            .status(400)
            .json({ msg: 'A member with the same data already exists' })
          return
        }
      } else if (error instanceof SendTransactionError) {
        if (error.logs?.[4].includes('Encountered an arithmetic error')) {
          res.status(400).json({ msg: 'Excceds total shares' })
          return
        } else {
          res.status(500).json({
            msg: error.message,
            logs: error.logs,
          })
          return
        }
      }

      res
        .status(500)
        .json(
          error.response
            ? error.response
            : { msg: 'Failed to add member to Hydra Wallet' }
        )
    }
  } else {
    res.status(405).json({ msg: 'Only POST requests are allowed' })
  }
}
