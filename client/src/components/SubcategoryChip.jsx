import { IoClose } from "react-icons/io5";

const SubcategoryChip = ({ subcategory, removeSubcategory }) => {
    const handleRemoveSubcategoryChipButtonClick = () => {
        removeSubcategory(subcategory)
    }

    return (
        <div className="relative group w-fit bg-blue-300 hover:bg-blue-400 text-black text-xs px-2 py-1 rounded-2xl whitespace-nowrap flex items-center hover:bg-[linear-gradient(to_left,_rgba(1,1,1,0.6)_10%,_transparent_50%)]">
            <div className="">{ subcategory?.name }</div>
            <div className="absolute right-1 text-white hidden group-hover:flex items-center justify-center"><IoClose onClick={ handleRemoveSubcategoryChipButtonClick } size={ 20 } className="cursor-pointer"/></div>
        </div>
    )
}

export default SubcategoryChip