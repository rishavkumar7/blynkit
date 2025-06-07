import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import AddSubcategorySpace from "../components/AddSubcategorySpace.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import NoData from "../components/NoData.jsx";
import SubcategoryCard from "../components/SubcategoryCard.jsx";
import EditSubcategorySpace from "../components/EditSubcategorySpace.jsx";
import ConfirmBox from "../components/ConfirmBox.jsx";
import { setSubcategoryDetails } from "../store/productSlice.js";

const Subcategory = () => {
    const dispatch = useDispatch()
    const subcategoriesData = useSelector(state => state?.product?.subcategories)
    const [ openAddSubcategorySpace, setOpenAddSubcategorySpace ] = useState(false)
    const [ subcategories, setSubcategories ] = useState([])
    const [ listedSubcategories, setListedSubcategories ] = useState({})
    const [ scrolled, setScrolled ] = useState(false)
    const [ currentEditingSubcategory, setCurrentEditingSubcategory ] = useState({
        _id : "",
        name : "",
        image : "",
        category : []
    })
    const [ currentDeletingSubcategory, setCurrentDeletingSubcategory ] = useState({
        _id : "",
        name : ""
    })

    const listSubcategories = (subcategoriesData) => {
        const newListedSubcategories = {}
        subcategoriesData.forEach(subcategory => {
            if (subcategory?.category) {
                subcategory?.category.slice().reverse().forEach(category => {
                    if (!newListedSubcategories[category?.name]) {
                        newListedSubcategories[category?.name] = []
                    }
                    newListedSubcategories[category?.name].push({
                        _id : subcategory?._id,
                        name : subcategory?.name,
                        image : subcategory?.image,
                        category : subcategory?.category,
                        createdAt : subcategory?.createdAt,
                        updatedAt : subcategory?.updatedAt
                    })
                })
            }
        })
        return newListedSubcategories
    }

    useEffect(() => {
        setSubcategories(subcategoriesData)
        setListedSubcategories(listSubcategories(subcategoriesData))
    }, [ subcategoriesData ])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 35)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleAddSubcategoryButtonClick = () => {
        setOpenAddSubcategorySpace(true)
    }

    const handleCloseAddSubcategorySpace = () => {
        setOpenAddSubcategorySpace(false)
    }

    const handleEditSubcategoryButtonClick = (subcategory) => {
        setCurrentEditingSubcategory({
            _id : subcategory?._id,
            name : subcategory?.name,
            image : subcategory?.image,
            category : subcategory?.category
        })
    }

    const handleCloseEditSubcategorySpace = () => {
        setCurrentEditingSubcategory({
            _id : "",
            name : "",
            image : "",
            category : []
        })
    }

    const handleDeleteSubcategoryButtonClick = (subcategory) => {
        setCurrentDeletingSubcategory({
            _id : subcategory?._id,
            name : subcategory?.name
        })
    }

    const handleConfirmDeleteButtonClick = async () => {
        try {
            const response = await Axios({
                ...SummaryApi?.delete_subcategory,
                data : {
                    _id : currentDeletingSubcategory?._id
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                const deleteIndex = subcategoriesData.findIndex(subcategory => subcategory?._id === currentDeletingSubcategory?._id)
                const newSubcategories = [ ...subcategories ]
                newSubcategories.splice(deleteIndex, 1)
                setSubcategories(newSubcategories)
                dispatch(setSubcategoryDetails(newSubcategories))
                toast.success(responseData?.message)
                setCurrentDeletingSubcategory({
                    _id : "",
                    name : ""
                })
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const handleCloseConfirmBoxButtonClick = () => {
        setCurrentDeletingSubcategory({
            _id : "",
            name : ""
        })
    }

    return (
        <section className="w-full h-full">
            <div className="relative h-14 px-4 flex items-center justify-between shadow-sm">
                <h2 className="text-xl text-neutral-600 font-bold tracking-wide">Sub Category</h2>
                <button onClick={ handleAddSubcategoryButtonClick } className={ `fixed right-[clamp(1rem,2vw,3rem)] z-50 px-2 py-1 font-semibold rounded bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white cursor-pointer ${ scrolled && "shadow-[0_0_50px_30px_rgba(0,0,0,1)] bg-white/80 hover:bg-white/90 active:bg-white/100 text-yellow-950" }` } >Add Subcategory</button>
            </div>
            { 
                (subcategories.length === 0) && (
                    <NoData message={ "No  Subcategory" } />
                )
            }
            {
                openAddSubcategorySpace && (
                    <AddSubcategorySpace setSubcategories={ setSubcategories } close={ handleCloseAddSubcategorySpace } />
                )
            }
            {
                currentEditingSubcategory?._id && (
                    <EditSubcategorySpace currentSubcategory={ currentEditingSubcategory } close={ handleCloseEditSubcategorySpace } />
                )
            }
            {
                currentDeletingSubcategory?._id && (
                    <ConfirmBox message={ `Are you sure you want to delete "${ currentDeletingSubcategory?.name }" subcategory permanently ?` } confirm={ handleConfirmDeleteButtonClick } cancel={ handleCloseConfirmBoxButtonClick } close={ handleCloseConfirmBoxButtonClick } />
                )
            }
            {
                Object.entries(listedSubcategories).map((category, ind) => {
                    return <div key={ ind } className="px-4 sm:px-6 lg:px-8 py-6 grid gap-4">
                        <div className="p-1 pl-3 sm:p-2 sm:pl-4 font-bold text-lg sm:text-2xl text-neutral-700 rounded-l-xl bg-[linear-gradient(to_right,_rgba(0,0,0,0.15)_1%,_transparent_60%)] sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.15)_1%,_transparent_30%)]">{ category[0] }</div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm-gap-4 md:gap-5 lg:gap-6">
                            {
                                category[1].map((subcategory, index) => {
                                    return (
                                        <div key={index} className="col-span-1 flex items-center justify-center rounded-lg">
                                            <SubcategoryCard openEditSpace={ handleEditSubcategoryButtonClick } openConfirmBox={ handleDeleteSubcategoryButtonClick } subcategory={ subcategory } />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                })
            }
        </section>
    )
}

export default Subcategory