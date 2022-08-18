import { forwardRef, useRef } from 'react'

const AlertBox = forwardRef<HTMLInputElement>((props, ref) => {
  const cancelRef = useRef<HTMLLabelElement>(null)

  return (
    <div>
      <input
        type="checkbox"
        id="alert-box-toggle"
        className="modal-toggle"
        ref={ref}
      />
      <label
        htmlFor="alert-box-toggle"
        className="modal modal-bottom sm:modal-middle"
      >
        <label htmlFor="" className="modal-box">
          <h3 className="font-bold text-lg pb-2">
            You have 0 balance in your native account. Please fund your wallet.
          </h3>

          <div className="flex w-full justify-end gap-4">
            <div className="modal-action">
              <label
                className="btn btn-primary"
                htmlFor="fund-wallet-modal"
                onClick={() => cancelRef.current?.click() }>
                Fund Wallet
              </label>
            </div>

            <div className="modal-action">
              <label className="btn" htmlFor="alert-box-toggle" ref={cancelRef}>
                Cancel
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  )
})

AlertBox.displayName = 'AlertBox'

export default AlertBox
