import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { FaChevronLeft, FaChevronRight } from "react-icons/fa6"
import { HiOutlineChevronDoubleDown, HiOutlineChevronDoubleUp } from "react-icons/hi"
import SubcategoryCard from "../components/SubcategoryCard.jsx"
import Axios from "../utils/Axios.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import ProductCard from "../components/ProductCard.jsx"
import PageNumber from "../components/PageNumber.jsx"
import NoData from "../components/NoData.jsx"

const ProductListing = () => {
    const subcategoryScrollRef = useRef()
    const navigate = useNavigate()
    const location = useLocation()
    const { category, subcategoryList } = location?.state || {}
    const [ isSmallWindowType, setIsSmallWindowType ] = useState(window?.innerWidth < 640)
    const [ currentSubcategory, setCurrentSubcategory ] = useState(subcategoryList[0])
    const [ subcategoryProducts, setSubcategoryProducts ] = useState([])
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1)
    const [ totalPageCount, setTotalPageCount ] = useState(1)
    const [ scrollArrowSize, setScrollArrowSize ] = useState(25)
    const [ leftScrollSubcategories, setLeftScrollSubcategories ] = useState(false)
    const [ rightScrollSubcategories, setRightScrollSubcategories ] = useState(true)
    const [ showSubcategories, setShowSubcategories ] = useState(true)

    const checkWindowType = () => {
        setIsSmallWindowType(window?.innerWidth < 640)
    }

    useEffect(() => {
        window.addEventListener("resize", checkWindowType)

        return () => {
            window.removeEventListener("resize", checkWindowType)
        }
    }, [])

    useEffect(() => {
        const newScrollArrowSize = isSmallWindowType ? 20 : 25
        setScrollArrowSize(newScrollArrowSize)
    }, [ isSmallWindowType ])

    const fetchProductsFromSubcategoryId = async (subcategoryId) => {
        try {
            const response = await Axios({
                ...SummaryApi?.get_products,
                data : {
                    page : currentPageNumber,
                    limit : 10,
                    filterOptions : {
                        search : "",
                        categories : [ category?._id ],
                        subcategories : [ subcategoryId ]
                    }
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                setSubcategoryProducts(responseData?.data)
                setTotalPageCount(responseData?.pageCount)
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        if (currentPageNumber > 0) {
            fetchProductsFromSubcategoryId(currentSubcategory?._id)
        }
    }, [ currentPageNumber, currentSubcategory?._id ])

    const convertString = (givenString) => {
        return givenString.normalize().replace('&', 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase().trim()
    }

    const handleSubcategoryCardClick = (subcategory) => {
        setCurrentPageNumber(1)
        navigate(`/${ convertString(category?.name) }/${ convertString(subcategory?.name) }`, {
            state : {
                category,
                subcategoryList
            }
        })
        setCurrentSubcategory(subcategory)
    }

    const checkSubcategoryScroll = () => {
        const ele = subcategoryScrollRef?.current
        if (!ele) {
            return
        }

        setLeftScrollSubcategories(ele?.scrollLeft > 1)
        setRightScrollSubcategories(ele?.scrollLeft + ele?.clientWidth + 1 < ele?.scrollWidth)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            checkSubcategoryScroll()
        }, 300)

        const ele = subcategoryScrollRef?.current
        if (!ele) {
            return
        }

        ele?.addEventListener("scroll", checkSubcategoryScroll)
        window?.addEventListener("resize", checkSubcategoryScroll)

        return () => {
            ele?.removeEventListener("scroll", checkSubcategoryScroll)
            window?.removeEventListener("resize", checkSubcategoryScroll)
            clearTimeout(timeout)
        }
    }, [])

    const handleLeftScrollSubcategoriesButtonClick = () => {
        subcategoryScrollRef?.current?.scrollBy({
            left : -0.8 * subcategoryScrollRef?.current?.clientWidth,
            behavior : "smooth"
        })
    }

    const handleRightScrollSubcategoriesButtonClick = () => {
        subcategoryScrollRef?.current?.scrollBy({
            left : 0.8 * subcategoryScrollRef?.current?.clientWidth,
            behavior : "smooth"
        })
    }

    const handleHideSubcategoriesButtonClick = () => {
        setShowSubcategories(false)
    }

    const handleShowSubcategoriesButtonClick = () => {
        setShowSubcategories(true)
    }

    const handleProductCardClick = (product) => {
        navigate(`/products/${ convertString(product?.name) }`, {
            state : { product }
        })
    }

    return (
        <section className="w-full h-full" >
            <div className={ `relative w-fit h-[77vh] m-1 px-1 sm:m-4 sm:mx-8 overflow-y-auto sm:grid sm:grid-cols-6 md:grid-cols-7 lg:grid-cols-9 xl:grid-cols-11 2xl:grid-cols-13 ${ isSmallWindowType ? "[&::-webkit-scrollbar]:hidden" : "" }` } >
                <div className={ `w-full sticky top-0 sm:relative sm:col-span-2 z-10 sm:z-0 sm:overflow-y-auto sm:[direction:rtl] sm:[&>*]:[direction:ltr] ${ showSubcategories ? "bg-amber-50 sm:bg-transparent" : "bg-transparent" } ${ isSmallWindowType ? "transition-all duration-1000 ease-in-out" : "[&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-black/10" } ${ showSubcategories ? "max-h-[100%]" : "max-h-0 sm:max-h-[100%]" }` } >
                    <div className={ `transition-all duration-1000 ease-in-out transform ${ showSubcategories ? "translate-y-0" : "-translate-y-full sm:translate-y-0" }` } >
                        <div ref={ subcategoryScrollRef } className={ `p-2 sm:pl-4 w-full h-full ${ showSubcategories ? "border-b-2 border-neutral-300 sm:border-none" : "border-none" } ${ isSmallWindowType ? "overflow-x-auto [&::-webkit-scrollbar]:hidden" : "" }` } >
                            <div className="w-full h-full grid grid-flow-col auto-cols-[30%] sm:flex sm:flex-col sm:items-center gap-2 sm:gap-3" >
                                {
                                    subcategoryList.map((subcategory, index) => (
                                        <div onClick={ () => { handleSubcategoryCardClick(subcategory) } } key={ index } className={ `w-full h-full grid sm:flex gap-1 sm:gap-2 cursor-pointer ${ (currentSubcategory?._id === subcategory?._id) ? "pointer-events-none" : "" }` } >
                                            <SubcategoryCard subcategory={ subcategory } />
                                            <div className={ `${ isSmallWindowType ? "w-full h-2" : "w-2 h-auto" } ${ (currentSubcategory?._id === subcategory?._id) ? "bg-slate-500 rounded-t-full sm:rounded-t-none sm:rounded-l-full" : "bg-transparent" }` } ></div>
                                        </div>
                                    ))
                                }
                            </div>
                        </div>
                        {
                            isSmallWindowType && showSubcategories && (
                                <div className="absolute bottom-0 left-0 right-0 flex item-center justify-center">
                                    <div onClick={ handleHideSubcategoriesButtonClick } className="w-12 h-4 group bg-[rgba(82,82,82,0.5)] hover:bg-[rgba(0,0,0,1)] wavy-up-shape flex items-center justify-center cursor-pointer">
                                        <HiOutlineChevronDoubleUp size={ 15 } className="text-white/50 group-hover:text-white" />
                                    </div>
                                </div>
                            )
                        }
                        {
                            isSmallWindowType && leftScrollSubcategories && (
                                <div className={ `absolute left-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_right,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-start` } >
                                    <FaChevronLeft onClick={ handleLeftScrollSubcategoriesButtonClick } size={ scrollArrowSize } className="cursor-pointer" />
                                </div>
                            )
                        }
                        {
                            isSmallWindowType && rightScrollSubcategories && (
                                <div className={ `absolute right-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_left,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-end` } >
                                    <FaChevronRight onClick={ handleRightScrollSubcategoriesButtonClick } size={ scrollArrowSize } className="cursor-pointer" />
                                </div>
                            )
                        }
                    </div>
                </div>
                <div className={ `relative w-full h-full sm:mt-0 pt-2 sm:p-2 sm:px-4 lg:px-6 2xl:px-8 sm:col-span-4 md:col-span-5 lg:col-span-7 xl:col-span-9 2xl:col-span-11 sm:overflow-y-auto [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-black/10` } >
                    <div className="p-2 pl-3 sm:p-2 sm:pl-4 font-bold text-lg sm:text-2xl text-neutral-700 rounded-l-xl bg-[linear-gradient(to_right,_rgba(0,0,0,0.15)_1%,_transparent_60%)] sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.15)_1%,_transparent_30%)]">
                        { currentSubcategory?.name }
                    </div>
                    <div className={ `w-full mt-1 p-2 sm:mt-6 sm:p-0 ${ subcategoryProducts.length === 0 ? "flex items-center justify-center" : "grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 sm:gap-4 lg:gap-6 2xl:gap-8" }` } >
                        {
                            subcategoryProducts.length === 0 ? (
                                <div className="w-full flex items-center justify-center" >
                                    <NoData message={ "No  Product" } /> 
                                </div>
                            ) : (
                                subcategoryProducts.map((product, index) => (
                                    <div key={ index } className="col-span-1 sm:col-span-2" >
                                        <ProductCard openProductSpace={ handleProductCardClick } product={ product } />
                                    </div>
                                ))
                            )
                        }
                    </div>
                    {
                        (subcategoryProducts.length !== 0) && (
                            <div>
                                <div className="mt-8 flex">
                                    <div className="w-full h-[2px] bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                                    <div className="w-full h-[2px] bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_80%)]  sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                                </div>
                                <div className="m-2 flex items-center justify-center" >
                                    <PageNumber currentPageNumber={ currentPageNumber } setCurrentPageNumber={ setCurrentPageNumber } totalPageCount={ totalPageCount } />
                                </div>
                                <div className="mb-5 flex">
                                    <div className="w-full h-[2px] bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_left,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                                    <div className="w-full h-[2px] bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_80%)] sm:bg-[linear-gradient(to_right,_rgba(0,0,0,0.2)_1%,_transparent_40%)]"></div>
                                </div>
                            </div>
                        )
                    }
                </div>
            </div>
            {
                isSmallWindowType && !showSubcategories && (
                    <div className="sticky bottom-[100%] z-10 w-full border-t-2 border-neutral-300 flex items-center justify-center" >
                        <div onClick={ handleShowSubcategoriesButtonClick } className="w-12 h-4 group bg-[rgba(82,82,82,0.5)] hover:bg-[rgba(0,0,0,1)] wavy-down-shape flex items-center justify-center cursor-pointer -translate-y-[2px]">
                            <HiOutlineChevronDoubleDown size={ 15 } className="text-white/50 group-hover:text-white" />
                        </div>
                    </div>
                )
            }
        </section>
    )
}

export default ProductListing