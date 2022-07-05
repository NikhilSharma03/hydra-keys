// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient,Wallet } from '@prisma/client';
import { MembershipModel } from '@glasseaters/hydra-sdk';

const prisma=new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    let { viewUserPubkey, cluster } = req.query;
    if(cluster==undefined){
      cluster="mainnet-beta";
    }
    const wallets=await prisma.wallet.findMany();
    const membersdb=await prisma.membership.findMany();
    console.log(viewUserPubkey);
    console.log(viewUserPubkey!.length);
    console.log(cluster);
    //console.log(await prisma.$queryRaw`SELECT * FROM wallet WHERE pubkey=( SELECT walletPubkey FROM membership WHERE membership.memberPubkey=${viewUserPubkey})`)
    //console.log(await prisma.$queryRaw`SELECT * FROM wallet WHERE authority=${viewUserPubkey} AND cluster=${cluster}`);
    const result: []  = await prisma.$queryRaw`SELECT * FROM wallet WHERE pubkey=( SELECT walletPubkey FROM membership WHERE membership.memberPubkey=${viewUserPubkey}) 
    UNION SELECT * FROM wallet WHERE authority=${viewUserPubkey} AND cluster=${cluster}`;

    console.log(result)

    let resultCleaned:[]=[];

    for (let index = 0; index < result.length; index++) {
      const element = result[index];
      if(element['cluster']==cluster){
        resultCleaned.push(element);
      }
    }

    if(result.length>0){
        res.status(200).json({found:true, 
            in:resultCleaned});
            return;
    }
      res.status(200).json({found:false});
  }
  