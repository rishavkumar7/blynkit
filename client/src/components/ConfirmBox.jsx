import { IoClose } from "react-icons/io5"

const ConfirmBox = ({ message, confirm, cancel, close }) => {
    return (
        <div className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] z-200 flex items-center justify-center p-4">
            <div className="bg-amber-50 w-md p-6 rounded flex flex-col gap-6">
                <div className="flex">
                    <p className="font-semibold">{ message }</p>
                    <button onClick={ close } className="text-neutral-500 flex items-start justify-end cursor-pointer"><IoClose size={ 25 } /></button>
                </div>
                <div className="flex items-center justify-end gap-5">
                    <button onClick={ confirm } className="px-3 py-1 font-bold rounded border border-neutral-500 hover:border-transparent active:border-transparent text-neutral-500 hover:text-white hover:bg-green-600 active:bg-green-500 cursor-pointer">Confirm</button>
                    <button onClick={ cancel } className="px-3 py-1 font-bold rounded border border-neutral-500 hover:border-transparent active:border-transparent text-neutral-500 hover:text-white hover:bg-red-500 active:bg-red-400 cursor-pointer">Cancel</button>
                </div>
            </div>
        </div>
    )
}

export default ConfirmBox