import { useState } from "react"
import { FaCheck, FaCopy } from "react-icons/fa"

type CopyToClipboardProps = {
  text: string
}

const CopyToClipboard = ({ text }: CopyToClipboardProps) => {
  const [copied, setCopied] = useState(false)

  const copyText = () => {
    navigator.clipboard.writeText(text)
      .then(() => {
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      })
      .catch(error => console.error(error))
  }

  return (
    <span className="btn btn-secondary" onClick={copyText}>
      { copied ? <FaCheck /> : <FaCopy /> }
    </span>
  )
}

export default CopyToClipboard
