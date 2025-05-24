import { Link, useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import toast from "react-hot-toast"
import Divider from "./Divider"
import SummaryApi from "../common/SummaryApi.jsx"
import Axios from "../utils/Axios.jsx"
import { logout } from "../store/userSlice.js"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import MenuItemWrapper from "./MenuItemWrapper.jsx"

const UserMenu = ({ close }) => {
    const user = useSelector((state) => state.user)
    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleClose = () => {
        if (close) {
            close()
        }
    }

    const handleLogout = async () => {
        try {
            const response = await Axios({
                ...SummaryApi.logout
            })

            if (response?.data?.success) {
                if (close) {
                    close()
                }
                dispatch(logout())
                localStorage.clear()
                toast.success(response.data?.message)
                navigate("/")
            }
        } catch(error) {
            AxiosToastError(error)
        }
    }

    return (
        <div>
            <MenuItemWrapper>
                <Link to={ "/dashboard/profile" } onClick={ handleClose } className="font-bold text-lg cursor-pointer w-full h-full p-2 pl-4">
                    { user?.name || user?.mobile }
                </Link>
            </MenuItemWrapper>
            <Divider />
            <div className="flex flex-col gap-2">
                <MenuItemWrapper><Link to={ "/dashboard/products" } onClick={ handleClose } className="w-full h-full p-2 pl-4">Products</Link></MenuItemWrapper>
                <MenuItemWrapper><Link to={ "/dashboard/product-upload" } onClick={ handleClose } className="w-full h-full p-2 pl-4">Product Upload</Link></MenuItemWrapper>
                <MenuItemWrapper><Link to={ "/dashboard/category" } onClick={ handleClose } className="w-full h-full p-2 pl-4">Category</Link></MenuItemWrapper>
                <MenuItemWrapper><Link to={ "/dashboard/subcategory" } onClick={ handleClose } className="w-full h-full p-2 pl-4">Sub Category</Link></MenuItemWrapper>
                <MenuItemWrapper><Link to={ "/dashboard/orders" } onClick={ handleClose } className="w-full h-full p-2 pl-4">My Orders</Link></MenuItemWrapper>
                <MenuItemWrapper><Link to={ "/dashboard/address" } onClick={ handleClose } className="w-full h-full p-2 pl-4">My Address</Link></MenuItemWrapper>
                <MenuItemWrapper><button onClick={ handleLogout } className="text-left cursor-pointer w-full h-full p-2 pl-4">Log Out</button></MenuItemWrapper>
            </div>
        </div>
    )
}

export default UserMenu