import Axios from "./Axios.jsx";
import SummaryApi from "../common/SummaryApi.jsx";

const fetchUserDetails = async () => {
    try {
        const response = await Axios({
            ...SummaryApi.user_details
        })

        return response.data
    } catch(error) {
        console.log(error)
    }
}

export default fetchUserDetails