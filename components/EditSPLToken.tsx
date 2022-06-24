import { FormikErrors, useFormik } from 'formik'
import { useRef } from 'react'

interface FormValues {
  acceptSPL: boolean
  pubKeySPL: string
}

const EditSPLToken = () => {
  let toggleRef = useRef<HTMLInputElement>(null)

  const initialValues = {
    acceptSPL: false,
    pubKeySPL: '',
  }

  const onSubmit = (values: any) => {
    // add the SPL token here
    toggleRef.current!.checked = false
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

  return (
    <div className="w-full">
      <form onSubmit={formik.handleSubmit} className="flex flex-col gap-5">
        <div className="flex justify-between items-center">
          <label className="cursor-pointer flex gap-3">
            <input
              type="checkbox"
              id="acceptSPL"
              className="checkbox checkbox-primary"
              {...formik.getFieldProps('acceptSPL')}
            />
            <span>Accept SPL Tokens</span>
          </label>

          <div className="w-1/2 flex gap-3 justify-end">
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
              className="input input-bordered w-2/3"
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

        <div className="flex w-full justify-end gap-4">
          <button type="submit" className="btn btn-primary">
            Update
          </button>

          <button className="btn">Cancel</button>
        </div>
      </form>
    </div>
  )
}

export default EditSPLToken
