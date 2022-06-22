import { useWallet } from '@solana/wallet-adapter-react'
import { PublicKey } from '@solana/web3.js'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import WalletsList from '../../components/WalletsList'

const fetcher = (pubkey: PublicKey) => {
  if (pubkey !== null) {
    return fetch(`/api/wallets/user/${pubkey.toBase58()}`).then((res) =>
      res.json()
    )
  }
}

const Manage: NextPage = () => {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const { data, error } = useSWR(publicKey, fetcher)

  useEffect(() => {
    if (router.isReady && !connected) {
      router.replace('/')
    }
  }, [router, connected])

  if (publicKey === null) {
    return <p className="text-center">Please connect your wallet</p>
  }

  if (error) {
    return <p className="text-center">Failed to load wallets</p>
  }

  if (!data) {
    return <p className="text-center">Loading...</p>
  }

  return (
    <div className="container mx-auto pt-8 px-6 flex flex-col justify-start items-start">
      <h1 className="text-2xl font-extrabold font-nunito">
        Your Hydra Wallets
      </h1>
      <WalletsList
        className="mt-12 w-full"
        wallets={data.found ? data.in : []}
      />
    </div>
  )
}

export default Manage
