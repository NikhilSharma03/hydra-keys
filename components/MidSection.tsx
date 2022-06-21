import type { AppProps } from 'next/app'
import { modalObject } from '../lib/modalObj'
import Modal from './Modal'

const MidSection = () => {

    const modalObj1: modalObject = {
        title: "Create a Hydra Wallet",
        image: "modal1_vault.png",
        text: "By creating a new hydra wallet you become an Authority"
    }

    const modalObj2: modalObject = {
        title: "Add members ",
        image: "modal2_select.png",
        text: "This will be dependent on the membership type that you choose"
    }

    const modalObj3: modalObject = {
        title: "Distribute funds",
        image: "modal3_deposit.png",
        text: "All you have to do is specify the member that you want to distribute funds to"
    }

    return (
        <div className="flex flex-col justify-evenly section2Size noDarkEffect"  >
            <div>
                <b><h1>How does it work?</h1></b>
            </div>
            <div className="flex flex-row flex-wrap justify-around modalParentDiv">

                <div>
                    <Modal {...modalObj1} />
                </div>
                <div>
                    <Modal {...modalObj2} />
                </div>
                <div>
                    <Modal {...modalObj3} />
                </div>

            </div>

            <div className='balanceModal'>
               
            </div>

        </div>
    );
}

export default MidSection