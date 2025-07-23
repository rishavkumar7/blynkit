import { useContext, useEffect } from 'react'
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { Toaster } from 'react-hot-toast'
import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import fetchUserDetails from './utils/fetchUserDetails.js'
import fetchCategoryDetails from "./utils/fetchCategoryDetails.js"
import fetchSubcategoryDetails from './utils/fetchSubcategoryDetails.js'
import fetchCartItemsDetails from './utils/fetchCartItemsDetails.js'
import { setUserDetails } from './store/userSlice.js'
import { setCategoryDetails, setSubcategoryDetails } from './store/productSlice.js'
import { setCartItemsDetails } from './store/cartSlice.js'
import { CartProvider } from "./utils/GlobalCartProvider.jsx"

function App() {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData?.data))
  }

  const fetchCategory = async () => {
    const categoryData = await fetchCategoryDetails()
    dispatch(setCategoryDetails(categoryData?.data))
  }

  const fetchSubcategory = async () => {
    const subcategoryData = await fetchSubcategoryDetails()
    dispatch(setSubcategoryDetails(subcategoryData?.data))
  }

  const fetchUserShoppingCartItems = async () => {
    const cartData = await fetchCartItemsDetails()
    dispatch(setCartItemsDetails(cartData?.data?.shopping_cart))
  }

  useEffect(() => {
    fetchUser()
    fetchUserShoppingCartItems()
    fetchCategory()
    fetchSubcategory()
  }, [])

  return (
    <>
      <CartProvider>
        <Header />
      </CartProvider>
      <CartProvider>
        <main className="min-h-[81vh]">
          <Outlet />
        </main>
      </CartProvider>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
