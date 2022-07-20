// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { clusters, Membership, PrismaClient, memberShipTypes } from '@prisma/client';
import { MembershipModel } from '@glasseaters/hydra-sdk';

const prisma=new PrismaClient();


export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
  ) {
    console.log(req.query);
    let { cluster, viewWalletPubkey } = req.query; 
    if(cluster==undefined){
        cluster="mainnet_beta";
    }
    console.log(viewWalletPubkey);
    const wallets=await prisma.wallet.findMany();
    const membersdb: Membership[] =await prisma.membership.findMany();
    console.log(wallets);
    console.log(membersdb);
    const result=await prisma.membership.findMany(
        {
          where:{
            walletPubkey:viewWalletPubkey.toString(),
            cluster:<keyof typeof clusters> cluster
          },
          
        }
      );
    //const result = await prisma.$queryRaw`SELECT * FROM membership WHERE walletPubkey=${viewWalletPubkey} AND cluster=${cluster}`;
    console.log("result");
    console.log(result);
    for (let index = 0; index < wallets.length; index++) {
        const element = wallets[index];
        console.log(element.pubkey); //I can do this since wallet addresses must be unique and there will be no two wallets with the same address
        if(element.pubkey===viewWalletPubkey && element.cluster==cluster){
            res.status(200).json({found:true, 
                wallet:element,members:result});

            return;
        }
        
    }
    
    res.status(200).json({found:false});
    
  }