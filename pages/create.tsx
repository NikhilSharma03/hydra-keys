import type { NextPage } from 'next'

import CreateWalletForm from '../components/CreateWalletForm'
import { useProtectRoute } from '../hooks/useProtectRoute'

const Create: NextPage = () => {
  useProtectRoute()

  return (
    <div className="container mx-auto gap-10 flex flex-col justify-center items-center my-10">
      <h1 className="w-full text-center md:text-left text-3xl md:text-4xl font-bold text-primary dark:text-white">
        Create a Hydra Wallet
      </h1>
      <CreateWalletForm />
    </div>
  )
}

export default Create
