import { NextApiRequest, NextApiResponse } from 'next'
import { clusters, Membership, PrismaClient, memberShipTypes } from '@prisma/client';

import {
  clusterApiUrl,
  Connection,
  SendTransactionError,
} from '@solana/web3.js'
import * as Cluster from 'cluster'
import { sendTransaction } from '@metaplex/js/lib/actions'

const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === 'POST') {
    let { walletPubKey, cluster } = req.query

    if (!cluster) cluster = 'devnet'

    walletPubKey = walletPubKey!.toString()
    cluster = cluster.toString()

    // check if the wallet exists in db
    const wallet = await prisma.wallet.findUnique({
      where: {
        cluster_pubkey: {
          pubkey: walletPubKey,
          cluster: <keyof typeof clusters> cluster,
        },
      },
    })

    if (!wallet) return res.status(404).json({ msg: 'This wallet does not exist'})

    // check if spl token is already specified
    if (wallet.acceptSPL) return res.status(400).json({ msg: 'SPL token already exists'})

    // Get the spl token and the transaction
    const { splToken, tx } = req.body
    if (!splToken || !tx) return res.status(400).json({ msg: 'Missing parameters'})

    // update wallet's spl token
    try {
      const updateWallet = await prisma.wallet.update({
        where: {
          cluster_pubkey: {
            pubkey: walletPubKey,
            cluster:<keyof typeof clusters> cluster,
          },
        },
        data: {
          acceptSPL: true,
          splToken,
        },
      })

      // Forward serialized transaction
      // @ts-ignore
      const connection = new Connection(clusterApiUrl(cluster), 'confirmed')
      const signature = await connection.sendEncodedTransaction(tx)
      const result = await connection.confirmTransaction({
        ...(await connection.getLatestBlockhash()),
        signature,
      })

      // Transaction failed
      if (result.value.err) {
        throw {
          response: {
            msg: `Transaction confirmation failed: ${result.value.err.toString()}`,
          },
        }
      }

      return res.status(200).json({ msg: updateWallet})
    } catch (e: any) {
      if (e instanceof SendTransactionError) {
        await prisma.wallet.update({
          where: {
            cluster_pubkey: {
              pubkey: walletPubKey,
              cluster: <keyof typeof clusters> cluster,
            },
          },
          data: {
            acceptSPL: false,
            splToken: undefined,
          },
        })

        return res.status(500).json({ msg: e.message, logs: e.logs })
      }

      return res.status(400).json({ msg: e.meta.cause})
    }
  } else {
    return res.status(404).json({ msg: `Method ${req.method} not valid`
  })
  }
}
