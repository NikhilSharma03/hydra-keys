import { FormikErrors, useFormik } from 'formik'

interface FormValues {
  name: string
  shares: number
  model: string
  acceptSPL: boolean
  pubKeySPL: string
}

const CreateWalletForm = () => {
  const initialValues = {
    name: '',
    shares: 0,
    model: 'Wallet membership',
    acceptSPL: false,
    pubKeySPL: '',
  }

  const onSubmit = (values: any) => {
    console.log('submitted', values)
    // add Hydra wallet creation logic here
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
              className={
                !formik.values.acceptSPL ? 'opacity-40' : undefined
              }
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
          disabled={!(formik.dirty && formik.isValid)}
        >
          Create
        </button>
      </div>
    </form>
  )
}

export default CreateWalletForm
