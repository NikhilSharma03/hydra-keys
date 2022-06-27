import type { NextPage } from 'next'
import Image from 'next/image'
import Link from 'next/link'

const FourOhFour: NextPage = () => {
  return (
    <div className="container mx-auto gap-10 flex flex-col justify-center items-center my-0 min-h-[70%]">
      <Image
        src="/404.png"
        layout="fixed"
        width="150px"
        height="150px"
        className="shadow-2xl"
      />
      <h1 className="w-full text-center md:text-center text-6xl sm:text-6xl md:text-7xl lg:text-8xl font-bold text-primary dark:text-white">
        404
      </h1>
      <p className="w-full text-center md:text-center text-xl md:text-2xl font-bold text-primary p-1 px-5 dark:text-white">
        Hey Captain! Looks like you're heading to a wrong planet!
      </p>
      <Link href="/" passHref>
        <button className="btn w-fit btn-secondary px-6 text-lg font-normal">
          Back to homepage
        </button>
      </Link>
    </div>
  )
}

export default FourOhFour
