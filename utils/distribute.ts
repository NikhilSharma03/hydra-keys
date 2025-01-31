import { FanoutClient } from '@glasseaters/hydra-sdk'
import { PublicKey, Transaction } from '@solana/web3.js'
import { getNftOwner } from './utils'
import { memberShipTypes } from '@prisma/client';

type DistributeMemberArgs = {
  fanoutSdk: FanoutClient
  hydra: any
  payer: PublicKey
  member: PublicKey
  membershipModel: string
}

type DistributeAllArgs = {
  fanoutSdk: FanoutClient
  hydra: any
  payer: PublicKey
  members: PublicKey[]
  membershipModel: string
}

const distributeWalletMemberTransaction = async (
  args: DistributeMemberArgs
) => {
  const { fanoutSdk, hydra, payer, member } = args

  const tx = new Transaction()

  const ixDistSOL = await fanoutSdk.distributeWalletMemberInstructions({
    distributeForMint: false,
    fanout: new PublicKey(hydra.pubkey),
    payer,
    member,
  })

  tx.add(...ixDistSOL.instructions)

  if (hydra.acceptSPL) {
    const ixDistSPL = await fanoutSdk.distributeWalletMemberInstructions({
      distributeForMint: true,
      fanout: new PublicKey(hydra.pubkey),
      payer,
      member,
      fanoutMint: new PublicKey(hydra.splToken),
    })

    tx.add(...ixDistSPL.instructions)
  }

  return tx
}

const distributeNftMemberTransaction = async (args: DistributeMemberArgs) => {
  const { fanoutSdk, hydra, payer, member: nftMint } = args
  const connection = fanoutSdk.provider.connection

  const mintPubkey = new PublicKey(nftMint)
  const member = await getNftOwner(connection, mintPubkey)

  const tx = new Transaction()

  const ixDistSOL = await fanoutSdk.distributeNftMemberInstructions({
    distributeForMint: false,
    fanout: new PublicKey(hydra.pubkey),
    payer,
    membershipKey: mintPubkey,
    member,
  })

  tx.add(...ixDistSOL.instructions)

  if (hydra.acceptSPL) {
    const ixDistSPL = await fanoutSdk.distributeNftMemberInstructions({
      distributeForMint: true,
      fanout: new PublicKey(hydra.pubkey),
      payer,
      membershipKey: mintPubkey,
      member,
      fanoutMint: new PublicKey(hydra.splToken),
    })

    tx.add(...ixDistSPL.instructions)
  }

  return tx
}

const distributeMemberTransactionTable = {
  [memberShipTypes.Wallet]: distributeWalletMemberTransaction,
  [memberShipTypes.NFT]: distributeNftMemberTransaction,
}

export const distributeMemberTransaction = async (
  args: DistributeMemberArgs
): Promise<Transaction | undefined> => {
  const { membershipModel } = args
  const distributeFn = distributeMemberTransactionTable[membershipModel]
  return distributeFn ? distributeFn(args) : undefined
}

export const distributeAllTransaction = async (args: DistributeAllArgs) => {
  const { membershipModel, members } = args
  const distributeFn = distributeMemberTransactionTable[membershipModel]

  if (!distributeFn) {
    return undefined
  }

  const tx = new Transaction()
  const txMembers = await Promise.all(
    members.map((member) => distributeFn({ ...args, member }))
  )
  tx.add(...txMembers)

  return tx
}
