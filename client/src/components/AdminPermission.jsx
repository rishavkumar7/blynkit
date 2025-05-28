import { useSelector } from "react-redux"
import isAdmin from "../utils/isAdmin.js"

const AdminPermission = ({ children }) => {
    const user = useSelector(state => state.user)

    return (
        <div>
            { isAdmin(user) ? children : <p className="p-4 text-center text-red-800 bg-red-200">User does not have permission</p> }
        </div>
    )
}

export default AdminPermission