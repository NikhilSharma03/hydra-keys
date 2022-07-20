import {
  FaArrowLeft,
  FaBalanceScaleLeft,
  FaCog,
  FaRegEdit,
  FaUserPlus,
  FaUsers,
} from 'react-icons/fa'
import AddMemberModal from './AddMemberModal'
import MembersTable from './MembersTable'
import EditSPLToken from './EditSPLToken'
import FundWalletModal from './FundWalletModal'
import styles from '../styles/MemembersList.module.css'
import Link from 'next/link'
import { Fanout, FanoutClient } from '@glasseaters/hydra-sdk'
import { useCallback, useEffect, useState } from 'react'
import { useConnection, useAnchorWallet } from '@solana/wallet-adapter-react'
import { LAMPORTS_PER_SOL, PublicKey, Transaction } from '@solana/web3.js'
import { NATIVE_MINT, TOKEN_PROGRAM_ID, AccountLayout} from '@solana/spl-token'
import FormStateAlert, { FormState } from './FormStateAlert'
import {
  distributeAllTransaction,
  distributeMemberTransaction,
} from '../utils/distribute'

type WalletDetailsProps = {
  initialWallet: any
  members: any
}

const WalletDetails = ({ initialWallet, members }: WalletDetailsProps) => {
  const [refresh, setRefresh] = useState({
    msg: 'initial',
  })
  const [formState, setFormState] = useState('idle' as FormState)
  const [formState2, setFormState2] = useState('idle' as FormState)
  const [showUpdateSPL, setShowUpdateSPL] = useState(false)
  const [wallet, setWallet] = useState(initialWallet)
  const [availableShares, setAvailableShares] = useState(
    initialWallet.totalShares
  )
  const [errorMsg, setErrorMsg] = useState('')
  const [logs, setLogs] = useState([])
  const { connection } = useConnection()
  const anchorwallet = useAnchorWallet()
  const [balance, setBalance] = useState(0)
  const [splbalance, setsplbalance] = useState(0)

  //toggle refresh page on fund distribution
  const updateRefresh = (newRefresh: { msg: string }) => {
    setRefresh(newRefresh)
  }

  //refresh function
  const fetchData = useCallback(async () => {
    setFormState2('submitting')
    if (!anchorwallet) {
      return
    }

    try {
      setLogs([])
      const fanoutSdk = new FanoutClient(connection, anchorwallet)
      const [fanoutPubkey] = await FanoutClient.fanoutKey(wallet.name)

      const fanoutObject = await fanoutSdk.fetch<Fanout>(fanoutPubkey, Fanout)

      const nativeAccountPubkey = fanoutObject.accountKey
      const nativeAccountInfo = await connection.getAccountInfo(
        nativeAccountPubkey
      )
      const Rentbalance = await connection.getMinimumBalanceForRentExemption(1)
      setBalance(
        ((nativeAccountInfo?.lamports ?? 0) - Rentbalance) / LAMPORTS_PER_SOL
      )
      setAvailableShares(fanoutObject.totalAvailableShares.toString())
      setTimeout(function () {
        setFormState2('idle')
      }, 1000)
    } catch (error: any) {
      console.log(error)
      setLogs(error.logs)
      setFormState2('error')
      setErrorMsg(`Failed to refresh: ${error.message}`)
    }
  }, [])

  //useEffect for refreshing page
  useEffect(() => {
    fetchData()
      // make sure to catch any error
      .catch(console.error)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, anchorwallet, connection, wallet.name, refresh])

  const isAuthority = () => {
    return anchorwallet?.publicKey == wallet.authority
  }

  const toggleUpdateSPL = () => {
    setShowUpdateSPL(!showUpdateSPL)
  }

  //updateWallet
  const updateWallet = (pubKeySPL) => {
    toggleUpdateSPL()
    const newWallet = { ...wallet }
    newWallet.acceptSPL = true
    newWallet.splToken = pubKeySPL
    setWallet(newWallet)
  }

  //Derive spl-token balance
  useEffect(() => {
    ;(async () => {
      const tokenAccounts = await connection.getTokenAccountsByOwner(
        new PublicKey(wallet.pubkey),
        {
          programId: TOKEN_PROGRAM_ID,
        }
      );
    tokenAccounts.value.forEach((e) => {
    const accountInfo = AccountLayout.decode(e.account.data);
    setsplbalance(accountInfo.amount)
  })
    })()
  }, [connection, wallet.pubkey])

  const handleDistribute = async (memberPubkey: string) => {
    if (!anchorwallet) {
      setFormState('error')
      setErrorMsg('Please connect your wallet!')
      return
    }

    try {
      setFormState('submitting')
      setLogs([])

      const fanoutSdk = new FanoutClient(connection, anchorwallet)

      // Prepare transaction
      const tx = await distributeMemberTransaction({
        fanoutSdk,
        hydra: wallet,
        payer: anchorwallet.publicKey,
        member: new PublicKey(memberPubkey),
        membershipModel: wallet.memberShipType,
      })

      if (!tx) {
        setFormState('error')
        setErrorMsg('Unsupported membership model')
        return
      }

      // Sign transaction using user's wallet
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = anchorwallet.publicKey
      const txSigned = await anchorwallet.signTransaction(tx)

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
      }
    } catch (error: any) {
      setLogs(error.logs)
      setFormState('error')
      setErrorMsg(`Failed to distribute wallet funds: ${error.message}`)
    }
  }

  const distributeAll = async () => {
    if (!anchorwallet) {
      setFormState('error')
      setErrorMsg('Please connect your wallet!')
      return
    }

    try {
      setFormState('submitting')
      setLogs([])

      const fanoutSdk = new FanoutClient(connection, anchorwallet)

      // Prepare transaction
      const tx = await distributeAllTransaction({
        fanoutSdk,
        hydra: wallet,
        payer: anchorwallet.publicKey,
        members: members.map(
          (member: any) => new PublicKey(member.memberPubkey)
        ),
        membershipModel: wallet.memberShipType,
      })

      if (!tx) {
        setFormState('error')
        setErrorMsg('Unsupported membership model')
        return
      }

      // Sign transaction using user's wallet
      tx.recentBlockhash = (await connection.getLatestBlockhash()).blockhash
      tx.feePayer = anchorwallet.publicKey
      const txSigned = await anchorwallet.signTransaction(tx)

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
        setTimeout(function () {
          setFormState('idle')
          fetchData()
        }, 1000)
      }
    } catch (error: any) {
      console.error(error)
      setLogs(error.logs)
      setFormState('error')
      setErrorMsg(`Failed to distribute wallet funds: ${error.message}`)
    }
  }

  return (
    <div className="w-full flex flex-col gap-8">
      <div className="flex justify-between flex-wrap gap-5 md:gap-0 pb-2">
        <div className="w-full md:w-1/2 text-center md:text-left">
          <p className="w-full text-3xl md:text-4xl font-bold text-primary dark:text-white">
            #{wallet.name}
          </p>
          <span className="break-words">{wallet.pubkey}</span>
        </div>

        <div className="w-full md:w-1/3 flex justify-center md:justify-end gap-2">
          <label htmlFor="fund-wallet-modal" className="btn btn-secondary">
            Fund Wallet
          </label>
          {isAuthority() ? (
            <div className="tooltip tooltip-secondary" data-tip="Add members">
              <label
                htmlFor="add-member-modal"
                className="bg-secondary cursor-pointer h-12 w-12 flex hover:brightness-90 justify-center items-center rounded-lg"
              >
                <FaUserPlus className="text-white text-xl" />
              </label>
            </div>
          ) : null}
        </div>
      </div>

      <Link href="/manage">
        <button className="self-start flex gap-2 items-center text-lg btn dark:bg-secondary dark:text-secondary-content">
          <FaArrowLeft />
          <p className="">Other Wallets</p>
        </button>
      </Link>

      <button
        onClick={() => fetchData()}
        className="self-start flex gap-2 items-center text-lg btn dark:bg-secondary dark:text-secondary-content"
      >
        <p className="">Refresh</p>
      </button>

      <div className="flex justify-between relative items-end w-full">
        <div className="group">
          <div className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-40 flex justify-center h-full items-center -left-6">
            <FaBalanceScaleLeft className="text-white" />
          </div>

          <p className="text-xl font-bold">Authority</p>
        </div>

        <p>{isAuthority() ? 'You' : wallet.authority}</p>
      </div>

      <div>
        <div className="flex justify-between relative items-end w-full mb-6">
          <div className="group">
            <div className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-40 flex justify-center h-full items-center -left-6">
              <FaUsers className="text-white" />
            </div>

            <p className="text-xl font-bold ">Members</p>
          </div>
          <div className="justify-between w-0.25">
            <p>
              <span className="border-2 p-1 rounded-lg border-[#3F3D56]">
                Available shares: <strong>{availableShares}</strong>
              </span>
              &nbsp; <span className="text-2xl">|</span> &nbsp;
              <span className="border-2 p-1 rounded-lg border-[#3F3D56]">
                Total shares: <strong>{wallet.totalShares}</strong>
              </span>
            </p>
          </div>
        </div>

        <FormStateAlert
          state={formState}
          submittingMsg="Distributing funds"
          successMsg="Successfully Distributed!"
          errorMsg={errorMsg}
          logs={logs}
        />
        <FormStateAlert
          state={formState2}
          submittingMsg="Refreshing"
          successMsg="Success!"
          errorMsg={errorMsg}
          logs={logs}
        />
        {/*add members table here */}
        <div
          className={`mt-6 card-bordered shadow-xl w-full rounded h-80 overflow-y-scroll ${styles.membersTableBg} ${styles.borderColor}`}
        >
          {members.length > 0 ? (
            <MembersTable
              members={members}
              onHandleDistribute={handleDistribute}
            />
          ) : (
            <p className="text-center text-xl font-bold mt-5">
              No members please add new members
            </p>
          )}
        </div>
      </div>

      <div className="flex flex-row justify-between items-center font-bold px-8">
        <span>Total Members: {members.length}</span>
        <button
          className={`btn bg-[#009000] hover:bg-[#007000] text-white`}
          onClick={distributeAll}
          disabled={formState === 'submitting' || members.length === 0}
        >
          Distribute All
        </button>
      </div>

      <div className="flex flex-col gap-5">
        <div className="group relative">
          <div className="absolute transition-opacity duration-300 opacity-0 group-hover:opacity-40 flex justify-center h-full items-center -left-6">
            <FaCog className="text-white" />
          </div>

          <h6 className="text-xl font-bold">Settings</h6>
        </div>

        <div className="flex justify-between">
          <p>Membership model: </p>
          <p>{wallet.memberShipType}</p>
        </div>

        <div className="flex justify-between">
          <p>Current Balance: </p>
          <p>{balance}</p>
        </div>

        <div className="flex w-full justify-between flex-wrap gap-y-5">
          <div className="flex justify-between w-full md:w-1/3">
            <p>Accept SPL token: </p>
            <div className="text-primary">
              {wallet.acceptSPL ? (
                <span>Accept</span>
              ) : (
                <div className="flex gap-10">
                  No
                  {isAuthority() ? (
                    <FaRegEdit
                      onClick={toggleUpdateSPL}
                      className={`cursor-pointer opacity-80 hover:opacity-100 text-lg text-white ${
                        showUpdateSPL ? 'hidden' : 'inline'
                      }`}
                    />
                  ) : null}
                </div>
              )}
            </div>
          </div>

          {wallet.acceptSPL ? (
            <div className="flex flex-col lg:flex-row justify-between w-full md:w-1/2">
              <p className="mr-3">SPL public key: </p>
              <p className="text-primary break-words"> {wallet.splToken}</p>
            </div>
          ) : null}
          
          {wallet.acceptSPL ? (
            <div className="flex flex-col lg:flex-row justify-between w-full md:w-1/2">
              <p className="mr-3">SPL Token balance: </p>
              <p className="text-primary break-words"> {splbalance} </p>
            </div>
          ) : null}
        </div>

        <div className={`w-full ${showUpdateSPL ? 'block' : 'hidden'}`}>
          <EditSPLToken
            onCancel={toggleUpdateSPL}
            onSuccess={updateWallet}
            hydraPubKey={wallet.pubkey}
          />
        </div>
      </div>

      <AddMemberModal hydraWallet={wallet} />
      <FundWalletModal
        modalId="fund-wallet-modal"
        hydraWallet={wallet}
        updateRefresh={updateRefresh}
      />
    </div>
  )
}

export default WalletDetails
