import { PublicKey } from '@solana/web3.js'
import { TOKEN_PROGRAM_ID } from '@solana/spl-token'

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
