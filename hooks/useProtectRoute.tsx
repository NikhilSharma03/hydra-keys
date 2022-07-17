import { useWallet } from "@solana/wallet-adapter-react"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const useProtectRoute = () => {
  const { connected, connecting } = useWallet()
  const router = useRouter()
  const [isFirstRender, setIsFirstRender] = useState(true)

  useEffect(() => {
    (async () => {
      if (isFirstRender) {
        await new Promise(resolve => setTimeout(resolve, 1000))
        setIsFirstRender(false)
      } else if (router.isReady && !connected && !connecting) {
        router.replace('/')
      }
    })()
  }, [isFirstRender, router, connected, connecting])
}
