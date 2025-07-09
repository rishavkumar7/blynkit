import { useLocation, useParams } from "react-router-dom"

const ProductDetails = () => {
    const location = useLocation()
    const { product } = location?.state || {}

    return (
        <div>
            Product Details
        </div>
    )
}

export default ProductDetails