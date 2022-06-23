import { useWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import useSWR from 'swr'
import WalletsList from '../../components/WalletsList'

const fetcher = (key: string) => {
  if (key) {
    return fetch(key).then((res) => res.json())
  }
}

const Manage: NextPage = () => {
  const { publicKey, connected } = useWallet()
  const router = useRouter()
  const endpoint = publicKey ? `/api/wallets/user/${publicKey.toBase58()}` : ''
  const { data, error } = useSWR(endpoint, fetcher)

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
