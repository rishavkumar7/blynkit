import Axios from "./Axios.jsx"
import SummaryApi from "../common/SummaryApi.jsx"

const uploadImage = async (image, subfolderName) => {
    try {
        const formData = new FormData()
        formData.append("image", image)
        formData.append("subfolder", subfolderName)

        const response = await Axios({
            ...SummaryApi.upload_image,
            data : formData
        })

        return response
    } catch(error) {
        return error
    }
}

export default uploadImage