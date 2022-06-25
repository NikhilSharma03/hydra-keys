import { Cluster } from '@solana/web3.js'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { useAppSelector } from '../hooks/useAppSelector'
import {
  changeCluster,
  selectCluster,
} from '../redux/features/wallet/walletSlice'

type ClusterPickerItemProps = {
  text: string
  value: Cluster
  activeClass?: string
  className?: string
}

const ClusterPickerItem = ({
  text,
  value,
  activeClass,
  className,
}: ClusterPickerItemProps) => {
  const dispatch = useAppDispatch()
  const cluster = useAppSelector(selectCluster)

  return (
    <a
      className={`${cluster === value ? activeClass ?? 'bg-primary' : ''} ${
        className ?? ''
      }`}
      onClick={() => dispatch(changeCluster(value))}
    >
      {text}
    </a>
  )
}

export default ClusterPickerItem
