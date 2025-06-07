import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import fetchUserDetails from './utils/fetchUserDetails.js';
import fetchCategoryDetails from "./utils/fetchCategoryDetails.js"
import fetchSubcategoryDetails from './utils/fetchSubcategoryDetails.js';
import { setUserDetails } from './store/userSlice.js';
import { setCategoryDetails, setSubcategoryDetails } from './store/productSlice.js';

function App() {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  const fetchCategory = async () => {
    const categoryData = await fetchCategoryDetails()
    dispatch(setCategoryDetails(categoryData.data))
  }

  const fetchSubcategory = async () => {
    const subcategoryData = await fetchSubcategoryDetails()
    dispatch(setSubcategoryDetails(subcategoryData.data))
  }

  useEffect(() => {
    fetchUser()
    fetchCategory()
    fetchSubcategory()
  }, [])

  return (
    <>
      <Header />
      <main className="min-h-[81vh]">
        <Outlet />
      </main>
      <Footer />
      <Toaster />
    </>
  )
}

export default App
