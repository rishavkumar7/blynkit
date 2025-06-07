import SummaryApi from "../common/SummaryApi"
import Axios from "./Axios.jsx"

const fetchCategoryDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.get_all_categories
        })

        return response.data
    } catch(error) {
        console.log(error)
    }
}

export default fetchCategoryDetails