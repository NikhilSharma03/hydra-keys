import { WalletAdapterNetwork } from '@solana/wallet-adapter-base'
import {
  ConnectionProvider,
  WalletProvider,
} from '@solana/wallet-adapter-react'
import {
  WalletModalProvider,
  WalletMultiButton,
} from '@solana/wallet-adapter-react-ui'
import {
  GlowWalletAdapter,
  PhantomWalletAdapter,
  SlopeWalletAdapter,
  SolflareWalletAdapter,
  TorusWalletAdapter,
} from '@solana/wallet-adapter-wallets'
import { clusterApiUrl } from '@solana/web3.js'
import { ReactElement, useMemo } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectCluster } from '../redux/features/wallet/walletSlice'
import {
  selectSidebarActive,
  toggleSidebar,
} from '../redux/features/sidebar/sidebarSlice'
import { useAppDispatch } from '../hooks/useAppDispatch'
import Navbar from './Navbar'
import SidebarLink from './SidebarLink'

import styles from '../styles/Layout.module.css'
import ClusterPickerItem from './ClusterPickerItem'

require('@solana/wallet-adapter-react-ui/styles.css')

type LayoutProps = {
  children: ReactElement
}

const Layout = ({ children }: LayoutProps) => {
  const cluster = useAppSelector(selectCluster)

  const wallets = useMemo(
    () => [
      new PhantomWalletAdapter(),
      new GlowWalletAdapter(),
      new SlopeWalletAdapter(),
      new SolflareWalletAdapter({
        network: cluster as WalletAdapterNetwork,
      }),
      new TorusWalletAdapter(),
    ],
    [cluster]
  )

  const sidebarActive = useAppSelector(selectSidebarActive)
  const dispatch = useAppDispatch()

  return (
    <ConnectionProvider endpoint={clusterApiUrl(cluster)}>
      <WalletProvider wallets={wallets} autoConnect>
        <WalletModalProvider>
          <div className="min-h-screen">
            <div className="drawer">
              <input
                id="nav-drawer"
                type="checkbox"
                className="drawer-toggle"
                checked={sidebarActive}
                readOnly={true}
              />
              <div className="drawer-content">
                <Navbar drawerId="nav-drawer" />
                {children}
                {/* Insert common content (e.g.: footer) here */}
              </div>
              <div className="drawer-side">
                <label
                  htmlFor="nav-drawer"
                  className="drawer-overlay"
                  onClick={() => dispatch(toggleSidebar())}
                ></label>
                <div className="menu p-4 overflow-y-auto w-80 bg-base-100 text-base-content">
                  <div className={styles.walletBtnParent}>
                    <WalletMultiButton />
                    <div className="flex flex-row justify-between items-center gap-2">
                      <ClusterPickerItem
                        text="Devnet"
                        value="devnet"
                        activeClass="bg-secondary"
                        className="btn btn-ghost flex-1"
                      />
                      <ClusterPickerItem
                        text="Mainnet"
                        value="mainnet-beta"
                        activeClass="bg-secondary"
                        className="btn btn-ghost flex-1"
                      />
                    </div>
                  </div>
                  <hr className="my-4" />
                  <ul className="flex flex-col gap-2">
                    <li>
                      <SidebarLink href="/create" text="Create" />
                    </li>
                    <li>
                      <SidebarLink href="/manage" text="Manage" />
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Layout
