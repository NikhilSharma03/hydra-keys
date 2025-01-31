import { FormikErrors, useFormik } from 'formik'
import {
  clusterApiUrl,
  Connection,
  PublicKey,
  Transaction,
} from '@solana/web3.js'
import { FanoutClient, Wallet } from '@glasseaters/hydra-sdk'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import { useRef, useState } from 'react'
import { isValidPubKey } from '../utils/utils'
import {useAppSelector} from "../hooks/useAppSelector";
import {selectCluster} from "../redux/features/wallet/walletSlice";

interface FormValues {
  acceptSPL: boolean
  pubKeySPL: string
}

interface Props {
  onCancel: Function
  onSuccess: Function
  hydraPubKey: string
}

const EditSPLToken = ({ onCancel, onSuccess, hydraPubKey }: Props) => {
  let checkboxRef = useRef<HTMLInputElement>(null)
  const cluster = useAppSelector(selectCluster)
  const [loading, setLoading] = useState(false)

  const connection = new Connection(clusterApiUrl(cluster), 'confirmed')

  const wallet = useAnchorWallet() as Wallet
  const fanoutSdk = new FanoutClient(connection, wallet)

  const initialValues = {
    acceptSPL: false,
    pubKeySPL: '',
  }

  const tx = new Transaction()

  const onSubmit = async (values: any) => {
    setLoading(true)

    try {
      const ixSPL = await fanoutSdk.initializeFanoutForMintInstructions({
        fanout: new PublicKey(hydraPubKey),
        mint: new PublicKey(values.pubKeySPL),
      })
      tx.add(...ixSPL.instructions)

      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = wallet.publicKey
      const txSigned = await wallet.signTransaction(tx)

      // Call the API to add spl token
      const res = await fetch(`/api/addSplToken/${hydraPubKey}?cluster=${cluster}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tx: txSigned.serialize().toString('base64'),
          splToken: values.pubKeySPL,
        }),
      })

      if(res.status == 200) {
        onSuccess(values.pubKeySPL)
      } else {
        setLoading(false)
        const error = await res.json()
        formik.setFieldError('pubKeySPL', error.msg)
      }
    } catch (error: any){
      setLoading(false)
      formik.setFieldError('pubKeySPL', error.message)
    }

  }

  const validate = (values: any) => {
    let errors: FormikErrors<FormValues> = {}

    if (values.acceptSPL)
      values.pubKeySPL
        ? isValidPubKey(values.pubKeySPL)
          ? (errors.pubKeySPL = 'Please enter a valid public key')
          : null
        : (errors.pubKeySPL = 'This field is required')

    return errors
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })

  const resetAndCancel = () => {
    formik.resetForm()
    checkboxRef.current!.checked = false
    onCancel()
  }

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <label className="cursor-pointer flex gap-3 w-full md:w-1/2">
            <input
              type="checkbox"
              id="acceptSPL"
              ref={checkboxRef}
              className="checkbox checkbox-primary"
              {...formik.getFieldProps('acceptSPL')}
            />
            <span>Accept SPL Tokens</span>
          </label>

          <div className="w-full sm:w-1/2 flex flex-col md:flex-row gap-3 justify-end">
            <label className="label">
              <span
                className={!formik.values.acceptSPL ? 'opacity-40' : undefined}
              >
                Enter SPL token public key
              </span>
            </label>
            <div className="w-full md:w-2/3 flex flex-col">
              <input
                type="text"
                id="pubKeySPL"
                placeholder="Enter a public key"
                className="input input-bordered"
                disabled={!formik.values.acceptSPL}
                {...formik.getFieldProps('pubKeySPL')}
              />

              {formik.errors.pubKeySPL &&
              formik.touched.pubKeySPL &&
              formik.values.acceptSPL ? (
                <div className="text-red-500 -mb-4">
                  {formik.errors.pubKeySPL}
                </div>
              ) : null}
            </div>
          </div>
        </div>

        <div className="flex w-full justify-end gap-4">
          <button
            type="submit"
            className="btn btn-primary disabled:opacity-30 disabled:bg-primary disabled:text-white"
            disabled={loading}
          >
            Update
          </button>

          <button
            type="reset"
            className="btn"
            onClick={(e) => {
              resetAndCancel()
            }}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  )
}

export default EditSPLToken
