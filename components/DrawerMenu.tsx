import { useWallet } from '@solana/wallet-adapter-react'
import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import styles from '../styles/DrawerMenu.module.css'
import ClusterPickerItem from './ClusterPickerItem'
import SidebarLink from './SidebarLink'

const DrawerMenu = () => {
  const { publicKey } = useWallet()

  return (
    <div className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
      <div className={styles.walletBtnParent}>
        <WalletMultiButton />
        <div className="flex flex-row justify-between items-center gap-2">
          <ClusterPickerItem
            text="Devnet"
            value="devnet"
            activeClass="bg-secondary text-secondary-content"
            className="btn btn-ghost flex-1"
          />
          <ClusterPickerItem
            text="Mainnet"
            value="mainnet-beta"
            activeClass="bg-secondary text-secondary-content"
            className="btn btn-ghost flex-1"
          />
        </div>
      </div>
      <hr className="my-4" />
      <ul className={publicKey ? '' : 'hidden'}>
        <li>
          <SidebarLink href="/create" text="Create" />
        </li>
        <li>
          <SidebarLink href="/manage" text="Manage" />
        </li>
      </ul>
    </div>
  )
}

export default DrawerMenu
