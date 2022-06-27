import { FormikErrors, useFormik } from 'formik'
import { clusterApiUrl, Connection, PublicKey } from '@solana/web3.js'
import { FanoutClient, Wallet } from '@glasseaters/hydra-sdk'
import { useAnchorWallet } from '@solana/wallet-adapter-react'
import {useRef, useState} from 'react'

interface FormValues {
  acceptSPL: boolean
  pubKeySPL: string
}

interface Props {
  onCancel: Function
  hydraPubKey: string
}

const EditSPLToken = ({ onCancel, hydraPubKey }: Props) => {
  let checkboxRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)

  const connection = new Connection(clusterApiUrl('devnet'), 'confirmed')

  const fanoutSdk = new FanoutClient(connection, useAnchorWallet() as Wallet)

  const initialValues = {
    acceptSPL: false,
    pubKeySPL: '',
  }

  const onSubmit = (values: any) => {
    console.log('submitted')
    setLoading(true)
    fanoutSdk
      .initializeFanoutForMint({
        fanout: new PublicKey(hydraPubKey),
        mint: new PublicKey(values.pubKeySPL),
      })
      .then((r) => console.log(r))
      .catch((e) => formik.setFieldError('pubKeySPL', 'An error has occurred'))
      .finally(() => setLoading(false))
  }

  const validate = (values: any) => {
    let errors: FormikErrors<FormValues> = {}

    if (values.acceptSPL && !values.pubKeySPL) {
      errors.pubKeySPL = 'This field is required'
    }

    return errors
  }

  const formik = useFormik({
    initialValues,
    onSubmit,
    validate,
  })


  const resetAndCancel= () => {
    formik.resetForm()
    checkboxRef.current!.checked = false
    onCancel()
  }

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <span className="text-white">{formik.values.acceptSPL ? 'true' : 'false'}</span>
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
            disabled={!(formik.dirty && formik.isValid) || loading}
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
