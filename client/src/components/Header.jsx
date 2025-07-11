import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"
import logo from "../assets/blynkit-logo.png"
import Search from "./Search"
import { GiHamburgerMenu } from "react-icons/gi";
import { BsCart2 } from "react-icons/bs";
import useMobile from "../hooks/useMobile";
import { useSelector } from "react-redux";
import { GoTriangleDown, GoTriangleUp } from "react-icons/go";
import { CgProfile } from "react-icons/cg";
import UserMenu from "./UserMenu.jsx";

const Header = () => {
    const [ isMobile ] = useMobile()
    const location = useLocation()
    const isSearchPage = location.pathname === "/search"
    const navigate = useNavigate()
    const user = useSelector((state) => state?.user)
    const [ openMenu, setOpenMenu ] = useState(false)

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

    return (
        <header className="bg-amber-50 h-21 sm:h-16 pb-1 sm:pb-0 sm:shadow-lg sticky top-0 flex flex-col justify-center z-100">
            {
                !(isMobile && isSearchPage) && (
                    <div className="container h-10 sm:h-full mx-auto px-2 flex items-center justify-between sm:gap-2">
                        <Link to={ "/" } className="h-full flex justify-center items-center">
                            <img src={ logo } width={ 125 } height={ 100 } alt="logo" className="rounded-md hidden sm:block"/>
                            <img src={ logo } width={ 80 } height={ 50 } alt="logo" className="rounded-md sm:hidden"/>
                        </Link>
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
                            <div className="hidden sm:flex items-center gap-2">
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
                                <button className="flex items-center sm:gap-1 lg:gap-2 p-2 cursor-pointer bg-green-800 hover:bg-green-700 text-amber-50 rounded-md">
                                    <div className="animate-bounce">
                                        <BsCart2 size={ 35 } />
                                    </div>
                                    <div className="font-semibold sm:text-sm lg:text-base">
                                        <p>My Cart</p>
                                    </div>
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
            <div className="container sm:hidden mx-auto px-2">
                <Search />
            </div>
        </header>
    )
}

export default Header