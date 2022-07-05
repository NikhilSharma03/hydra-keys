import { FanoutClient, MembershipModel } from '@glasseaters/hydra-sdk'
import { useAnchorWallet, useConnection } from '@solana/wallet-adapter-react'
import { PublicKey, Transaction } from '@solana/web3.js'
import { FormikErrors, useFormik } from 'formik'
import { useState } from 'react'
import { useAppSelector } from '../hooks/useAppSelector'
import { selectCluster } from '../redux/features/wallet/walletSlice'
import FormStateAlert, { FormState } from './FormStateAlert'
import { useRouter } from 'next/router'

interface FormValues {
  name: string
  shares: number
  model: string
  acceptSPL: boolean
  pubKeySPL: string
}

const membershipModel: Record<string, MembershipModel> = {
  'Wallet membership': MembershipModel.Wallet,
  'NFT membership': MembershipModel.NFT,
  'Token membership': MembershipModel.Token,
}

const CreateWalletForm = () => {
  const initialValues = {
    name: '',
    shares: 0,
    model: 'Wallet membership',
    acceptSPL: false,
    pubKeySPL: '',
  }

  const router = useRouter()
  const { connection } = useConnection()
  const wallet = useAnchorWallet()
  const cluster = useAppSelector(selectCluster)

  const [formState, setFormState] = useState('idle' as FormState)
  const [errorMsg, setErrorMsg] = useState('')
  const [logs, setLogs] = useState([])

  const onSubmit = async (values: any) => {
    if (!wallet) {
      setFormState('error')
      setErrorMsg('Please connect your wallet!')
      return
    }

    try {
      setLogs([])
      const fanoutSdk = new FanoutClient(connection, wallet)

      // Calculate fanout public key
      const [fanoutPubkey] = await FanoutClient.fanoutKey(values.name)

      // Prepare transaction
      const tx = new Transaction()
      const ixInit = await fanoutSdk.initializeFanoutInstructions({
        name: values.name,
        totalShares: values.shares,
        membershipModel: membershipModel[values.model],
        // TODO: Add mint public key for token membership to UI and here
      })
      tx.add(...ixInit.instructions)

      if (values.acceptSPL) {
        const ixSPL = await fanoutSdk.initializeFanoutForMintInstructions({
          fanout: fanoutPubkey,
          mint: new PublicKey(values.pubKeySPL),
        })
        tx.add(...ixSPL.instructions)
      }

      // Sign transaction using user's wallet
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = wallet.publicKey
      const txSigned = await wallet.signTransaction(tx)

      // Send API request
      const res = await fetch('/api/createHydraWallet', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: txSigned.serialize().toString('base64'),
          name: values.name,
          pubkey: fanoutPubkey.toBase58(),
          authority: wallet.publicKey.toBase58(),
          memberShipType: values.model,
          acceptSPL: values.acceptSPL,
          splToken: values.acceptSPL ? values.pubKeySPL : undefined,
          // TODO: Include mint public key for token membership model
          totalShares: values.shares,
          cluster,
        }),
      })

      if (res.status === 200) {
        setFormState('success')

        //redirect to manage page
        router.push(`/manage/${fanoutPubkey.toBase58()}`)
      } else {
        const json = await res.json()
        setFormState('error')
        setErrorMsg(json.msg)
        setLogs(json.logs)
      }
    } catch (error: any) {
      setFormState('error')
      setErrorMsg(`Failed to create Hydra Wallet: ${error.message}`)
    }
  }

  const validate = (values: any) => {
    let errors: FormikErrors<FormValues> = {}

    if (!values.name) {
      errors.name = 'This field is required'
    }

    if (!values.shares) {
      errors.shares = 'Enter a valid number of shares'
    }

    if (values.acceptSPL && !values.pubKeySPL) {
      errors.pubKeySPL = 'This field is required'
    }

    return errors
  }

  const checkNumeric = (event: any) => {
    if (event.key == '.') {
      event.preventDefault()
    }
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })

  return (
    <form
      className="flex w-full flex-wrap gap-y-10 text-primary dark:text-white"
      onSubmit={formik.handleSubmit}
    >
      <FormStateAlert
        state={formik.isSubmitting ? 'submitting' : formState}
        submittingMsg="Creating Hydra Wallet..."
        successMsg="Successfully created Hydra Wallet!"
        errorMsg={errorMsg}
        logs={logs}
      />
      <div className="w-full md:w-1/2 flex flex-col items-center md:items-start gap-10">
        <div className="form-control w-4/5">
          <label className="label">
            <span>Hydra Wallet name</span>
          </label>
          <input
            type="text"
            id="name"
            placeholder="Enter a name for your wallet"
            className="input input-bordered w-full"
            {...formik.getFieldProps('name')}
          />
          <label>
            <span className="label-text-alt text-sm">
              * choose a unique name for your wallet
            </span>
          </label>

          {formik.errors.name && formik.touched.name ? (
            <div className="text-red-500">{formik.errors.name}</div>
          ) : null}
        </div>

        <div className="form-control w-4/5">
          <label className="label">
            <span>Total Shares</span>
          </label>
          <input
            type="number"
            id="shares"
            placeholder="Enter a number of shares"
            className="input input-bordered w-full"
            onKeyPress={(event) => checkNumeric(event)}
            {...formik.getFieldProps('shares')}
          />
          {formik.errors.shares && formik.touched.shares ? (
            <div className="text-red-500">{formik.errors.shares}</div>
          ) : null}
        </div>
      </div>

      <div className="w-full md:w-1/2 flex flex-col items-center md:items-end gap-10">
        <div className="form-control w-4/5">
          <label className="label">
            <span>Pick a membership Model</span>
          </label>
          <select
            id="model"
            className="select select-bordered w-full"
            {...formik.getFieldProps('model')}
          >
            <option>Wallet membership</option>
            <option>NFT membership</option>
            <option>Token membership</option>
          </select>
        </div>

        <div className="form-control w-4/5">
          <label className="cursor-pointer flex gap-3">
            <input
              type="checkbox"
              id="acceptSPL"
              className="checkbox checkbox-primary"
              {...formik.getFieldProps('acceptSPL')}
            />
            <span>Accept SPL Tokens</span>
          </label>

          <label className="label">
            <span
              className={!formik.values.acceptSPL ? 'opacity-40' : undefined}
            >
              Enter SPL token public key
            </span>
          </label>
          <input
            type="text"
            id="pubKeySPL"
            placeholder="Enter a public key"
            className="input input-bordered w-full"
            disabled={!formik.values.acceptSPL}
            {...formik.getFieldProps('pubKeySPL')}
          />
          {formik.errors.pubKeySPL &&
          formik.touched.pubKeySPL &&
          formik.values.acceptSPL ? (
            <div className="text-red-500">{formik.errors.pubKeySPL}</div>
          ) : null}
        </div>
      </div>

      <div className="w-full flex justify-center md:justify-end">
        <button
          type="submit"
          className="btn btn-secondary disabled:opacity-30 disabled:bg-secondary disabled:text-white"
          disabled={!(formik.dirty && formik.isValid) || formik.isSubmitting}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export default CreateWalletForm
