import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { useInView } from 'react-intersection-observer'
import AxiosToastError from "../utils/AxiosToastError.jsx"
import Axios from "../utils/Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"
import ProductCard from "../components/ProductCard.jsx"
import NoData from "../components/NoData.jsx"

const SearchPage = () => {
    const containerRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()
    const searchParams = new URLSearchParams(location?.search)
    const searchQuery = searchParams.get("q") || ""
    const { ref, inView } = useInView({ threshold: 0, triggerOnce: false })
    const [ searchedResults, setSearchedResults ] = useState([])
    const [ totalResultsCount, setTotalResultsCount ] = useState(0)
    const [ currentPageNumber, setCurrentPageNumber ] = useState(1)
    const [ totalPageCount, setTotalPageCount ] = useState(1)

    const fetchSearchedResults = async () => {
        try {
            const response = await Axios({
                ...SummaryApi?.get_products,
                data : {
                    page : currentPageNumber,
                    limit : 12,
                    filterOptions : {
                        search : searchQuery,
                        categories : [],
                        subcategories : []
                    }
                }
            })

            const { data : responseData } = response
            if (responseData?.success) {
                if (currentPageNumber === 1) {
                    setSearchedResults(responseData?.data)
                    setTotalResultsCount(responseData?.totalCount)
                    setTotalPageCount(responseData?.pageCount)
                } else {
                    setSearchedResults(prev => [ ...prev, ...responseData?.data ])
                }
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    useEffect(() => {
        if (searchQuery) {
            fetchSearchedResults()
        }
    }, [ currentPageNumber ])

    useEffect(() => {
        containerRef?.current.scrollTo({ top: 0 })
        if (searchQuery && currentPageNumber === 1) {
            fetchSearchedResults()
        }
        setCurrentPageNumber(1)
        if (!searchQuery) {
            setSearchedResults([])
            setTotalResultsCount(0)
            setTotalPageCount(1)
        }
    }, [ searchQuery ])
    
    useEffect(() => {
        if (inView && currentPageNumber < totalPageCount) {
            setCurrentPageNumber(prev => prev + 1)
        }
    }, [ inView ])

    const convertString = (givenString) => {
        return givenString.normalize().replace('&', 'and').replace(/[^a-zA-Z0-9 ]/g, '').replace(/\s+/g, '-').toLowerCase().trim()
    }

    const handleProductCardClick = (product) => {
        navigate(`/products/${ convertString(product?.name) }`, {
            state : { product }
        })
    }

    return (
        <section className="w-full h-full flex items-center justify-center" >
            <div ref={ containerRef } className={ `w-full h-[77vh] mx-auto sm:my-4 container ${ searchedResults.length === 0 ? "overflow-hidden" : "overflow-y-auto" } [&::-webkit-scrollbar]:w-3 [&::-webkit-scrollbar-track]:rounded [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-black/30 [&::-webkit-scrollbar-track]:bg-black/10` } >
                <div className="w-full flex items-center justify-center font-bold text-lg sm:text-xl xl:text-2xl tracking-wide text-neutral-500" >
                    { searchQuery ? `Found ${ totalResultsCount } results for "${ searchQuery }"` : "" }
                </div>
                <div className="w-full px-4 py-6 sm:p-6 lg:px-12 lg:py-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4" >
                    {
                        searchQuery.length > 0 && searchedResults.map((product, index) => {
                            return (
                                <div key={ index } className="col-span-1" >
                                    <ProductCard openProductSpace={ handleProductCardClick } product={ product } />
                                </div>
                            )
                        })
                    }
                </div>
                {
                    searchQuery.length > 0 && searchedResults.length === 0 && (
                        <div className="w-full flex items-center justify-center">
                            <NoData />
                        </div>
                    )
                }
                {
                    (currentPageNumber < totalPageCount && searchedResults.length > 0) && (
                        <div ref={ ref } className="w-full h-20 flex items-start justify-center">
                            <svg aria-hidden="true" className="inline w-15 h-15 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
                                <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
                            </svg>
                        </div>
                    )
                }
            </div>
        </section>
    )
} 

export default SearchPage