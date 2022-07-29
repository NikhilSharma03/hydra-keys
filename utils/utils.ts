import { Connection, PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'
// @ts-ignore
import { getAccount } from '@solana/spl-token'

export const isValidPubKey = (key: string) => {
  try {
    new PublicKey(key)
  } catch (e) {
    return e
  }

  return null
}

export const walletHasSplToken = async (
  connection,
  pubKey: string,
  splToken: string
) => {
  let accounts = await connection.getParsedTokenAccountsByOwner(
    new PublicKey(pubKey),
    { programId: TOKEN_PROGRAM_ID }
  )

  accounts = accounts.value.map((account) => account.account.data.parsed.info.mint)

  return accounts.includes(splToken)
}

// Reference: https://github.com/solana-labs/solana/blob/b05c7d91ed4e0279ec622584edb54c9ef8547ad1/account-decoder/src/parse_token.rs#L200-L220
export const rawAmountToRealString = (rawAmount: string, decimals: number) => {
  if (decimals === 0) {
    return rawAmount
  }

  // Left-pad with zeros
  let amount = rawAmount.padStart(decimals + 1, '0')

  // Insert decimal point
  const decimalPoint = amount.length - decimals
  amount = amount.slice(0, decimalPoint) + '.' + amount.slice(decimalPoint)

  // Remove trailing zeros and trailing decimal point
  amount = amount.replace(/0+$/, '')
  amount = amount.replace(/\.$/, '')

  return amount
}

export const getNftOwner = async (
  connection: Connection,
  mintPubkey: PublicKey
) => {
  const tokenAccountAddress = (
    await connection.getTokenLargestAccounts(mintPubkey)
  ).value[0].address

  return (await getAccount(connection, tokenAccountAddress)).owner
}
