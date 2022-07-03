// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient } from '@prisma/client';
import { MembershipModel } from '@glasseaters/hydra-sdk';

const prisma=new PrismaClient();

export default function handler(    
    req,
    res) {
    console.log("hello")
    //console.log(req.body);
    if (req.method !== 'POST') {
      res.status(405).send({ message: 'Only POST requests allowed' });
      return;
    }
    const body = JSON.parse(req.body)

    

  }