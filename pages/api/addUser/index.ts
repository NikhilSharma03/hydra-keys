// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient } from '@prisma/client';
import { MembershipModel } from '@glasseaters/hydra-sdk';

const prisma=new PrismaClient();

export default async function handler(req, res) {
  if (req.method === 'POST') {
    console.log("post");
    const body=req.body;
    try{
      //Body for new user should be as follows:
      //memberPubkey
      //shareCount
      //walletPubkey 

      const user = await prisma.membership.create({
        data:{

          memberPubkey:body.memberPubkey,
          shareCount:body.shareCount,
          walletPubkey:body.walletPubkey,
          cluster:body.cluster,
          wallet:body.wallet

        }
      });
      console.log(user);
      console.log(body);
    }
    catch{
      console.log("error");
      return;
    }
    return;
  } else {
    res.status(200).json({found:false});
    return;
  }

}
