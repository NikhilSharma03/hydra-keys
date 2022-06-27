import { Cluster } from "@solana/web3.js"
import { useAppDispatch } from "../hooks/useAppDispatch"
import { useAppSelector } from "../hooks/useAppSelector"
import { changeCluster, selectCluster } from "../redux/features/wallet/walletSlice"

const ClusterPicker = () => {
  const cluster = useAppSelector(selectCluster)
  const dispatch = useAppDispatch()

  return (
    <select
      className="select select-primary"
      value={cluster}
      onChange={(e) => dispatch(changeCluster(e.target.value as Cluster))}
    >
      <option value="devnet">Devnet</option>
      <option value="mainnet-beta">Mainnet</option>
    </select>
  )
}

export default ClusterPicker
