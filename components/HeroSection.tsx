import HomeBannerSvg from '../assets/svg/homeBanner'
import ArrowSvg from '../assets/svg/arrow'
import styles from './../styles/Home.module.css'

const HeroSection = ({ onHandleGetStarted }) => {
  return (
    <main className="overflow-hidden py-5 ">
      <div className="flex w-full h-screen max-h-[85vh] relative">
        <div className="w-full xl:w-1/2 lg:w-7/12 md:w-9/12 sm:w-full flex flex-col justify-center p-10 sm:p-20">
          <h1 className="font-bold text-2xl sm:text-left text-[#3F3D56] dark:text-[#E4E4E4] mb-8">
            What is Hydra ?
          </h1>
          <p className="font-normal text-xl text-center sm:text-left text-[rgb(0,0,0)] dark:text-[#F9F8F8] mb-8 sm:pr-10">
            Hydra is a wallet of wallets. It enables extremely large membership
            sets that can take part in fund distribution from a central wallet.
            It works with SOL and any SPL token.
          </p>
          <div className="flex justify-start items-center gap-5 flex-col sm:flex-row">
            <button className="btn w-8/12 sm:w-fit btn-secondary px-6 text-lg font-normal">
              Keep Exploring <ArrowSvg width="17px" height="17px" fill="#fff" />
            </button>
            <button
              onClick={onHandleGetStarted}
              className="btn w-8/12	sm:w-fit btn-primary px-6 text-lg font-normal"
            >
              Get Started{' '}
              <ArrowSvg
                width="17px"
                height="17px"
                fill="#fff"
                className={styles.heroButton}
              />
            </button>
          </div>
        </div>
        <div className="w-full md:w-1/2 flex justify-end items-center absolute top-1/2 right-0 -translate-y-1/2 -z-10">
          <HomeBannerSvg
            className={styles.homeBannerSvg}
            width="90%"
            height="90%"
          />
        </div>
      </div>
    </main>
  )
}

export default HeroSection
