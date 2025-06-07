import SummaryApi from "../common/SummaryApi.jsx"
import Axios from "./Axios.jsx"

const fetchSubcategoryDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.get_all_subcategories
        })

        return response.data
    } catch(error) {
        console.log(error)
    }
}

export default fetchSubcategoryDetails