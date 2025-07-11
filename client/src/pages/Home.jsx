import { useEffect, useMemo, useRef, useState } from "react"
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaChevronLeft, FaChevronRight  } from "react-icons/fa6"
import CategoryCard from "../components/CategoryCard.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import ProductCard from "../components/ProductCard.jsx"

const Home = () => {
    const navigate = useNavigate()
    const intervalRef = useRef()
    const categoryScrollRef = useRef()
    const productScrollRefs = useRef([])
    const categories = useSelector(state => state?.product?.categories)
    const subcategories = useSelector(state => state?.product?.subcategories)
    const [ isSmallWindowType, setIsSmallWindowType ] = useState(window?.innerWidth < 640)
    const [ currentCarouselImage, setCurrentCarouselImage ] = useState(0)
    const [ isTransitionAllowed, setIsTransitionAllowed ] = useState(true)
    const [ expandCategories, setExpandCategories ] = useState(false)
    const [ leftScrollCategories, setLeftScrollCategories ] = useState(false)
    const [ rightScrollCategories, setRightScrollCategories ] = useState(true)
    const [ leftScrollProducts, setLeftScrollProducts ] = useState([])
    const [ rightScrollProducts, setRightScrollProducts ] = useState([])
    const [ categoryProducts, setCategoryProducts ] = useState([])
    const [ scrollArrowSize, setScrollArrowSize ] = useState(25)
    const smallScreenImageModules = import.meta.glob("../assets/carousel/mobile-view/image*", { eager: true })
    const largeScreenImageModules = import.meta.glob("../assets/carousel/desktop-view/image*", { eager: true })
    const images = Object.values(isSmallWindowType ? smallScreenImageModules : largeScreenImageModules).map(mod => mod.default)
    const carouselImagesList = useMemo(() => [ images[images.length - 1], ...images, images[0] ], [ images ])

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
    
    useEffect(() => {
        if (intervalRef.current) {
            clearInterval(intervalRef.current)
        }

        intervalRef.current = setInterval(() => {
            setCurrentCarouselImage(prev => {
                return prev === carouselImagesList.length - 1 ? 1 : prev + 1 
            })
        }, 4000)

        return () => clearInterval(intervalRef.current)
    }, [ currentCarouselImage, carouselImagesList.length ])

    useEffect(() => {
        if (currentCarouselImage === carouselImagesList.length - 1) {
            const timeOut = setTimeout(() => {
                setIsTransitionAllowed(false)
                setCurrentCarouselImage(1)
            }, 1000)

            return () => clearTimeout(timeOut)
        } else {
            const timeOut = setTimeout(() => {
                setIsTransitionAllowed(true)
            }, 100)

            return () => clearTimeout(timeOut)
        }
    }, [ currentCarouselImage, carouselImagesList.length ])

    const checkCategoryScroll = () => {
        const ele = categoryScrollRef?.current
        if (!ele) {
            return
        }

        setLeftScrollCategories(ele?.scrollLeft > 1)
        setRightScrollCategories(ele?.scrollLeft + ele?.clientWidth + 1 < ele?.scrollWidth)
    }

    useEffect(() => {
        const timeout = setTimeout(() => {
            checkCategoryScroll()
        }, 300)

        const ele = categoryScrollRef?.current
        if (!ele) {
            return
        }

        ele?.addEventListener("scroll", checkCategoryScroll)
        window?.addEventListener("resize", checkCategoryScroll)

        return () => {
            ele?.removeEventListener("scroll", checkCategoryScroll)
            window?.removeEventListener("resize", checkCategoryScroll)
            clearTimeout(timeout)
        }
    }, [ expandCategories ])

    useEffect(() => {
        if (categories?.length) {
            setLeftScrollProducts(new Array(categories?.length).fill(false))
            setRightScrollProducts(new Array(categories?.length).fill(true))
            setCategoryProducts(new Array(categories?.length).fill({
                productList : [],
                productCount : 0
            }))
        }
    }, [ categories ])

    const checkProductScroll = (index) => {
        const ele = productScrollRefs?.current[index]
        if (!ele) {
            return
        }

        const leftCheck = ele?.scrollLeft > 1
        const rightCheck = ele?.scrollLeft + ele?.clientWidth + 1 < ele?.scrollWidth

        setLeftScrollProducts(prev => prev.map((value, ind) => ind === index ? leftCheck : value))
        setRightScrollProducts(prev => prev.map((value, ind) => ind === index ? rightCheck : value ))
    }

    useEffect(() => {
        const timeouts = []
        productScrollRefs?.current.forEach((ele, index) => {
            if (ele) {
                timeouts[index] = setTimeout(() => {
                    checkProductScroll(index)
                }, 800)
            }
        })

        productScrollRefs?.current.forEach((ele, index) => {
            if (ele) {
                ele?.addEventListener("scroll", () => { checkProductScroll(index) })
            }
            window?.addEventListener("resize", () => { checkProductScroll(index) })
        })


        return () => {
            productScrollRefs?.current.forEach((ele, index) => {
                if (ele) {
                    ele?.removeEventListener("scroll", () => { checkProductScroll(index) })
                }
                window?.removeEventListener("resize", () => { checkProductScroll(index) })
                clearTimeout(timeouts[index])
            })
        }
    }, [ categories?.length ])

    useEffect(() => {
        fetchProductsFromAllCategories()
    }, [ categories ])

    const handleLeftSlideButtonClick = () => {
        if (currentCarouselImage === 1) {
            setCurrentCarouselImage(0)
            const timeOut1 = setTimeout(() => {
                setIsTransitionAllowed(false)
                setCurrentCarouselImage(carouselImagesList.length - 2)
            }, 1000)

            const timeOut2 = setTimeout(() => {
                setIsTransitionAllowed(true)
            }, 1100)

            return () => {
                clearTimeout(timeOut1)
                clearTimeout(timeOut2)
            }
        } else {
            setCurrentCarouselImage(prev => prev - 1)
        }
    }

    const handleRightSlideButtonClick = () => {
        if (currentCarouselImage === carouselImagesList.length - 2) {
            setCurrentCarouselImage(carouselImagesList.length - 1)
            const timeOut1 = setTimeout(() => {
                setIsTransitionAllowed(false)
                setCurrentCarouselImage(1)
            }, 1000)

            const timeOut2 = setTimeout(() => {
                setIsTransitionAllowed(true)
            }, 1100)

            return () => {
                clearTimeout(timeOut1)
                clearTimeout(timeOut2)
            }
        } else {
            setCurrentCarouselImage(prev => prev + 1)
        }
    }

    const convertString = (givenString) => {
        return givenString.normalize().replace('&', 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase().trim()
    }

    const handleCategoryCardClick = (category) => {
        const subcategoryList = [ ...subcategories ].filter(subcategory => {
            return subcategory?.category.map(cat => cat?._id).includes(category?._id)
        })

        navigate(`/${ convertString(category?.name) }/${ convertString(subcategoryList[0]?.name) }`, {
            state : { 
                category,
                subcategoryList
            }
        })
    }

    const handleExpandCategoriesButtonClick = () => {
        setExpandCategories(prev => !prev)
    }

    const handleLeftScrollCategoriesButtonClick = () => {
        categoryScrollRef?.current?.scrollBy({
            left : -0.8 * categoryScrollRef?.current?.clientWidth,
            behavior : "smooth"
        })
    }

    const handleRightScrollCategoriesButtonClick = () => {
        categoryScrollRef?.current?.scrollBy({
            left : 0.8 * categoryScrollRef?.current?.clientWidth,
            behavior : "smooth"
        })
    }

    const fetchProductsFromCategoryId = async (categoryId, index) => {
        try {
            const response = await Axios({
                ...SummaryApi?.get_products,
                data : {
                    page : 1,
                    limit : 50,
                    filterOptions : {
                        search : "",
                        categories : [ categoryId ],
                        subcategories : []
                    }
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                setCategoryProducts(prev => prev.map((value, ind) => ind === index ? { productList : responseData?.data, productCount : responseData?.totalCount } : value ))
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    const fetchProductsFromAllCategories = () => {
        [ ...categories ].forEach((category, index) => {
            fetchProductsFromCategoryId(category?._id, index)
        })
    }

    const handleProductCardClick = (product) => {
        navigate(`/products/${ convertString(product?.name) }`, {
            state : { product }
        })
    }

    const handleExpandProductsButtonClick = (category) => {
        handleCategoryCardClick(category)
    }

    const handleProductScrollRefs = (index) => (ref) => {
        productScrollRefs.current[index] = ref
        return ref
    }

    const handleLeftScrollProductsButtonClick = (index) => {
        productScrollRefs?.current[index]?.scrollBy({
            left : -0.8 * productScrollRefs?.current[index]?.clientWidth,
            behavior : "smooth"
        })
    }

    const handleRightScrollProductsButtonClick = (index) => {
        productScrollRefs?.current[index]?.scrollBy({
            left : 0.8 * productScrollRefs?.current[index]?.clientWidth,
            behavior : "smooth"
        })
    }

    return (
        <section className="w-full h-full">
            <div className="relative w-full h-full overflow-hidden">
                <div className={ `flex ${ isTransitionAllowed ? "transition-transform duration-1000 ease-in-out" : "" }` } style={{ transform: `translateX(-${currentCarouselImage * 100}%)` }} >
                    {
                        carouselImagesList.map((imageUrl, index) => {
                            return (
                                <div key={ index } className="w-full h-60 sm:h-110 flex-shrink-0 overflow-hidden">
                                    <img src={ imageUrl } alt={ imageUrl } className="w-full h-full object-cover object-center" />
                                </div>
                            )
                        }) 
                    }
                </div>
                <div className="absolute left-1 sm:left-5 top-0 bottom-0 flex items-center z-1">
                    <button disabled={ currentCarouselImage === 0 } onClick={ handleLeftSlideButtonClick } className="cursor-pointer" >
                        <FaChevronLeft size={ isSmallWindowType ? 40 : 60 } />
                    </button>
                </div>
                <div className="absolute right-1 sm:right-5 top-0 bottom-0 flex items-center z-1">
                    <button disabled={ currentCarouselImage === carouselImagesList.length - 1 } onClick={ handleRightSlideButtonClick } className="cursor-pointer" >
                        <FaChevronRight size={ isSmallWindowType ? 40 : 60 } />
                    </button>
                </div>
                <div className="absolute inset-0 w-full h-full flex items-end bg-[linear-gradient(to_top,_rgba(255,251,235,1)_2%,_transparent_30%)]"></div>
                <div className="absolute bottom-5 sm:bottom-10 left-0 right-0 flex items-center justify-center gap-3">
                    {
                        images.map((imageUrl, index) => {
                            return (
                                <div key={ index } className="p-1 flex items-center justify-center bg-black rounded-full">
                                    <div key={ index } className={ `w-2 h-2 sm:w-3 sm:h-3 rounded-full ${ imageUrl === carouselImagesList[currentCarouselImage] ? "bg-amber-50" : "bg-black" }` } ></div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className={ `m-2 sm:mx-8` } >
                <div className="flex items-center justify-between">
                    <h2 className="font-bold text-md sm:text-xl text-neutral-600">Select by Category</h2>
                    <p onClick={ handleExpandCategoriesButtonClick } className="text-xs sm:text-lg text-neutral-600 hover:text-blue-500 font-semibold cursor-pointer">
                        { expandCategories ? "Show less" : "See all" }
                    </p>
                </div>
                <div className="w-full relative">
                    <div ref={ categoryScrollRef } className={ `w-full ${ !expandCategories ? "px-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden" : "" }` } >
                        <div className={ `my-3 grid ${ !expandCategories ? "grid-flow-col auto-cols-[30%] sm:auto-cols-[23%] md:auto-cols-[18%] lg:auto-cols-[11.5%]" : "grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-8" } gap-2 sm:gap-4` } >
                            {
                                [ ...categories ].map((category, index) => {
                                    return (
                                        <div key={ index } className={ `${ expandCategories ? "col-span-1" : "" }` } >
                                            <CategoryCard openCategorySpace={ handleCategoryCardClick } category={ category } />
                                        </div>
                                    )
                                })
                            }
                        </div>
                    </div>
                    {
                        !expandCategories && leftScrollCategories && (
                            <div className={ `absolute left-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_right,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-start` } >
                                <FaChevronLeft onClick={ handleLeftScrollCategoriesButtonClick } size={ scrollArrowSize } className="cursor-pointer" />
                            </div>
                        )
                    }
                    {
                        !expandCategories && rightScrollCategories && (
                            <div className={ `absolute right-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_left,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-end` } >
                                <FaChevronRight onClick={ handleRightScrollCategoriesButtonClick } size={ scrollArrowSize } className="cursor-pointer" />
                            </div>
                        )
                    }
                </div>
            </div>
            <div className={ `m-2 sm:mx-8` } >
                {
                    [ ...categories ].map((category, index) => (
                        <div key={ index } className="my-4 sm:my-6">
                            <div className="flex items-center justify-between">
                                <h2 className="font-bold text-md sm:text-xl text-neutral-600">{ category?.name }</h2>
                                <p onClick={ () => handleExpandProductsButtonClick(category) } className="text-xs sm:text-lg text-neutral-600 hover:text-blue-500 font-semibold cursor-pointer">
                                    See all
                                </p>
                            </div>
                            <div className="w-full relative">
                                <div ref={ handleProductScrollRefs(index) } className={ `w-full px-2 overflow-x-auto no-scrollbar [&::-webkit-scrollbar]:hidden` } >
                                    <div className={ `my-3 grid grid-flow-col auto-cols-[45%] sm:auto-cols-[33%] md:auto-cols-[25%] lg:auto-cols-[14%] gap-2 sm:gap-4` } >
                                        {
                                            categoryProducts[index]?.productList.map((product, index) => {
                                                return (
                                                    <div key={ index } className="" >
                                                        <ProductCard openProductSpace={ handleProductCardClick } product={ product } />
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                </div>
                                {
                                    [ ...leftScrollProducts ][index] && (
                                        <div className="absolute left-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_right,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-start" >
                                            <FaChevronLeft onClick={ () => { handleLeftScrollProductsButtonClick(index) } } size={ scrollArrowSize } className="cursor-pointer" />
                                        </div>
                                    )
                                }
                                {
                                    [ ...rightScrollProducts ][index] && (
                                        <div className="absolute right-[-1%] top-0 w-[8%] sm:w-[4%] h-full bg-[linear-gradient(to_left,_rgba(255,251,235,1)_40%,_transparent_100%)] flex items-center justify-end" >
                                            <FaChevronRight onClick={ () => { handleRightScrollProductsButtonClick(index) } } size={ scrollArrowSize } className="cursor-pointer" />
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    ))
                }
            </div>
        </section>
    )
}

export default Home