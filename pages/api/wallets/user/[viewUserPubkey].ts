// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clusters, Membership, PrismaClient,Wallet } from '@prisma/client';
const prisma = new PrismaClient()

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { viewUserPubkey, cluster } = req.query

  cluster = typeof cluster === 'string' ? cluster : cluster[0]

  viewUserPubkey =
    typeof viewUserPubkey === 'string' ? viewUserPubkey : viewUserPubkey[0]

  if (cluster === undefined) {
    cluster = 'mainnet-beta'
  }

  const result = await prisma.wallet.findMany({
    where: {
      AND: [
        {
          cluster: {
            equals:<keyof typeof clusters> cluster,
          },
        },
        {
          OR: [
            {
              authority: {
                equals: viewUserPubkey,
              },
            },
            {
              membership: {
                some: {
                  OR: [
                    {
                      memberPubkey: {
                        equals: viewUserPubkey,
                      },
                    },
                    {
                      ownerPubkey: {
                        equals: viewUserPubkey,
                      },
                    },
                  ],
                },
              },
            },
          ],
        },
      ],
    },
  })

  if (result.length > 0) {
    res.status(200).json({ found: true, in: result })
    return
  }
  res.status(200).json({ found: false })
}
