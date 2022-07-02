// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient, Wallet } from '@prisma/client';
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'
import { FanoutClient, Fanout } from '@glasseaters/hydra-sdk';

const prisma = new PrismaClient();

async function validateMember(cluster, viewWalletPubkey) {
  const connection = new Connection(clusterApiUrl(cluster as Cluster), 'confirmed')
  try {
    let publickey = new PublicKey(viewWalletPubkey);
    console.log('testing validation');
    await FanoutClient.membershipVoucher(FanoutClient.ID, publickey).then(data => { console.log(data) });
    return true;
  }
  catch (error: any) {
    console.log('Member wallet not on blockchain');
    return false;
  }
}


export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  let { viewUserPubkey, cluster } = req.query;
  if (cluster == undefined) {
    cluster = "devnet";
    //later to be changed to mainnet-beta
  }
  const wallets = await prisma.wallet.findMany();
  const membersdb = await prisma.membership.findMany();
  console.log(viewUserPubkey);
  console.log(viewUserPubkey.length);
  console.log(cluster);
  //console.log(await prisma.$queryRaw`SELECT * FROM wallet WHERE pubkey=( SELECT walletPubkey FROM membership WHERE membership.memberPubkey=${viewUserPubkey})`)
  //console.log(await prisma.$queryRaw`SELECT * FROM wallet WHERE authority=${viewUserPubkey} AND cluster=${cluster}`);
  const result: [] = await prisma.$queryRaw`SELECT * FROM wallet WHERE pubkey=( SELECT walletPubkey FROM membership WHERE membership.memberPubkey=${viewUserPubkey}) 
    UNION SELECT * FROM wallet WHERE authority=${viewUserPubkey} AND cluster=${cluster}`;

  console.log(result)

  if (result) {
    const memberwallet = await prisma.membership.findUnique({
      where: {
        cluster_walletPubkey_memberPubkey: {
          cluster: cluster as string,
          walletPubkey: result[0].pubkey as string,
          memberPubkey: viewUserPubkey as string
        }
      }
    })

    if (!memberwallet.validated) {
      if (await validateMember(cluster, viewUserPubkey)) {
        //setting members wallet validated parameter to true
        const setValidated = await prisma.membership.update({
          where: {
            cluster_walletPubkey_memberPubkey: {
              cluster: cluster as string,
              walletPubkey: result[0].pubkey as string,
              memberPubkey: viewUserPubkey as string
            },
          },
          data: {
            validated: {
              set: true
            }
          }
        })
      }
      else {
        //delete membership
        await prisma.membership.delete({
          where: {
            cluster_walletPubkey_memberPubkey: {
              cluster: cluster as string,
              walletPubkey: result[0].pubkey as string,
              memberPubkey: viewUserPubkey as string
            }
          }
        });
        res.status(200).json({ found: false });
        return;
      }
    }
  }

  let resultCleaned: [] = [];

  for (let index = 0; index < result.length; index++) {
    const element = result[index];
    if (element['cluster'] == cluster) {
      resultCleaned.push(element);
    }
  }

  if (result.length > 0) {
    res.status(200).json({
      found: true,
      in: resultCleaned
    });
    return;
  }
  res.status(200).json({ found: false });
}
