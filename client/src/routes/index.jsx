import { createBrowserRouter } from "react-router-dom"
import App from "../App.jsx"
import Home from "../pages/Home.jsx"
import SearchPage from "../pages/SearchPage.jsx"
import Register from "../pages/Register.jsx"
import Login from "../pages/Login.jsx"
import ForgotPassword from "../pages/ForgotPassword.jsx"
import VerifyForgotPasswordOtp from "../pages/VerifyForgotPasswordOtp.jsx"
import ResetPassword from "../pages/ResetPassword.jsx"
import UserMenuMobile from "../pages/UserMenuMobile.jsx"
import Dashboard from "../layouts/Dashboard.jsx"
import Profile from "../pages/Profile.jsx"
import Orders from "../pages/Orders.jsx"
import Address from "../pages/Address.jsx"
import ProductsAdmin from "../pages/ProductsAdmin.jsx"
import ProductUpload from "../pages/ProductUpload.jsx"
import Category from "../pages/Category.jsx"
import Subcategory from "../pages/Subcategory.jsx"
import AdminPermission from "../components/AdminPermission.jsx"
import ProductListing from "../pages/ProductListing.jsx"
import ProductDetails from "../pages/ProductDetails.jsx"
import Checkout from "../pages/Checkout.jsx"

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: <Home />
            },
            {
                path: "search",
                element: <SearchPage />
            },
            {
                path: "register",
                element: <Register />
            },
            {
                path: "login",
                element: <Login />
            },
            {
                path: "forgot-password",
                element: <ForgotPassword />
            },
            {
                path: "verify-forgot-password-otp",
                element: <VerifyForgotPasswordOtp />
            },
            {
                path: "reset-password",
                element: <ResetPassword />
            },
            {
                path: "user-menu",
                element: <UserMenuMobile />
            },
            {
                path: "dashboard/",
                element: <Dashboard />,
                children: [
                    {
                        path: "profile",
                        element: <Profile />
                    },
                    {
                        path: "orders",
                        element: <Orders />
                    },
                    {
                        path: "address",
                        element: <Address />
                    },
                    {
                        path: "products",
                        element: <AdminPermission><ProductsAdmin /></AdminPermission>
                    },
                    {
                        path: "product-upload",
                        element: <AdminPermission><ProductUpload /></AdminPermission>
                    },
                    {
                        path: "category",
                        element: <AdminPermission><Category /></AdminPermission>
                    },
                    {
                        path: "subcategory",
                        element: <AdminPermission><Subcategory /></AdminPermission>
                    }
                ]
            },
            {
                path: ":category/",
                children : [
                    {
                        path : ":subcategory",
                        element: <ProductListing />
                    }
                ]
            },
            {
                path: "products/",
                children : [
                    {
                        path : ":product",
                        element : <ProductDetails />
                    }
                ]
            },
            {
                path: "checkout",
                element: <Checkout />
            }
        ]
    },
])

export default router