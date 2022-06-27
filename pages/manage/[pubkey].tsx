import type { NextPage } from 'next'
import WalletDetails from '../../components/WalletDetails'

export const getServerSideProps = async (context: any) => {
  const pubKey = context.params.pubkey

  // get the Wallet details here
  const wallet = {
    pubKey: pubKey,
    name: 'MY WALLEEEEET',
    members: [],
    authority: '3CNWNUgsX6b43ciMGysughdxzQ5NT89dQ2shcNG3xtFr',
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
  return (
    <div className="container mx-auto px-6 sm:px-0 gap-10 flex flex-col justify-center items-center my-10">
      <WalletDetails initialWallet={wallet} />
    </div>
  )
}

export default WalletDetailsPage
