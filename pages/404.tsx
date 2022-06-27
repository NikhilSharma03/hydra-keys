import type { NextPage } from 'next'
import Image from 'next/image'

const FourOhFour: NextPage = () => {
  return (
    <div className="container mx-auto gap-10 flex flex-col justify-center items-center my-10">
      <Image src="/404.png" layout="fixed" width="150px" height="150px" />
      <h1 className="w-full text-center md:text-center text-3xl md:text-4xl font-bold text-primary dark:text-white">
        404 | Page not found
      </h1>
    </div>
  )
}

export default FourOhFour
