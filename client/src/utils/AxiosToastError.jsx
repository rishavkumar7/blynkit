import toast from "react-hot-toast";

const AxiosToastError = (error) => {
    toast.error(`${ error?.response?.status >= 500 ? "Server : " : "" }${ error?.response?.data?.message }`)
}

export default AxiosToastError