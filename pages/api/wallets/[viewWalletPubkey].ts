// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { Membership, PrismaClient } from '@prisma/client';
import { Connection, clusterApiUrl, Cluster, PublicKey } from '@solana/web3.js'

import { Fanout } from '@glasseaters/hydra-sdk';

const prisma = new PrismaClient();

async function validateWallet(cluster, viewWalletPubkey) {
    const connection = new Connection(clusterApiUrl(cluster as Cluster), 'confirmed')
    try {
        let publickey = new PublicKey(viewWalletPubkey);
        await Fanout.fromAccountAddress(connection, publickey).then(data => {
            console.log(data);
        });
        return true;
    }
    catch (error: any) {
        console.log('wallet not on blockchain');
        return false;
    }
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    console.log(req.query);
    let { cluster, viewWalletPubkey } = req.query;
    if (cluster == undefined) {
        cluster = "devnet";//can later change to mainnet-beta
    }

    console.log(viewWalletPubkey);
    const wallets = await prisma.wallet.findMany();
    const membersdb: Membership[] = await prisma.membership.findMany();
    console.log(wallets);
    console.log(membersdb);
    const result = await prisma.$queryRaw`SELECT * FROM membership WHERE walletPubkey=${viewWalletPubkey} AND cluster=${cluster}`;
    console.log("result");
    console.log(result);



    for (let index = 0; index < wallets.length; index++) {
        const element = wallets[index];
        console.log(element.pubkey); //I can do this since wallet addresses must be unique and there will be no two wallets with the same address
        if (element.pubkey === viewWalletPubkey && element.cluster == cluster) {
            if (element.validated) {
                res.status(200).json({
                    found: true,
                    wallet: element, members: result
                });
                return;
            }
            else {
                if (await validateWallet(cluster, viewWalletPubkey)) {
                    res.status(200).json({
                        found: true,
                        wallet: element, members: result
                    });
                    const setValidated = await prisma.wallet.update({
                        where: {
                            cluster_pubkey: {
                                pubkey: viewWalletPubkey,
                                cluster: cluster,
                            },
                        },
                        data: {
                            validated: {
                                set: true
                            }
                        }
                    })
                    element.validated = true;
                    return;
                }
                else {
                    await prisma.wallet.delete({
                        where: {
                            cluster_pubkey: {
                                pubkey: viewWalletPubkey,
                                cluster: cluster,
                            },
                        },
                    })
                    console.log('wallet deleted');
                    res.status(200).json({ found: false });
                    return;

                }
            }

        }

    }

    res.status(200).json({ found: false });

}