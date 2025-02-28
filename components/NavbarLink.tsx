import Link from "next/link"
import { useRouter } from "next/router"

import styles from '../styles/NavbarLink.module.css'

type NavbarLinkProps = {
  text: string,
  href: string,
  isActive: Function
}

const NavbarLink = ({ text, href, isActive }: NavbarLinkProps) => {
  const router = useRouter()
  const activeStyle = isActive(router.pathname,href) ? styles.halfBorderBottom : ''

  return (
    <Link href={href}>
      <a className={`${activeStyle} text-black dark:text-white`}>{text}</a>
    </Link>
  )
}

export default NavbarLink
