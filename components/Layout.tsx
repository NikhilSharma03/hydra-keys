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
import DrawerMenu from './DrawerMenu'

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
                <DrawerMenu />
              </div>
            </div>
          </div>
        </WalletModalProvider>
      </WalletProvider>
    </ConnectionProvider>
  )
}

export default Layout
