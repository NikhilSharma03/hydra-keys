// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clusters, Membership, PrismaClient,Wallet } from '@prisma/client';
import { MembershipModel } from '@glasseaters/hydra-sdk';

const prisma=new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    let { viewUserPubkey, cluster } = req.query;
    if(cluster==undefined){
      cluster="mainnet_beta";
    }
    
    const wallets=await prisma.wallet.findMany(
      {
        where:{
          authority:viewUserPubkey.toString(),
          cluster:<keyof typeof clusters> cluster
        },
        
      }
    );

    const walletsUserIsIn=await prisma.membership.findMany({
      where:{
        memberPubkey:viewUserPubkey.toString(),
        cluster:<keyof typeof clusters> cluster
      }
    })

    const membersdb=await prisma.membership.findMany();
    console.log(viewUserPubkey);
    console.log(viewUserPubkey.length);
    console.log(wallets);
    console.log(walletsUserIsIn);

    let resultCleaned:Wallet[]=wallets;

    for (let index = 0; index < walletsUserIsIn.length; index++) {
      const element = walletsUserIsIn[index].walletPubkey;
      if(wallets.find(i=>i.pubkey === element)===undefined){ //Check if duplicates do not exist
        let toAppend=await prisma.wallet.findMany(
          {
            where:{
              pubkey:element,
              cluster:<keyof typeof clusters> cluster
            },
            
          }
        );
        resultCleaned.push(toAppend[0]);

      }

      
    }

    if(resultCleaned.length>0){
        res.status(200).json({found:true, 
            in:resultCleaned});
            return;
    }
      res.status(200).json({found:false});
  }
  