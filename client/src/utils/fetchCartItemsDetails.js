import SummaryApi from "../common/SummaryApi.jsx"
import Axios from "./Axios.jsx"

const fetchCartItemsDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.get_items_from_cart
        })

        return response.data
    } catch(error) {
        console.log(error)
    }
}

export default fetchCartItemsDetails