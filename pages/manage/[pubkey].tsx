import type { NextPage } from 'next'
import WalletDetails from '../../components/WalletDetails'
import LoadingSpinner from '../../components/LoadingSpinner'
import { useAppSelector } from '../../hooks/useAppSelector'
import { selectCluster } from '../../redux/features/wallet/walletSlice'
import useSWR from 'swr'
import { useProtectRoute } from '../../hooks/useProtectRoute'
import { useRouter } from 'next/router'

const fetcher = (key: string) => {
  if (key) {
    return fetch(key).then((res) => res.json())
 }
}

const WalletDetailsPage: NextPage = () => {
  const router = useRouter()
  const pubKey = router.query.pubkey
  const cluster = useAppSelector(selectCluster)

  useProtectRoute()

  const endpoint = pubKey ? `/api/wallets/${pubKey}?cluster=${cluster}` : ''
  const { data, error } = useSWR(endpoint, fetcher)

  if (error) {
    return <p className="text-center">Failed to load wallet</p>
  }

  if (!data) {
    return (
      <div className="flex flex-row justify-center items-center">
        <LoadingSpinner />
      </div>
    )
  }

  return (
    <div className="container mx-auto px-6 sm:px-0 gap-10 flex flex-col justify-center items-center my-10">
      <WalletDetails
        wallet={data.found ? data.wallet : {}}
        members={data.found ? data.members : []}
      />
    </div>
  )
}

export default WalletDetailsPage
