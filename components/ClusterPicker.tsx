import ClusterPickerItem from './ClusterPickerItem'

const ClusterPicker = () => {
  return (
    <div className="dropdown">
      <label tabIndex={0} className="btn btn-secondary m-1 w-full">
        Cluster
      </label>
      <ul
        tabIndex={0}
        className="dropdown-content menu p-2 shadow bg-base-100 rounded-box w-52 gap-2"
      >
        <li>
          <ClusterPickerItem text="Devnet" value="devnet" />
        </li>
        <li>
          <ClusterPickerItem text="Mainnet" value="mainnet-beta" />
        </li>
      </ul>
    </div>
  )
}

export default ClusterPicker
