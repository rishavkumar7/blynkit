const calculateDiscountedPrice = (price, discount) => {
    return discount > 0 ? price - (price * (discount / 100)) : price
}

export default calculateDiscountedPrice