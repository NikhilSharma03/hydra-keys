import type { NextPage } from 'next'
import Head from 'next/head'

import HomeBannerSvg from '../assets/svg/homeBanner'
import ArrowSvg from '../assets/svg/arrow'
import styles from './../styles/Home.module.css'
import MidSection from '../components/MidSection'
import HomeCarousel from '../components/HomeCarousel'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'
import { useWallet } from '@solana/wallet-adapter-react'
import { useRouter } from 'next/router'
import { useWalletModal } from '@solana/wallet-adapter-react-ui'

const Home: NextPage = () => {
  const { publicKey } = useWallet()
  const walletModal = useWalletModal()
  const router = useRouter()

  const handleGetStarted = () => {
    if (publicKey) {
      // If user's wallet is connected
      router.push('/manage')
    } else {
      // Show connect wallet modal
      walletModal.setVisible(true)
    }
  }

  return (
    <div>
      <Head>
        <title>Hydra Wallet</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <HeroSection onHandleGetStarted={handleGetStarted} />
      <MidSection/>
      <HomeCarousel />
     

      <Footer/>
     
      
    </div>
  )
}

export default Home
