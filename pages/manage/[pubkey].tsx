import { useWallet } from '@solana/wallet-adapter-react'
import type { NextPage } from 'next'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import WalletDetails from '../../components/WalletDetails'

export const getServerSideProps = async (context: any) => {
  const pubKey = context.params.pubkey

  // get the Wallet details here
  const wallet = {
    pubKey: pubKey,
    name: 'MY WALLEEEEET',
    members: [
      {
        address: 'D4QYC..ioi',
        addedOn: 'April 15, 2022',
        shares: 23,
      },
      {
        address: 'D4QYC..ioi',
        addedOn: 'April 15, 2022',
        shares: 23,
      },
      {
        address: 'D4QYC..ioi',
        addedOn: 'April 15, 2022',
        shares: 23,
      },
      {
        address: 'D4QYC...ioi',
        addedOn: 'April 15, 2022',
        shares: 23,
      },
      {
        address: 'D4QYC...ioi',
        addedOn: 'April 15, 2022',
        shares: 23,
      },
    ],
    authority: 'D4QYC...ioi',
    shares: 100,
    model: 'Wallet membership',
    acceptSPL: false,
    pubKeySPL: null,
  }
  return {
    props: { wallet: wallet },
  }
}

interface Props {
  wallet: any
}

const WalletDetailsPage: NextPage<Props> = ({ wallet }) => {
  const { connected } = useWallet()
  const router = useRouter()

  useEffect(() => {
    if (router.isReady && !connected) {
      router.replace('/')
    }
  }, [router, connected])

  return (
    <div className="container mx-auto px-6 sm:px-0 gap-10 flex flex-col justify-center items-center my-10">
      <WalletDetails wallet={wallet} />
    </div>
  )
}

export default WalletDetailsPage
