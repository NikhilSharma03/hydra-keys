import { modalObject } from '../lib/modalObj'

const Modal = (modalObj: modalObject) => {

    const objectData = modalObj;

    return (
        <div className='flex flex-col justify-evenly items-center modalSize bg-white'>
            <div className='imgDiv'>
                <img src={objectData.image} className="imgConfig" />
            </div>

            <div className='modalText flex flex-col justify-space'>
                <div>
                    <h2>
                        <b> {objectData.title} </b>
                    </h2>
                </div>
                <div>
                    <p>
                        {objectData.text}
                    </p>
                </div>

            </div>

            <div className='balanceDiv'>
                
            </div>

        </div>
    );
}

export default Modal