import type { NextPage } from 'next'
import WalletDetails from '../../components/WalletDetails'
import { useProtectRoute } from '../../hooks/useProtectRoute'

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
    acceptSPL: true,
    pubKeySPL: '2msQ3eha1rvhSuwCPJ213oVgwtu3FSgxBXS6RPrzsDWB',
  }
  return {
    props: { wallet: wallet },
  }
}

interface Props {
  wallet: any
}

const WalletDetailsPage: NextPage<Props> = ({ wallet }) => {
  useProtectRoute()

  return (
    <div className="container mx-auto px-6 sm:px-0 gap-10 flex flex-col justify-center items-center my-10">
      <WalletDetails wallet={wallet} />
    </div>
  )
}

export default WalletDetailsPage
