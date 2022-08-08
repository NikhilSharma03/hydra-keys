import styles from '../styles/MemembersList.module.css'

type MemembersDetailsProps = {
  members: Array<any>
  onHandleDistribute: Function
  availableShares: number
}

const MembersTable = ({ members, onHandleDistribute, availableShares }: MemembersDetailsProps ) => {
  return (
    <table className="table-normal rounded w-full">
      <thead className={`text-xl ${styles.th}`}>
        <tr>
          <th>Address</th>
          <th>Added on</th>
          <th>Shares</th>
          <th>Distribute Funds</th>
        </tr>
      </thead>
      <tbody>
        {members.map((member: any, key: any) => (
          <tr className={styles.membersList} key={key}>
            <th>{member?.memberPubkey}</th>
            <td className="text-center">
              {new Date(Date.parse(member?.createdAt)).toLocaleString()}
            </td>
            <td className="text-center">{member?.shareCount}</td>
            <td className="text-center">
              <button
                className={`btn bg-[#009000] hover:bg-[#007000] btn w-8/12 sm:w-fit px-6 text-base font-normal border-none disabled:bg-opacity-30 disabled:bg-gray-600 disabled:text-white  ${styles.distributeBtn}`}
                onClick={() => onHandleDistribute(member?.memberPubkey)}
                disabled={members.length === 0 || availableShares != 0}
              >
                Distribute
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  )
}

export default MembersTable
