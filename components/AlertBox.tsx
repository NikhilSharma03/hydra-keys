import { useState } from 'react'
import { useRef } from 'react'

const AlertBox = () => {
  let toggleRef = useRef<HTMLInputElement>(null)

  return (
    <div>
      <input
        type="checkbox"
        id="alert-box-toggle"
        className="modal-toggle"
        ref={toggleRef}
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
              <label className="btn btn-primary" htmlFor="fund-wallet-modal">
                Fund Wallet
              </label>
            </div>

            <div className="modal-action">
              <label className="btn" htmlFor="alert-box-toggle">
                Cancel
              </label>
            </div>
          </div>
        </label>
      </label>
    </div>
  )
}

export default AlertBox
