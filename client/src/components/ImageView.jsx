import { IoClose } from "react-icons/io5"

const ImageView = ({ imageUrl, close }) => {
    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-200">
            <div className="bg-slate-200 m-4 p-4 w-sm sm:w-lg rounded flex flex-col gap-2">
                <div onClick={ close } className="flex items-center justify-end cursor-pointer">
                    <IoClose size={ 25 } className="text-neutral-500" />
                </div>
                <div>
                    <img src={ imageUrl } alt="image view" className="w-full h-full object-cover" />
                </div>
            </div>
        </section>
    )
}

export default ImageView