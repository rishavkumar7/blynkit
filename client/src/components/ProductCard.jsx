import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRupeeSign } from "react-icons/fa";

const ProductCard = ({ openProductSpace, openEditSpace, openConfirmBox, product }) => {
    const handleOpenProductClick = () => {
        openProductSpace(product)
    }

    const handleEditProductButtonClick = () => {
        openEditSpace(product)
    }

    const handleDeleteProductButtonClick = () => {
        openConfirmBox(product)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] bg-white rounded-lg">
            <div onClick={ openProductSpace ? handleOpenProductClick : null } className={ `relative group w-full flex items-start justify-center ${ openProductSpace ? "aspect-[0.85]" : "aspect-[0.9] sm:aspect-[1.0] md:aspect-[1.1] lg:aspect-[1.3]" } overflow-hidden rounded-lg ${ openProductSpace ? "cursor-pointer" : "cursor-default" }` } >
                <img src={ product?.image[0] } alt={ product?.name } className="rounded-lg scale-115 sm:scale-105 object-cover object-[center_5px] sm:object-[center_0] lg:-translate-y-4"/>
                <div className={ `w-[55%] h-[90%] absolute top-0 right-0 ${ (openEditSpace || openConfirmBox) ? "block" : "hidden" } group-hover:bg-[linear-gradient(250deg,_rgba(0,0,0,1)_25%,_transparent_60%)] lg:group-hover:bg-[linear-gradient(232deg,_rgba(0,0,0,1)_20%,_transparent_50%)]` } ></div>
                <div className="absolute top-1 right-2 hidden group-hover:flex flex-col items-center justify-center gap-2 z-1">
                    <button onClick={ handleDeleteProductButtonClick } className={ `${ openConfirmBox ? "block" : "hidden" } text-white bg-transparent cursor-pointer` } ><RiDeleteBin6Line size={ 30 } /></button>
                    <button onClick={ handleEditProductButtonClick } className={ `${ openEditSpace ? "block" : "hidden" } text-white bg-transparent cursor-pointer` } ><TiEdit size={ 30 } /></button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(0,0,0,1)_8%,_transparent_70%)] p-1 flex items-end rounded-lg">
                    <div className="w-full px-1 flex flex-col items-start justify-center">
                        <div className="w-full font-semibold text-sm sm:text-md md:text-lg text-white flex items-center justify-start">
                            <p className="w-full line-clamp-2">{ product?.name }</p>
                        </div>
                        <div className="w-full flex items-center justify-between tracking-wider">
                            <p className="text-xs sm:text-sm text-white/70">{ product?.unit }</p>
                            <div className="flex justify-center gap-1 sm:gap-2">
                                <div className="flex items-center sm:gap-1 text-md sm:text-xl font-bold text-lime-300">
                                    <FaRupeeSign />
                                    <p>{ product?.price }</p>
                                </div>
                                <div className="flex items-center">
                                    {
                                        product?.discount > 0 && (
                                            <p className="text-red-300 flex items-center text-xs">-{ product?.discount }%</p>
                                        )
                                    }
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ProductCard