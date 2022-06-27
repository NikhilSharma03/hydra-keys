import type { NextPage } from 'next'

const FourOhFour: NextPage = () => {
  return (
    <div className="container mx-auto gap-10 flex flex-col justify-center items-center my-10">
      <h1 className="w-full text-center md:text-center text-3xl md:text-4xl font-bold text-primary dark:text-white">
        404 | Page not found
      </h1>
    </div>
  )
}

export default FourOhFour
