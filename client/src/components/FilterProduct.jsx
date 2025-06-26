import { useState } from "react"
import { useSelector } from "react-redux"
import { IoClose } from "react-icons/io5"

const FilterProduct = ({ filterOptions, setFilterOptions, setCurrentPageNumber, close }) => {
    const categories = useSelector(state => state?.product?.categories)
    const subcategories = useSelector(state => state?.product?.subcategories)
    const [ searchString, setSearchString ] = useState(filterOptions?.search)
    const [ checkedCategories, setCheckedCategories ] = useState(filterOptions?.categories)
    const [ checkedSubcategories, setCheckedSubcategories ] = useState(filterOptions?.subcategories)

    const filterSubcategoriesFromCategories = (subcategories) => {
        return [ ...subcategories ].filter(subcat => {
            let check = false

            subcat?.category.forEach(cat => {
                if (checkedCategories.find(categoryId => categoryId === cat?._id)) {
                    check=true
                }
            })

            return check
        })
    }

    const handleSearchStringChange = (e) => {
        const value = e?.target?.value

        setSearchString(value)
    }

    const handleCategoriesChange = (e) => {
        const { value, checked } = e?.target

        if (checked) {
            setCheckedCategories([ ...checkedCategories, value ])
        } else {
            const newCheckedCategories = checkedCategories.filter(categoryId => categoryId !== value)
            setCheckedCategories(newCheckedCategories)

            const newCheckedSubcategories = checkedSubcategories.filter(subcatId => {
                let check = false

                const subcategory = subcategories.find(subcat => subcat?._id === subcatId)
                subcategory?.category.forEach(cat => {
                    if (newCheckedCategories.includes(cat?._id)) {
                        check = true
                    }
                })

                return check
            })
            setCheckedSubcategories(newCheckedSubcategories)
        }
    }

    const handleClearCheckedCategoriesButtonClick = () => {
        setCheckedCategories([])
        setCheckedSubcategories([])
    }

    const handlesubcategoriesChange = (e) => {
        const { value, checked } = e?.target

        if (checked) {
            setCheckedSubcategories([ ...checkedSubcategories, value ])
        } else {
            const newCheckedSubcategories = checkedSubcategories.filter(subcategoryId => subcategoryId !== value)
            setCheckedSubcategories(newCheckedSubcategories)
        }
    }

    const handleClearCheckedSubcategoriesButtonClick = () => {
        setCheckedSubcategories([])
    }

    const handleResetButtonClick = () => {
        setSearchString("")
        setCheckedCategories([])
        setCheckedSubcategories([])
        setFilterOptions({
            search : "",
            categories : [],
            subcategories : []
        })
        setCurrentPageNumber(1)

        close()
    }
    
    const isFilterAllowed = () => {
        const isSubset = (a1, a2) => {
            const set2 = new Set(a2)
            return a1.every(item => set2.has(item))
        }

        const isEqual = (arr1, arr2) => {
            return isSubset(arr1, arr2) && isSubset(arr2, arr1)
        }

        return !(searchString === filterOptions?.search && isEqual(checkedCategories, filterOptions?.categories) && isEqual(checkedSubcategories, filterOptions?.subcategories))
    }

    const handleDoneButtonClick = () => {
        if (isFilterAllowed()) {
            setFilterOptions({
                search : searchString,
                categories : checkedCategories,
                subcategories : checkedSubcategories
            })
            setCurrentPageNumber(1)
        }

        close()
    }

    return (
        <section className="fixed top-0 bottom-0 left-0 right-0 bg-[rgba(0,0,0,0.9)] sm:bg-[rgba(0,0,0,0.7)] sm:bg-[linear-gradient(to_left,_rgba(0,0,0,0.8)_50%,_transparent_100%)] lg:bg-[linear-gradient(to_left,_rgba(0,0,0,0.8)_20%,_transparent_100%)] flex items-start justify-end z-200">
            <div className="text-white max-w-sm sm:max-w-md max-h-full w-full mx-2 my-4 sm:mx-4 p-2 sm:p-4 rounded grid gap-4 overflow-y-scroll [&::-webkit-scrollbar]:hidden">
                <div className="font-semibold text-2xl flex items-center justify-between">
                    <p className="tracking-wider">Filter Products</p>
                    <IoClose size={ 30 } onClick={ close } className="cursor-pointer" />
                </div>
                <div>
                    <input onChange={ handleSearchStringChange } type="text" placeholder="Search Products" value={ searchString } className="w-full px-3 py-2 bg-white/20 rounded outline-none hover:bg-white/30" />
                </div>
                <div className="">
                    <div className="w-full px-4 py-2 bg-white/20 rounded-t flex items-center justify-between">
                        <p className="text-lg font-semibold tracking-wider">Categories</p>
                        {
                            checkedCategories[0] && (
                                <button onClick={ handleClearCheckedCategoriesButtonClick } className="bg-white/20 hover:bg-white/40 text-sm px-2 rounded cursor-pointer">Clear</button>
                            )
                        }
                    </div>
                    <div className="w-full max-h-[180px] px-4 py-1 bg-white/20 rounded-b flex flex-col gap-1 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent">
                        {
                            categories.map(category => {
                                return (
                                    <div key={ category?._id } className="w-full px-2 flex items-center justify-start hover:bg-white/30 rounded" >
                                        <label htmlFor={ category?._id } className="w-full flex gap-2 cursor-pointer" >
                                            <input onChange={ handleCategoriesChange } type="checkbox" checked={ checkedCategories.includes(category?._id) } id={ category?._id } value={ category?._id } className="m-auto w-5 h-5 rounded appearance-none bg-white/10 checked:bg-white cursor-pointer" />
                                            <span className="w-full text-sm">{ category?.name }</span>
                                        </label>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
                {
                    checkedCategories[0] && (
                        <div className="">
                            <div className="w-full px-4 py-2 bg-white/20 rounded-t flex items-center justify-between">
                                <p className="text-lg font-semibold tracking-wider">Subcategories</p>
                                {
                                    checkedSubcategories[0] && (
                                        <button onClick={ handleClearCheckedSubcategoriesButtonClick } className="bg-white/20 hover:bg-white/40 text-sm px-2 rounded cursor-pointer">Clear</button>
                                    )
                                }
                            </div>
                            <div className="w-full max-h-[180px] px-4 py-1 bg-white/20 rounded-b flex flex-col gap-1 overflow-y-scroll [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded [&::-webkit-scrollbar-thumb]:bg-white/30 [&::-webkit-scrollbar-track]:bg-transparent">
                                {
                                    filterSubcategoriesFromCategories(subcategories).map(subcategory => {
                                        return (
                                            <div key={ subcategory?._id } className="w-full px-2 flex items-center justify-start hover:bg-white/30 rounded" >
                                                <label htmlFor={ subcategory?._id } className="w-full flex gap-2 cursor-pointer" >
                                                    <input onChange={ handlesubcategoriesChange } type="checkbox" checked={ checkedSubcategories.includes(subcategory?._id) } id={ subcategory?._id } value={ subcategory?._id } className="m-auto w-5 h-5 rounded appearance-none bg-white/10 checked:bg-white cursor-pointer" />
                                                    <span className="w-full text-sm">{ subcategory?.name }</span>
                                                </label>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    )
                }
                <div className="flex items-center justify-between">
                    <button onClick={ handleDoneButtonClick } className="px-4 py-1 rounded font-semibold bg-white/30 hover:bg-white/50 cursor-pointer" >Filter</button>
                    {
                        (searchString || checkedCategories[0] || checkedSubcategories[0]) && (
                            <button onClick={ handleResetButtonClick } className="px-4 py-1 rounded font-semibold bg-white/30 hover:bg-white/50 cursor-pointer" >Reset</button>
                        )
                    }
                </div>
            </div>
        </section>
    )
}

export default FilterProduct