import SummaryApi from "../common/SummaryApi.jsx"
import Axios from "./Axios.jsx"

const fetchAddressDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi?.get_addresses
        })

        return response?.data
    } catch(error) {
        console.log(error)
    }
} 

export default fetchAddressDetails