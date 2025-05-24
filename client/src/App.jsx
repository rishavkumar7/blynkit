import { useEffect } from 'react';
import { Outlet } from 'react-router-dom'
import { useDispatch } from 'react-redux';
import toast, { Toaster } from 'react-hot-toast';
import './App.css'
import Header from "./components/Header.jsx"
import Footer from "./components/Footer.jsx"
import fetchUserDetails from './utils/fetchUserDetails.js';
import { setUserDetails } from './store/userSlice.js';

function App() {
  const dispatch = useDispatch()

  const fetchUser = async () => {
    const userData = await fetchUserDetails()
    dispatch(setUserDetails(userData.data))
  }

  useEffect(() => {
    fetchUser()
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
