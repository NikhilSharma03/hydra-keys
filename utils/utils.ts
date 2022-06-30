import { PublicKey } from '@solana/web3.js'

export const isValidPubKey = (key: string) => {
  try {
    new PublicKey(key)
  } catch (e) {
    return e
  }

  return null
}
