import { useEffect, useState } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import { GiHamburgerMenu } from "react-icons/gi"
import { BsCart2 } from "react-icons/bs"
import { GoTriangleDown, GoTriangleUp } from "react-icons/go"
import { CgProfile } from "react-icons/cg"
import { LiaRupeeSignSolid } from "react-icons/lia"
import logo from "../assets/blynkit-logo.png"
import Search from "./Search"
import useMobile from "../hooks/useMobile"
import UserMenu from "./UserMenu.jsx"
import { useCart } from "../utils/GlobalCartProvider.jsx"
import calculateDiscountedPrice from "../utils/calculateDiscountedPrice.js"
import CartComponent from "./CartComponent.jsx"

const Header = () => {
    const cartContext = useCart()
    const cartData = cartContext?.cartData
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [ openMenu, setOpenMenu ] = useState(false)
    const [ totalCartDisplayPrice, setTotalCartDisplayPrice ] = useState(0)

    const totalCartItemsPrice = () => {
        let totalPrice = 0

        cartData?.forEach(cartItem => {
            totalPrice += (cartItem?.quantity * calculateDiscountedPrice(cartItem?.product?.price, cartItem?.product?.discount))
        })

        return totalPrice
    }

    useEffect(() => {
        setTotalCartDisplayPrice(totalCartItemsPrice().toFixed(2))
    }, [ cartData ])

    const redirectToLoginPage = () => {
        navigate("/login")
    }

    const handleAccountMenuClick = () => {
        setOpenMenu(prev => !prev)
    }

    const closeAccountMenuList = () => {
        setOpenMenu(false)
    }

    const handleProfileIconClick = () => {
        if (!user?._id) {
            navigate("/login")
            return
        }
        
        navigate("/user-menu")
    }

    const handleShoppingCartButtonClick = () => {
        cartContext?.setOpenCart(true)
    }

    return (
        <header className="bg-amber-50 h-21 sm:h-16 pb-1 sm:pb-0 sm:shadow-lg sticky top-0 flex flex-col justify-center z-100">
            {
                !(isMobile && isSearchPage) && (
                    <div className="container h-10 sm:h-full mx-auto px-2 flex items-center justify-between sm:gap-2">
                        <div className="h-full flex items-center gap-2">
                            <Link to={ "/" } className="h-full flex justify-center items-center">
                                <img src={ logo } width={ 125 } height={ 100 } alt="logo" className="rounded-md hidden sm:block"/>
                                <img src={ logo } width={ 80 } height={ 50 } alt="logo" className="rounded-md sm:hidden"/>
                            </Link>
                            {
                                cartData?.length > 0 && (
                                    <div onClick={ handleShoppingCartButtonClick } className="px-2 py-0.5 my-1 flex items-center justify-center gap-1 sm:hidden rounded bg-green-800 hover:bg-green-700 active:bg-green-600 text-white cursor-pointer select-none" >
                                        <BsCart2 size={ 25 } className="animate-bounce translate-y-0.5" />
                                        <div className="min-w-15">
                                            <div className="flex items-center justify-center gap-1 text-[10px] tracking-wider font-light">
                                                <p className="font-medium">
                                                    { cartData?.length }
                                                </p> 
                                                { cartData?.length === 1 ? "item" : "items" }
                                            </div>
                                            <div className="flex items-center justify-center text-[10px] tracking-wider font-bold">
                                                <LiaRupeeSignSolid size={ 14 } className="-translate-y-[1px]" /> { totalCartDisplayPrice < 1000 ? totalCartDisplayPrice : (totalCartDisplayPrice < 1000000 ? Math.round(totalCartDisplayPrice) : `${ Math.round(totalCartDisplayPrice/1000) }k` ) }
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className="hidden sm:block">
                            <Search />
                        </div>
                        <div>
                            {
                                user?._id ? (
                                    <button onClick={ handleProfileIconClick } className="text-neutral-600 sm:hidden"><GiHamburgerMenu size={ 35 } /></button>
                                ) : (
                                    <button onClick={ handleProfileIconClick } className="text-neutral-600 pt-1 sm:hidden"><CgProfile size={ 30 } /></button>
                                )
                            }
                            <div className="hidden sm:flex items-center gap-1 lg:gap-6">
                                {
                                    user?._id ? (
                                        <div className="relative">
                                            <div onClick={ handleAccountMenuClick } className="flex select-none items-center gap-1 cursor-pointer">
                                                <p>Account</p>
                                                {
                                                    openMenu ? (
                                                        <GoTriangleUp size={ 25 } />
                                                    ) : (
                                                        <GoTriangleDown size={ 25 } />
                                                    )
                                                }
                                            </div>
                                            {
                                                openMenu && (
                                                    <div className="absolute right-0 top-8">
                                                        <div className="bg-slate-200 min-w-60 p-6 rounded-lg sm:shadow-lg border border-neutral-300">
                                                            <UserMenu close={ closeAccountMenuList } />
                                                        </div>
                                                    </div>
                                                )
                                            }
                                        </div>
                                    ) : (
                                        <button onClick={ redirectToLoginPage } className="text-lg px-2 cursor-pointer">Login</button>
                                    )
                                }
                                <div className="min-w-35 flex items-center justify-end">
                                    <button onClick={ handleShoppingCartButtonClick } className="flex items-center sm:gap-1 lg:gap-2 p-2 cursor-pointer bg-green-800 hover:bg-green-700 text-amber-50 rounded-md">
                                        <div className={ `${ cartData?.length > 0 ? "animate-bounce" : "flex items-center" }` } >
                                            <BsCart2 size={ 35 } className={ `${ cartData?.length > 0 ? "translate-y-0.5" : "-translate-y-0.5" }` } />
                                        </div>
                                        <div className="font-semibold sm:text-sm lg:text-base">
                                            <div>
                                                {
                                                    cartData?.length === 0 ? (
                                                        <div className="flex items-center justify-center">
                                                            My Cart
                                                        </div>
                                                    ) : (
                                                        <div className="sm:min-w-20">
                                                            <div className="flex items-center gap-1 justify-center text-xs tracking-wider font-light">
                                                                <p className="font-medium">
                                                                    { cartData?.length }
                                                                </p> 
                                                                { cartData?.length === 1 ? "item" : "items" }
                                                            </div>
                                                            <div className="flex items-center justify-center text-sm tracking-wider font-bold">
                                                                <LiaRupeeSignSolid size={ 16 } className="-translate-y-[1px]" /> { totalCartDisplayPrice < 1000 ? totalCartDisplayPrice : (totalCartDisplayPrice < 1000000 ? Math.round(totalCartDisplayPrice) : `${ Math.round(totalCartDisplayPrice/1000) }k` ) }
                                                            </div>
                                                        </div>
                                                    )
                                                }
                                            </div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="container sm:hidden mx-auto px-2">
                <Search />
            </div>
            {
                cartContext?.openCart && (
                    <div className="w-full h-screen absolute top-0 bottom-0 left-0 right-0" >
                        <CartComponent />
                    </div>
                )
            }
        </header>
    )
}

export default Header