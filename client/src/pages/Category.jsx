import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import AddCategorySpace from "../components/AddCategorySpace.jsx";
import AxiosToastError from "../utils/AxiosToastError.jsx";
import Axios from "../utils/Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";
import Loading from "../components/Loading.jsx";
import NoData from "../components/NoData.jsx";
import CategoryCard from "../components/CategoryCard.jsx";
import EditCategorySpace from "../components/EditCategorySpace.jsx";
import ConfirmBox from "../components/ConfirmBox.jsx";

const Category = () => {
    const [ openAddCategorySpace, setOpenAddCategorySpace ] = useState(false)
    const [ categories, setCategories ] = useState([])
    const [ loading, setLoading ] = useState(false)
    const [ scrolled, setScrolled ] = useState(false)
    const [ currentEditingCategory, setCurrentEditingCategory ] = useState({
        _id : "",
        name : "",
        image : ""
    })
    const [ currentDeletingCategory, setCurrentDeletingCategory ] = useState({
        _id : "",
        name : ""
    })

    const fetchCategories = async () => {
        try {
            setLoading(true)

            const response = await Axios({
                ...SummaryApi.get_all_categories
            })

            const { data : responseData } = response
            if (responseData?.success) {
                setCategories(responseData?.data || [])
            }
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 35)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleAddCategoryButtonClick = () => {
        setOpenAddCategorySpace(true)
    }

    const handleCloseAddCategorySpace = () => {
        setOpenAddCategorySpace(false)
    }

    const handleEditCategoryButtonClick = (category) => {
        setCurrentEditingCategory({
            _id : category?._id,
            name : category?.name,
            image : category?.image
        })
    }

    const handleCloseEditCategorySpace = () => {
        setCurrentEditingCategory({
            _id : "",
            name : "",
            image : ""
        })
    }

    const handleDeleteCategoryButtonClick = (category) => {
        setCurrentDeletingCategory({
            _id : category?._id,
            name : category?.name
        })
    }

    const handleConfirmDeleteButtonClick = async () => {
        try {
            const response = await Axios({
                ...SummaryApi?.delete_category,
                data : {
                    _id : currentDeletingCategory?._id
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                toast.success(responseData?.message)
                setCurrentDeletingCategory({
                    _id : "",
                    name : ""
                })
                fetchCategories()
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const handleCloseConfirmBoxButtonClick = () => {
        setCurrentDeletingCategory({
            _id : "",
            name : ""
        })
        fetchCategories()
    }

    return (
        <section className="w-full h-full">
            <div className="relative h-14 px-4 flex items-center justify-between shadow-sm">
                <h2 className="text-xl text-neutral-600 font-bold tracking-wide">Category</h2>
                <button onClick={ handleAddCategoryButtonClick } className={ `fixed right-[clamp(1rem,2vw,3rem)] z-50 px-2 py-1 font-semibold rounded bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white cursor-pointer ${ scrolled && "shadow-[0_0_50px_30px_rgba(0,0,0,1)] bg-white/80 hover:bg-white/90 active:bg-white/100 text-yellow-950" }` } >Add Category</button>
            </div>
            {
                loading && (
                    <Loading />
                )
            }
            { 
                (categories.length === 0 && !loading) && (
                    <NoData message={ "No  Category" } />
                )
            }
            {
                openAddCategorySpace && (
                    <AddCategorySpace fetchCategories={ fetchCategories } close={ handleCloseAddCategorySpace } />
                )
            }
            {
                currentEditingCategory?._id && (
                    <EditCategorySpace currentCategory={ currentEditingCategory } fetchCategories={ fetchCategories } close={ handleCloseEditCategorySpace } />
                )
            }
            {
                currentDeletingCategory?._id && (
                    <ConfirmBox message={ `Are you sure you want to delete "${ currentDeletingCategory?.name }" category permanently ?` } confirm={ handleConfirmDeleteButtonClick } cancel={ handleCloseConfirmBoxButtonClick } close={ handleCloseConfirmBoxButtonClick } />
                )
            }
            <div className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm-gap-4 md:gap-5 lg:gap-6">
                {
                    categories.map((category, index) => {
                        return (
                            <div key={index} className="col-span-1 flex items-center justify-center rounded-lg">
                                <CategoryCard openEditSpace={ handleEditCategoryButtonClick } openConfirmBox={ handleDeleteCategoryButtonClick } category={ category } />
                            </div>
                        )
                    })
                }
            </div>
        </section>
    )
}

export default Category