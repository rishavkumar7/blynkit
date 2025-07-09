import { useEffect, useRef, useState } from "react"
import { useSelector } from "react-redux"
import { HiUpload } from "react-icons/hi"
import { IoClose } from "react-icons/io5"
import { RiDeleteBin6Line } from "react-icons/ri"
import toast from "react-hot-toast"
import uploadImage from "../utils/uploadImage.js"
import ImageView from "../components/ImageView.jsx"
import CategoryChip from "../components/CategoryChip.jsx"
import SubcategoryChip from "../components/SubcategoryChip.jsx"
import AddNewFieldSpace from "../components/AddNewFieldSpace.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import { successAlert } from "../utils/successAlert.jsx"

const EditProductSpace = ({ currentProduct, setApiCall, close }) => {
    const scrollRef = useRef(null)
    const categories = useSelector(state => state?.product?.categories)
    const subcategories = useSelector(state => state?.product?.subcategories)
    const [ originalProduct, setOriginalProduct ] = useState(currentProduct)
    const [ uploading, setUploading ] = useState(false)
    const [ updating, setUpdating ] = useState(false)
    const [ openImage, setOpenImage ] = useState("")
    const [ openAddFieldSpace, setOpenAddFieldSpace ] = useState(false)
    const [ data, setData ] = useState({
        _id : currentProduct?._id,
        name : currentProduct?.name,
        image : currentProduct?.image,
        category : currentProduct?.category,
        sub_category : currentProduct?.sub_category,
        unit : currentProduct?.unit,
        stock : currentProduct?.stock,
        price : currentProduct?.price,
        discount : currentProduct?.discount,
        description : currentProduct?.description,
        more_details : currentProduct?.more_details,
        publish : currentProduct?.publish
    })

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth
        }
    }, [ data?.image ])

    const filterSubcategoriesFromCategories = (subcategories) => {
        return [ ...subcategories ].filter(subcat => {
            let check = false

            subcat?.category.forEach(cat => {
                if (data?.category.find(categoryId => categoryId === cat?._id)) {
                    check=true
                }
            })

            return check
        })
    }

    const isAllowedToRemoveCategory = (cat) => {
        let dependency = false
        data?.sub_category.forEach(subcatId => {
            const subcat = subcategories.find(subcategory => subcategory?._id === subcatId)
            if (subcat?.category.find(category => category?._id === cat?._id)) {
                dependency = true
                subcat?.category.forEach(category => {
                    if (category?._id !== cat?._id && data?.category.find(otherCategoryId => otherCategoryId === category?._id)) {
                        dependency = false
                    }
                })
            }
        })
        return !dependency
    }

    const handleChange = (e) => {
        const { name, value } = e.target

        setData(prev => {
            return {
                ...prev,
                [ name ] : value
            }
        })
    }

    const handleMoreDetailsChange = (e) => {
        const { name, value } = e.target

        setData(prev => {
            return {
                ...prev,
                more_details : {
                    ...(prev?.more_details),
                    [ name ] : value
                }
            }
        })
    }

    const handleUploadImage = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        setUploading(true)

        const response = await uploadImage(file, `product/${ data?.name.normalize().replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, ' ').trim() }`)
        const { data : responseData } = response

        setData(prev => {
            return {
                ...prev,
                image : [ ...prev?.image, responseData?.data?.url ]
            }
        })

        e.target.value = ""
        setUploading(false)
    }

    const handleImageClick = (index) => {
        setOpenImage(data?.image[index])
    }

    const handleCloseImageClick = () => {
        setOpenImage("")
    }

    const handleRemoveImageClick = (index) => {
        const newImages = [ ...data?.image ]
        newImages.splice(index, 1)
        setData(prev => {
            return {
                ...prev,
                image : newImages
            }
        })
    }

    const handleSelectCategoryChange = (e) => {
        const value = e.target.value
        const newCategory = categories.find(category => category?._id === value)
        
        setData(prev => {
            return {
                ...prev,
                category : [ ...prev?.category, newCategory?._id ]
            }
        })
    }

    const handleRemoveCategoryChip = (cat) => {
        if (!isAllowedToRemoveCategory(cat)) {
            toast.error("Cannot remove this category as this category is in use.")
            return
        }

        const newCategoryList = [ ...data?.category ]
        const removeIndex = newCategoryList.findIndex(categoryId => categoryId === cat?._id)

        newCategoryList.splice(removeIndex, 1)

        setData(prev => {
            return {
                ...prev,
                category : newCategoryList
            }
        })
    }

    const handleSelectSubcategoryChange = (e) => {
        const value = e.target.value
        const newSubcategory = subcategories.find(sub_category => sub_category?._id === value)
        
        setData(prev => {
            return {
                ...prev,
                sub_category : [ ...prev?.sub_category, newSubcategory?._id ]
            }
        })
    }

    const handleRemoveSubcategoryChip = (subcat) => {
        const newSubcategoryList = [ ...data?.sub_category ]
        const removeIndex = newSubcategoryList.findIndex(subcategoryId => subcategoryId === subcat?._id)

        newSubcategoryList.splice(removeIndex, 1)

        setData(prev => {
            return {
                ...prev,
                sub_category : newSubcategoryList
            }
        })
    }

    const handleAddNewFieldClick = () => {
        if (!data?.name.trim()) {
            return
        }

        setOpenAddFieldSpace(true)
    }

    const handleSubmitAddFieldSpace = (newFieldData) => {
        let newField = newFieldData?.name.trim().replace(/\s+/g, ' ')
        newField = newField.charAt(0).toUpperCase() + newField.slice(1)

        setData(prev => {
            return {
                ...prev,
                more_details : {
                    ...prev?.more_details,
                    [ newField ] : ""
                }
            }
        })

        setOpenAddFieldSpace(false)
    }

    const handleCloseAddFieldSpace = () => {
        setOpenAddFieldSpace(false)
    }

    const handleDeleteAdditionalFieldButtonClick = (index) => {
        const keys = Object.keys(data?.more_details)
        keys.splice(index, 1)

        const newMoreDetails = Object.fromEntries(keys.map(key => [ key, data?.more_details[key] ]))

        setData(prev => {
            return {
                ...prev,
                more_details : newMoreDetails
            }
        })
    }

    const isAllowedToSubmit = () => {
        let check = false

        Object.keys(data).forEach(key => {
            if (key === "image" || key === "category" || key === "sub_category") {
                data[key].forEach(value => {
                    check = check || !originalProduct[key].includes(value)
                })
            } else if (key === "more_details") {
                Object.keys(data[key]).forEach(moreKey => {
                    check = check || !(originalProduct[key].hasOwnProperty(moreKey) && data[key][moreKey] === originalProduct[key][moreKey])
                })
                Object.keys(originalProduct[key]).forEach(moreKey => {
                    check = check || !(data[key].hasOwnProperty(moreKey) && originalProduct[key][moreKey] === data[key][moreKey])
                })
            } else {
                if (data[key] !== originalProduct[key]) {
                    check = true
                }
            }
        })

        return check
    }

    const handleUpdateProductButtonClick = async (e) => {
        e.preventDefault()

        try {
            setUpdating(true)

            const response = await Axios({
                ...SummaryApi.update_product,
                data : data
            })

            const { data : responseData } = response
            if (responseData?.success) {
                successAlert(responseData?.message)
                setData({
                    _id : "",
                    name : "",
                    image : [],
                    category : [],
                    sub_category : [],
                    unit : "",
                    stock : "",
                    price : "",
                    discount : "",
                    description : "",
                    more_details : {},
                    publish : true
                })
                setApiCall(true)
                close()
            }

            setUpdating(false)
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.7)] flex items-center justify-center z-200">
            <div className="bg-slate-200 max-w-3xl h-120 sm:h-150 w-full rounded-xl m-4 p-6 sm:px-10 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <div className="flex items-center justify-between">
                    <h2 className="font-semibold text-neutral-800">Update Product</h2>
                    <button onClick={ close } className="w-fit block ml-auto cursor-pointer" >
                        <IoClose size={ 25 } className="text-neutral-700" />
                    </button>
                </div>
                <form onSubmit={ handleUpdateProductButtonClick } className="my-5 grid gap-6 sm:gap-8">
                    <div className="grid gap-1">
                        <label htmlFor="name" className="font-semibold text-neutral-800 tracking-wide" >Name</label>
                        <input onChange={ handleChange } autoFocus type="text" name="name" value={ data?.name } placeholder="Enter product name" id="name" required className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="description" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Description</label>
                        <textarea onChange={ handleChange } disabled={ !data?.name.trim() } type="text" name="description" value={ data?.description } placeholder="Enter product description" id="description" required rows={ 3 } className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded resize-none" />
                    </div>
                    <div className="grid gap-1">
                        <p className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Image</p>
                        <div className="grid sm:grid-cols-3 gap-2 sm:gap-4">
                            <div className="border border-transparent">
                                <div className={ `bg-amber-50 w-full h-30 ${ data?.name.trim() ? "text-neutral-600 font-bold" : "text-neutral-500" } text-sm rounded border border-neutral-300 sm:col-span-1` }>
                                    <label htmlFor="uploadImage" className="w-full h-full" >
                                        {
                                            uploading ? (
                                                <div className="w-full h-full flex items-center justify-center bg-slate-400 text-white text-lg font-semibold">
                                                    <p>Uploading ...</p>
                                                </div>
                                            ) : (
                                                <div className="w-full h-full flex flex-col items-center justify-center cursor-pointer" >
                                                    <HiUpload size={ 40 } className={ `${ data?.name.trim() ? "text-green-700" : "text-neutral-400" }` } />
                                                    <p>Upload Image</p>
                                                </div>
                                            )
                                        }
                                    </label>
                                    <input disabled={ !data?.name.trim() || uploading } onChange={ handleUploadImage } type="file" id="uploadImage" accept="image/*" className="hidden" />
                                </div>
                            </div>
                            <div ref={ scrollRef } className="flex gap-1 overflow-x-auto [&::-webkit-scrollbar]:hidden sm:col-span-2">
                                {
                                    data?.image.map((img, index) => {
                                        return (
                                            <div onClick={ () => { handleImageClick(index) } } key={ index } className="relative group border cursor-pointer" >
                                                <img src={ img } alt="product image" className="min-w-30 h-30 object-cover" />
                                                <div className="p-1 absolute top-0 bottom-0 left-0 right-0 hidden group-hover:flex items-start justify-end group-hover:bg-[linear-gradient(235deg,_rgba(0,0,0,0.7)_1%,_transparent_65%)]" >
                                                    <RiDeleteBin6Line onClick={ (e) => { e.stopPropagation(); handleRemoveImageClick(index) } } size={ 20 } className="z-1 text-white" />
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                    <div className="grid gap-1">
                        <div className="flex gap-3 overflow-hidden">
                            <label className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Category</label>
                            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                {
                                    data?.category.map(categoryId => {
                                        return <div key={ categoryId } className="w-full h-full"><CategoryChip category={ categories.find(cat => cat?._id === categoryId) } removeCategory={ handleRemoveCategoryChip } className="bg-amber-50" /></div>
                                    })
                                }
                            </div>
                        </div>
                        <select value={ "selectCategory" } disabled={ !data.name } onChange={ handleSelectCategoryChange } className={ `bg-amber-50 p-2 ${ !data?.name.trim() ? "text-neutral-500" : "" } border border-neutral-300 focus-within:border-blue-600 outline-none rounded` } >
                            <option value={ "selectCategory" } disabled>Select Category</option>
                            {
                                [ ...categories ].map(category => <option value={ category?._id } key={ category?._id } >{ category?.name }</option>)
                            }
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <div className="flex gap-3 overflow-hidden">
                            <label className={ `font-semibold ${ !(data?.name.trim() && data?.category[0]) ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Subcategory</label>
                            <div className="flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                                {
                                    data?.sub_category.map(subcategoryId => {
                                        return <div key={ subcategoryId } className="w-full h-full"><SubcategoryChip subcategory={ subcategories.find(subcat => subcat?._id === subcategoryId) } removeSubcategory={ handleRemoveSubcategoryChip } className="bg-amber-50" /></div>
                                    })
                                }
                            </div>
                        </div>
                        <select value={ "selectSubcategory" } disabled={ !(data?.name.trim() && data?.category[0]) } onChange={ handleSelectSubcategoryChange } className={ `bg-amber-50 p-2 ${ !(data?.name.trim() && data?.category[0]) ? "text-neutral-500" : "" } border border-neutral-300 focus-within:border-blue-600 outline-none rounded` } >
                            <option value={ "selectSubcategory" } disabled>Select Subcategory</option>
                            {
                                filterSubcategoriesFromCategories(subcategories).map(sub_category => <option value={ sub_category?._id } key={ sub_category?._id } >{ sub_category?.name }</option>)
                            }
                        </select>
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="unit" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Unit</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="text" name="unit" value={ data?.unit } placeholder="Enter product unit" id="unit" required className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="stock" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Number of Stock</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="stock" value={ data?.stock } placeholder="Enter product stock" id="stock" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="price" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Price</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="price" value={ data?.price } placeholder="Enter product price" id="price" required className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    <div className="grid gap-1">
                        <label htmlFor="discount" className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >Discount</label>
                        <input onChange={ handleChange } disabled={ !data?.name.trim() } type="number" name="discount" value={ data?.discount } placeholder="Enter product discount" id="discount" className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                    </div>
                    {
                        Object.keys(data?.more_details).map((newField, index) => {
                            return (
                                <div key={ index } className="grid gap-1">
                                    <div className="flex items-center justify-between">
                                        <label htmlFor={ newField } className={ `font-semibold ${ !data?.name.trim() ? "text-neutral-500" : "text-neutral-800" } tracking-wide` } >{ newField }</label>
                                        <RiDeleteBin6Line onClick={ () => { handleDeleteAdditionalFieldButtonClick(index) } } size={ 20 } className="text-neutral-400 hover:text-neutral-800 cursor-pointer" />
                                    </div>
                                    <input onChange={ handleMoreDetailsChange } disabled={ !data?.name.trim() } type="text" name={ newField } value={ data?.more_details[newField] } placeholder={ `Enter product ${ newField }` } id={ newField } className="bg-amber-50 p-2 border border-neutral-300 focus-within:border-blue-600 outline-none rounded" />
                                </div>
                            )
                        })
                    }
                    <div className="flex items-center justify-start">
                        <div onClick={ handleAddNewFieldClick } className={ `px-3 py-1 ${ !data?.name.trim() ? "bg-neutral-500" : "bg-blue-800 hover:bg-blue-700 active:bg-blue-600" } text-white font-semibold rounded cursor-pointer` }>Add New Field</div>
                    </div>
                    <button disabled={ !isAllowedToSubmit() } className={ `${ isAllowedToSubmit() ? "bg-green-700 hover:bg-green-600 active:bg-green-500" : "bg-neutral-500" } p-2 rounded text-white font-bold tracking-widest text-lg cursor-pointer` } >
                        {
                            updating ? (
                                "Updating ..."
                            ) : (
                                "Update Product"
                            )
                        }
                    </button>
                </form>
            </div>
            {
                openImage && (
                    <div>
                        <ImageView imageUrl={ openImage } close={ handleCloseImageClick } />
                    </div>
                )
            }
            {
                openAddFieldSpace && (
                    <div>
                        <AddNewFieldSpace submit={ handleSubmitAddFieldSpace } close={ handleCloseAddFieldSpace } />
                    </div>
                )
            }
        </section>
    )
}

export default EditProductSpace