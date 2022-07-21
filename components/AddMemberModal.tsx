import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { FormikErrors, useFormik } from 'formik'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectCluster } from '../redux/features/wallet/walletSlice'
import { useState } from 'react'
import { useRef } from 'react'
import { FanoutClient } from '@glasseaters/hydra-sdk'
import { PublicKey, Transaction } from '@solana/web3.js'
import FormStateAlert, { FormState } from './FormStateAlert'
import { useSWRConfig } from 'swr'

type AddMemberModalProps = {
  hydraWallet: any
  availableShares: number
}

interface FormValues {
  pubkey: string
  shares: number
}

const AddMemberModal = ({
  hydraWallet,
  availableShares,
}: AddMemberModalProps) => {
  let toggleRef = useRef<HTMLInputElement>(null)
  const { mutate } = useSWRConfig()

  const initialValues = {
    pubkey: '',
    shares: '0',
  }

  const { connection } = useConnection()
  const cluster = useAppSelector(selectCluster)
  const wallet = useAnchorWallet()

  const [formState, setFormState] = useState('idle' as FormState)
  const [errorMsg, setErrorMsg] = useState('')
  const [logs, setLogs] = useState([])

  const onSubmit = async (values: any, { resetForm }) => {
    console.log('submitted', values)
    // add the wallet member here
    if (!wallet) {
      setFormState('error')
      setErrorMsg('Please connect your wallet!')
      return
    }

    try {
      setLogs([])
      const fanoutSdk = new FanoutClient(connection, wallet)

      // Prepare transaction
      const tx = new Transaction()
      const ixAddMember = await fanoutSdk.addMemberWalletInstructions({
        fanout: new PublicKey(hydraWallet.pubkey),
        membershipKey: new PublicKey(values.pubkey),
        shares: values.shares,
      })
      tx.add(...ixAddMember.instructions)

      // Sign transaction using user's wallet
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = wallet.publicKey
      const txSigned = await wallet.signTransaction(tx)

      //Send API request
      const res = await fetch('/api/addUser', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: txSigned?.serialize().toString('base64'),
          memberPubkey: values.pubkey,
          shareCount: values.shares,
          walletPubKey: hydraWallet.pubkey,
          cluster,
        }),
      })

      if (res.status === 200) {
        setFormState('success')
        // Revalidate wallet details cache
        setTimeout(function () {
          mutate(`/api/wallets/${hydraWallet.pubkey}?cluster=${cluster}`)
        }, 1000)
      } else {
        mutate(`/api/wallets/${hydraWallet.pubkey}?cluster=${cluster}`)
        const json = await res.json()
        setFormState('error')
        setErrorMsg(json.msg)
        setLogs(json.logs)
        setTimeout(function () {
          setFormState('idle')
        }, 5000)
      }
      resetForm()
    } catch (error: any) {
      setFormState('error')
      setErrorMsg(`Failed to add member: ${error.message}`)
      setTimeout(function () {
        setFormState('idle')
      }, 2000)
    }
  }

  const validate = (values: any) => {
    let errors: FormikErrors<FormValues> = {}

    if (!values.pubkey) {
      errors.pubkey = 'This field is required'
    }

    if (!values.shares) {
      errors.shares = 'Enter a valid number of shares'
    }

    if (values.shares > availableShares) {
      errors.shares = `You only have ${availableShares} available shares`
    }

    return errors
  }

  const checkNumeric = (event: any) => {
    if (event.key == '.' || event.key == '-') {
      event.preventDefault()
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <input
          type="checkbox"
          id="add-member-modal"
          className="modal-toggle"
          ref={toggleRef}
        />
        <label
          htmlFor="add-member-modal"
          className="modal modal-bottom sm:modal-middle"
        >
          <label htmlFor="" className="modal-box">
            <h3 className="font-bold text-lg pb-2">
              Add a member to your Wallet
            </h3>
            <label className="label">Public key:</label>
            <input
              type="text"
              placeholder="Enter the member's public key"
              className="input input-bordered w-full"
              {...formik.getFieldProps('pubkey')}
            />
            {formik.errors.pubkey && formik.touched.pubkey ? (
              <div className="mt-2 text-red-500">{formik.errors.pubkey}</div>
            ) : null}

            <label className="label">Shares:</label>
            <input
              type="number"
              placeholder="Enter the member's shares"
              className="input input-bordered w-full"
              onKeyPress={(event) => checkNumeric(event)}
              {...formik.getFieldProps('shares')}
            />

            {formik.errors.shares ? (
              <div className="mt-2 text-red-500">{formik.errors.shares}</div>
            ) : null}

            <div className="mt-4">
              <FormStateAlert
                state={formik.isSubmitting ? 'submitting' : formState}
                submittingMsg="Adding Member to Hydra Wallet..."
                successMsg="Successfully added member!"
                errorMsg={errorMsg}
                logs={logs}
              />
            </div>

            <div className="flex w-full justify-end gap-4">
              <div className="modal-action">
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={
                    !(formik.dirty && formik.isValid) || formik.isSubmitting
                  }
                >
                  Add
                </button>
              </div>
              <div className="modal-action">
                <label
                  className="btn"
                  htmlFor="add-member-modal"
                  onClick={() => {
                    setFormState('idle' as FormState)
                  }}
                >
                  Cancel
                </label>
              </div>
            </div>
          </label>
        </label>
      </form>
    </div>
  )
}

export default AddMemberModal
