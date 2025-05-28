import { TiEdit } from "react-icons/ti";
import { RiDeleteBin6Line } from "react-icons/ri";

const CategoryCard = ({ openEditSpace, openConfirmBox, category }) => {
    const handleEditCategoryButtonClick = () => {
        openEditSpace(category)
    }

    const handleDeleteCategoryButtonClick = () => {
        openConfirmBox(category)
    }

    return (
        <div className="flex flex-col items-center justify-center shadow-[0_0_10px_1px_rgba(0,0,0,0.2)] rounded-lg">
            <div className="relative group w-full aspect-[0.9] sm:aspect-[1.0] md:aspect-[1.1] lg:aspect-[1.2] overflow-hidden rounded-lg" >
                <img src={ category.image } alt={ category.name } className="rounded-lg scale-120 -translate-y-3"/>
                <div className="w-[55%] h-[90%] absolute top-0 right-0 group-hover:bg-[linear-gradient(250deg,_rgba(0,0,0,1)_25%,_transparent_60%)] lg:group-hover:bg-[linear-gradient(232deg,_rgba(0,0,0,1)_20%,_transparent_50%)]"></div>
                <div className="absolute top-1 right-2 hidden group-hover:flex flex-col items-center justify-center gap-2 z-1">
                    <button onClick={ handleDeleteCategoryButtonClick } className="text-white bg-transparent cursor-pointer"><RiDeleteBin6Line size={ 30 } /></button>
                    <button onClick={ handleEditCategoryButtonClick } className="text-white bg-transparent cursor-pointer"><TiEdit size={ 30 } /></button>
                </div>
                <div className="absolute inset-0 bg-[linear-gradient(to_top,_rgba(0,0,0,1)_8%,_transparent_50%)] p-1 text-sm sm:text-md md:text-lg lg:text-xl text-white font-semibold flex items-end justify-center rounded-lg">
                    <p>{ category.name }</p>
                </div>
            </div>
        </div>
    )
}

export default CategoryCard