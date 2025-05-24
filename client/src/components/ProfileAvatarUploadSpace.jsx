import { useState } from "react"
import { FaCircleUser } from "react-icons/fa6"
import { useSelector, useDispatch } from "react-redux"
import { IoClose } from "react-icons/io5";
import SummaryApi from "../common/SummaryApi.jsx"
import AxiosToastError from "../utils/AxiosToastError.jsx"
import { updateAvatar } from "../store/userSlice.js"
import Axios from "../utils/Axios.jsx"

const ProfileAvatarUploadSpace = ({ close }) => {
    const user = useSelector(state => state?.user)
    const dispatch = useDispatch()
    const [ uploading, setUploading ] = useState(false)

    const handleProfileAvatarUploadClick = (e) => {
        e.preventDefault()
    }

    const handleProfileAvatarUploadChange = async (e) => {
        const file = e.target.files[0]
        if (!file) {
            return
        }

        const formData = new FormData()
        formData.append("avatar", file)

        try {
            setUploading(true)

            const response = await Axios({
                ...SummaryApi.upload_avatar,
                data : formData
            })
            
            const { data : responseData } = response
            dispatch(updateAvatar(responseData?.data?.avatar))
        } catch(error) {
            AxiosToastError(error)
        } finally {
            setUploading(false)
        }
    }

    const handleProfileAvatarSpaceCloseClick = () => {
        close()
    }

    return (
        <div>
            <section className="fixed top-0 bottom-0 left-0 right-0 p-4 bg-[rgba(0,0,0,0.7)] flex items-center justify-center">
                <div className="max-w-sm w-full rounded bg-slate-200 p-4 flex flex-col items-center justify-center gap-2">
                    <button onClick={ handleProfileAvatarSpaceCloseClick } className="text-neutral-500 block ml-auto cursor-pointer"><IoClose size={ 25 } /></button>
                    <div className="w-35 h-35 rounded-full overflow-hidden flex items-center justify-center border-6">
                        {
                            user?.avatar ? (
                                <img src={ user.avatar } alt={ user.name } className="w-full h-full" />
                            ) : (
                                <FaCircleUser className="text-9xl" />
                            )
                        }
                    </div>
                    <form onSubmit={ handleProfileAvatarUploadClick }>
                        <label htmlFor="profileAvatarUpload">
                            <div className="px-2 py-1 rounded cursor-pointer text-black bg-blue-500 hover:bg-blue-400 action:bg-blue-300 font-semibold">
                                { uploading ? "Uploading ..." : "Upload" }
                            </div>
                        </label>
                        <input onChange={ handleProfileAvatarUploadChange } type="file" accept="image/*" id="profileAvatarUpload" className="hidden"/>
                    </form>
                </div>
            </section>
        </div>
    )
}

export default ProfileAvatarUploadSpace