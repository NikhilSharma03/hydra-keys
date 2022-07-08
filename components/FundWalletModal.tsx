import { FanoutClient } from '@glasseaters/hydra-sdk'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import {
  LAMPORTS_PER_SOL,
  PublicKey,
  SystemProgram,
  Transaction,
} from '@solana/web3.js'
import { FormikErrors, useFormik } from 'formik'
import { useEffect, useState } from 'react'
import CopyToClipboard from './CopyToClipboard'
import FormStateAlert, { FormState } from './FormStateAlert'

type FundWalletModalProps = {
  modalId: string
  hydraWallet: any
}

interface FormValues {
  amount: number
}

const FundWalletModal = ({ modalId, hydraWallet }: FundWalletModalProps) => {
  const [formState, setFormState] = useState('idle' as FormState)
  const [errorMsg, setErrorMsg] = useState('')
  const [errorLogs, setErrorLogs] = useState([])
  const [nativeAccount, setNativeAccount] = useState('')
  const { connection } = useConnection()
  const wallet = useAnchorWallet()

  const initialValues = {
    amount: 0,
  }

  useEffect(() => {
    (async () => {
      try {
        const [derivedNativeAccount] = await FanoutClient.nativeAccount(
          new PublicKey(hydraWallet.pubkey)
        )
        setNativeAccount(derivedNativeAccount.toBase58())
      } catch (error) {
        console.error(error)
      }
    })()
  }, [hydraWallet.pubkey])

  const onSubmit = async (values: FormValues, { resetForm }) => {
    if (!wallet) {
      setFormState('error')
      setErrorMsg('Please connect your wallet!')
      return
    }

    try {
      setErrorLogs([])

      // Prepare transaction
      const tx = new Transaction()
      const ixTransfer = SystemProgram.transfer({
        fromPubkey: wallet.publicKey,
        toPubkey: new PublicKey(nativeAccount),
        lamports: values.amount * LAMPORTS_PER_SOL,
      })
      tx.add(ixTransfer)

      // Sign transaction using user's wallet
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = wallet.publicKey
      const txSigned = await wallet.signTransaction(tx)

      // Send transaction
      const signature = await connection.sendRawTransaction(
        txSigned.serialize()
      )
      const result = await connection.confirmTransaction({
        signature,
        ...(await connection.getLatestBlockhash()),
      })

      if (result.value.err) {
        setFormState('error')
        setErrorMsg(
          `Failed to confirm transaction: ${result.value.err.toString()}`
        )
      } else {
        setFormState('success')
        resetForm()
      }
    } catch (error: any) {
      setErrorLogs(error.logs)
      setFormState('error')
      setErrorMsg(`Failed to fund wallet: ${error.message}`)
    }
  }

  const validate = (values: FormValues) => {
    const errors: FormikErrors<FormValues> = {}

    if (!values.amount || values.amount < 0) {
      errors.amount = 'Please enter a valid amount to transfer'
    }

    return errors
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })

  return (
    <div>
      <input
        type="checkbox"
        id={modalId}
        className="modal-toggle"
        onChange={(event) => {
          if (!event.target.checked) {
            setFormState('idle')
          }
        }}
      />
      <label htmlFor={modalId} className="modal cursor-pointer">
        <label className="modal-box relative" htmlFor="">
          <h3 className="text-lg font-bold">Fund Hydra Wallet</h3>
          <form className="py-4" onSubmit={formik.handleSubmit}>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Hydra Wallet Native Account</span>
              </label>
              <div className="flex flex-row items-center gap-2">
                <input
                  type="text"
                  className="input input-bordered w-full flex-1"
                  value={nativeAccount}
                  readOnly
                />
                <CopyToClipboard text={nativeAccount} />
              </div>
            </div>
            <div className="form-control w-full">
              <label className="label">
                <span className="label-text">Amount (SOL)</span>
              </label>
              <input
                type="number"
                className="input input-bordered w-full"
                {...formik.getFieldProps('amount')}
              />
              <label className="label">
                <span className="label-text-alt text-red-500">
                  {formik.errors.amount}
                </span>
              </label>
            </div>
            <FormStateAlert
              state={formik.isSubmitting ? 'submitting' : formState}
              submittingMsg={'Sending funds to Hydra Wallet...'}
              successMsg={'Successfully transferred funds to Hydra Wallet!'}
              errorMsg={errorMsg}
              logs={errorLogs}
            />
            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={
                  !(formik.dirty && formik.isValid) || formik.isSubmitting
                }
              >
                Send
              </button>
              <label htmlFor={modalId} className="btn">
                Cancel
              </label>
            </div>
          </form>
        </label>
      </label>
    </div>
  )
}

export default FundWalletModal
