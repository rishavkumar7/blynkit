import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";

const SubcategoryCard = ({ openEditSpace, openConfirmBox, subcategory }) => {
    const handleEditSubcategoryButtonClick = () => {
        openEditSpace(subcategory)
    }

    const handleDeleteSubcategoryButtonClick = () => {
        openConfirmBox(subcategory)
    }

    return (
        <div className="w-full h-full flex flex-col items-center justify-center shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] rounded-lg">
            <div className="relative group w-full flex items-start justify-center aspect-[0.9] sm:aspect-[1.0] md:aspect-[1.1] lg:aspect-[1.2] overflow-hidden rounded-lg" >
                <img src={ subcategory.image } alt={ subcategory.name } className="rounded-lg scale-125 sm:scale-120 object-cover object-[center_5px] sm:object-[center_0] -translate-y-1"/>
                <div className="w-[55%] h-[90%] absolute top-0 right-0 group-hover:bg-[linear-gradient(250deg,_rgba(0,0,0,1)_25%,_transparent_60%)] lg:group-hover:bg-[linear-gradient(232deg,_rgba(0,0,0,1)_20%,_transparent_50%)]"></div>
                <div className="absolute top-1 right-2 hidden group-hover:flex flex-col items-center justify-center gap-2 z-1">
                    <button onClick={ handleDeleteSubcategoryButtonClick } className="text-white bg-transparent cursor-pointer"><RiDeleteBin6Line size={ 30 } /></button>
                    <button onClick={ handleEditSubcategoryButtonClick } className="text-white bg-transparent cursor-pointer"><TiEdit size={ 30 } /></button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(0,0,0,1)_8%,_transparent_50%)] p-1 text-sm sm:text-md md:text-lg lg:text-xl text-white font-semibold flex items-end justify-center rounded-lg">
                    <p>{ subcategory.name }</p>
                </div>
            </div>
        </div>
    )
}

export default SubcategoryCard