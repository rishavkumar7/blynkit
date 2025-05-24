import { useNavigate } from "react-router-dom";
import { MdOutlineClose } from "react-icons/md";
import UserMenu from "../components/UserMenu.jsx"

const UserMenuMobile = () => {
    const navigate = useNavigate()

    const handleCloseButtonClick = () => {
        navigate("/")
    }

    return (
        <section className="bg-amber-50 fixed inset-0">
            <div className="flex justify-end">
                <button onClick={ handleCloseButtonClick } className="text-neutral-700 mt-4 mr-4"><MdOutlineClose size={ 30 } /></button>
            </div>
            <div className="container mx-auto p-4">
                <UserMenu />
            </div>
        </section>
    )
}

export default UserMenuMobile