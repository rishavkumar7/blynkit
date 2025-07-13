import { useState, useEffect } from "react"
import { FaSearch, FaArrowLeft } from "react-icons/fa";
import { TypeAnimation } from 'react-type-animation';
import { Link, useLocation, useNavigate } from "react-router-dom";
import useMobile from "../hooks/useMobile.jsx"

const Search = () => {
    const location = useLocation()
    const [ isSearchPage, setIsSearchPage ] = useState(false)
    const navigate = useNavigate()
    const [ isMobile ] = useMobile() 
    const searchParams = new URLSearchParams(location?.search)
    const searchQuery = searchParams.get("q") || ""

    useEffect(() => {
        const isSearch = location.pathname === "/search"
        setIsSearchPage(isSearch)
    }, [ location ])

    const redirectToSearchPage = () => {
        navigate("/search")
    }

    const handleSearchQueryChange = (e) => {
        const searchQuery = e?.target?.value.trim()
        if (searchQuery) {
            navigate(`/search?q=${ encodeURIComponent(searchQuery) }`)
        } else {
            navigate("/search")
        }
    }

    return (
        <div className="w-full h-10 bg-slate-200 min-w-[250px] md:min-w-[300px] lg:min-w-[500px] rounded-lg border border-neutral-300 text-neutral-500 overflow-hidden flex items-center group focus-within:border-blue-800">
            <div>
                {
                    (isMobile && isSearchPage) ? (
                        <Link to={ "/" } className="flex items-center justify-center h-full p-1 m-2 group-focus-within:text-blue-800 bg-white rounded-full shadow-lg">
                            <FaArrowLeft size={ 25 }/>
                        </Link>
                    ) : (
                        <button className="flex items-center justify-center h-full p-3 group-focus-within:text-blue-800">
                            <FaSearch size={ 25 }/>
                        </button>
                    )
                }
            </div>
            <div className="w-full h-full">
                {
                    !isSearchPage ? (
                        <div onClick={ redirectToSearchPage } className="w-full h-full flex items-center">
                            <TypeAnimation
                                sequence={[
                                    'Search "milk"',
                                    1000,
                                    'Search "bread"',
                                    1000,
                                    'Search "sugar"',
                                    1000,
                                    'Search "paneer"',
                                    1000,
                                    'Search "chocolates"',
                                    1000,
                                    'Search "curd"',
                                    1000,
                                    'Search "rice"',
                                    1000,
                                    'Search "eggs"',
                                    1000,
                                    'Search "chips"',
                                    1000
                                ]}
                                wrapper="span"
                                speed={50}
                                style={{ fontSize: '1em', display: 'inline-block' }}
                                repeat={Infinity}
                            />
                        </div>
                    ) : (
                        <div className="w-full h-full">
                            <input onChange={ handleSearchQueryChange } type="text" defaultValue={ searchQuery } placeholder="Search for atta, dal and more..." autoFocus={ true } className="pr-2 bg-transparent w-full h-full outline-none sm:placeholder:text-[80%] md:placeholder:text-[85%] lg:placeholder:text-[100%]" />
                        </div>
                    )
                }
            </div>
        </div>
    )
}

export default Search