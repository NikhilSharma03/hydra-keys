import { useWallet } from '@solana/wallet-adapter-react'
import Link from 'next/link'

import styles from '../styles/WalletsList.module.css'

export interface WalletInfo {
  memberShipType: string
  name: string
  pubkey: string
  authority: string
}

type WalletsListProps = {
  className?: string
  wallets: WalletInfo[]
}

const WalletsList = ({ className, wallets }: WalletsListProps) => {
  const pubkey = useWallet().publicKey?.toBase58()

  const shortenPubkey = (pubkey: string) => {
    return pubkey.length > 10
      ? `${pubkey.slice(0, 7)}...${pubkey.slice(pubkey.length - 3)}`
      : pubkey
  }

  return (
    <div
      className={`${
        className || ''
      } border-[1px] border-base-content rounded-lg`}
    >
      {wallets.length ? (
        <ul className={styles.walletsList}>
          {wallets.map((wallet) => (
            <li key={wallet.pubkey}>
              <Link href={`/manage/${wallet.pubkey}`}>
                <a>
                  <span>{wallet.name}</span>
                  <span>
                    Created by:{' '}
                    {wallet.authority === pubkey
                      ? 'You'
                      : shortenPubkey(wallet.authority)}
                  </span>
                  <span>{wallet.memberShipType}</span>
                </a>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-center p-6">No wallets to show</p>
      )}
    </div>
  )
}

export default WalletsList
