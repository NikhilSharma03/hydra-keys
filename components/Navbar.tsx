import { WalletMultiButton } from '@solana/wallet-adapter-react-ui'
import Image from 'next/image'
import Link from 'next/link'
import NavbarLink from './NavbarLink'
import ThemeToggle from './ThemeToggle'

import styles from '../styles/Navbar.module.css'
import { useAppDispatch } from '../hooks/useAppDispatch'
import { toggleSidebar } from '../redux/features/sidebar/sidebarSlice'
import ClusterPicker from './ClusterPicker'

type NavbarProps = {
  drawerId: string
}

const Navbar = ({ drawerId }: NavbarProps) => {
  const dispatch = useAppDispatch()

  return (
    <div className="container mx-auto flex flex-row justify-between items-center p-6 sm:px-0">
      <div className="flex flex-row justify-start items-center gap-10">
        <Link href="/">
          <a className="leading-[0] relative w-[60px] h-[60px] sm:w-[90px] sm:h-[90px]">
            <Image
              src="/logo.png"
              alt="Hydra Wallet logo"
              layout="fill"
              className="grayscale dark:brightness-0 dark:invert"
            />
          </a>
        </Link>
        <Link href="/">
          <a>
            <h1 className="hidden md:block text-lg font-bold dark:text-[#F9F8F8]">
              Hydra Wallet
            </h1>
          </a>
        </Link>
      </div>
      <div className="flex flex-row justify-end items-center gap-4 sm:gap-8">
        <div className="hidden sm:flex flex-row gap-6 justify-end items-center">
          <NavbarLink href="/create" text="Create" />
          <NavbarLink href="/manage" text="Manage" />
        </div>
        <ThemeToggle />
        <div className={styles.walletBtnParent}>
          <ClusterPicker />
          <WalletMultiButton />
        </div>
        <label
          htmlFor={drawerId}
          className="btn btn-square btn-ghost drawer-button sm:hidden"
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="dark:text-white inline-block w-7 h-7 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16M4 18h16"
            ></path>
          </svg>
        </label>
      </div>
    </div>
  )
}

export default Navbar
