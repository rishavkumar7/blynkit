import { useEffect, useState } from "react"
import { FaFilter } from "react-icons/fa"
import Axios from "../utils/Axios.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import NoData from "../components/NoData.jsx"
import ProductCard from "../components/ProductCard.jsx"
import EditProductSpace from "../components/EditProductSpace.jsx"
import ConfirmBox from "../components/ConfirmBox.jsx"
import FilterProduct from "../components/FilterProduct.jsx"
import { successAlert } from "../utils/successAlert.jsx"
import PageNumber from "../components/PageNumber.jsx"

const ProductsAdmin = () => {
    const [ products, setProducts ] = useState([])
    const [ scrolled, setScrolled ] = useState(false)
    const [ apiCall, setApiCall ] = useState(false)
    const [ filterSpace, setFilterSpace ] = useState(false)
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1)
    const [ totalPageCount, setTotalPageCount ] = useState(1)
    const [ filterOptions, setFilterOptions ] = useState({
        search : "",
        categories : [],
        subcategories : []
    })
    const [ currentEditingProduct, setCurrentEditingProduct ] = useState({
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
    const [ currentDeletingProduct, setCurrentDeletingProduct ] = useState({
        _id : "",
        name : ""
    })

    const fetchProducts = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.get_products,
                data : {
                    page : currentPageNumber,
                    limit : 1,
                    filterOptions : filterOptions
                }
            })

            const { data : responseData } = response

            if (responseData?.success) {
                setProducts(responseData?.data)
                setTotalPageCount(responseData?.pageCount)
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        fetchProducts()
    }, [ currentPageNumber, filterOptions ])

    useEffect(() => {
        if (apiCall) {
            fetchProducts()
            setApiCall(false)
        }
    }, [ apiCall ])

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 35)
        }

        window.addEventListener("scroll", handleScroll)

        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    const handleFilterProductsButtonClick = () => {
        setFilterSpace(true)
    }

    const handleCloseFilterSpaceButtonClick = () => {
        setFilterSpace(false)
    }

    const handleEditProductButtonClick = (product) => {
        setCurrentEditingProduct({
            _id : product?._id,
            name : product?.name,
            image : product?.image,
            category : product?.category,
            sub_category : product?.sub_category,
            unit : product?.unit,
            stock : product?.stock,
            price : product?.price,
            discount : product?.discount,
            description : product?.description,
            more_details : product?.more_details,
            publish : product?.publish
        })
    }

    const handleCloseEditProductSpace = () => {
        setCurrentEditingProduct({
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
    }

    const handleDeleteProductButtonClick = (product) => {
        setCurrentDeletingProduct({
            _id : product?._id,
            name : product?.name
        })
    }

    const handleConfirmDeleteButtonClick = async () => {
        try {
            const response = await Axios({
                ...SummaryApi?.delete_product,
                data : {
                    _id : currentDeletingProduct?._id
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                successAlert(responseData?.message)
                setCurrentDeletingProduct({
                    _id : "",
                    name : ""
                })
                setApiCall(true)
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const handleCloseConfirmBoxButtonClick = () => {
        setCurrentDeletingProduct({
            _id : "",
            name : ""
        })
    }

    return (
        <section className="w-full h-full">
            <div className="relative h-14 px-4 flex items-center justify-between shadow-sm">
                <h2 className="text-xl text-neutral-600 font-bold tracking-wide">Product</h2>
                <button onClick={ handleFilterProductsButtonClick } className={ `fixed right-[clamp(1rem,2vw,3rem)] z-50 px-2 py-1 font-semibold rounded bg-blue-800 hover:bg-blue-700 active:bg-blue-600 text-white cursor-pointer flex items-center justify-center gap-1 ${ scrolled && "shadow-[0_0_50px_30px_rgba(0,0,0,1)] bg-white/80 hover:bg-white/90 active:bg-white/100 text-yellow-950" }` } >
                    Filter
                    <FaFilter size={ 14 } />
                </button>
            </div>
            { 
                (products.length === 0) && (
                    <NoData message={ "No  Products" } />
                )
            }
            {
                currentEditingProduct?._id && (
                    <EditProductSpace currentProduct={ currentEditingProduct } setApiCall={ setApiCall } close={ handleCloseEditProductSpace } />
                )
            }
            {
                currentDeletingProduct?._id && (
                    <ConfirmBox message={ `Are you sure you want to delete "${ currentDeletingProduct?.name }" product permanently ?` } confirm={ handleConfirmDeleteButtonClick } cancel={ handleCloseConfirmBoxButtonClick } close={ handleCloseConfirmBoxButtonClick } />
                )
            }
            {
                filterSpace && (
                    <FilterProduct filterOptions={ filterOptions } setFilterOptions={ setFilterOptions } setCurrentPageNumber={ setCurrentPageNumber } close={ handleCloseFilterSpaceButtonClick } />
                )
            }
            <div className="px-4 sm:px-6 lg:px-8 py-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm-gap-4 md:gap-5 lg:gap-6">
                {
                    products.map((product, index) => {
                        return (
                            <div key={index} className="col-span-1 flex items-center justify-center rounded-lg">
                                <ProductCard openEditSpace={ handleEditProductButtonClick } openConfirmBox={ handleDeleteProductButtonClick } product={ product } />
                            </div>
                        )
                    })
                }
            </div>
            <div className="mt-5 flex">
                <div className="w-full h-[2px] bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                <div className="w-full h-[2px] bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_80%)]  sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
            </div>
            <div className="m-2 flex items-center justify-center">
                <PageNumber currentPageNumber={ currentPageNumber } setCurrentPageNumber={ setCurrentPageNumber } totalPageCount={ totalPageCount } />
            </div>
            <div className="mb-5 flex">
                <div className="w-full h-[2px] bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                <div className="w-full h-[2px] bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
            </div>
        </section>
    )
}

export default ProductsAdmin