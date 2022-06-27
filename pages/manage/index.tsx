import { useWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import WalletsList from '../../components/WalletsList'

const Manage: NextPage = () => {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady && !connected) {
      router.replace('/')
    }
  }, [router, connected])

  return (
    <div className="container mx-auto pt-8 px-6 flex flex-col justify-start items-start">
      <h1 className="text-2xl font-extrabold font-['Nunito',sans-serif]">Your Hydra Wallets</h1>
      <WalletsList
        className="mt-12 w-full"
        wallets={[
          {
            name: 'MY WALLEEEEET',
            pubkey: 'D4QYCpdQ9wi9NZ8VpDf3TvdeMPkRGoj2MvoEBzEYYetf',
            authority:
              useWallet().publicKey?.toBase58() ||
              '3CNWNUgsX6b43ciMGysughdxzQ5NT89dQ2shcNG3xtFr',
          },
          {
            name: 'VeryUniqueName',
            pubkey: 'CEk6vf2HRZBx1ancEVafrkjSLzLiMJYKeegvxPVkFqZx',
            authority: 'GTiJiyNHcF5QXVEeqYJqHRcJHjgKn5AKjetPtJNMVtv7',
          },
          {
            name: 'EvenMoreUniqueName',
            pubkey: 'CEk9vf3HRZBx1ancEVVaafjSLzLiMJMMeegvxPVkFqZx',
            authority: 'GTiJiyNHcF5QXVEeqYJqHRcJHjgKn5AKjetPtJNMVtv7',
          },
        ]}
      />
    </div>
  )
}

export default Manage
