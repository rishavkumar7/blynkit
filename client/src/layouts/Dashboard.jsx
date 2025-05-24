import { Outlet } from "react-router-dom"
import UserMenu from "../components/UserMenu.jsx"

const Dashboard = () => {
    return (
        <section>
            <div className="container mx-auto lg:pl-10 grid lg:grid-cols-5 gap-0">
                <div className="bg-amber-50 sticky max-h-[calc(100vh-167px)] top-21 py-4 px-8 my-5 lg:col-span-1 hidden lg:block">
                    <UserMenu />
                </div>
                <div className="bg-amber-50 ml-0 px-10 lg:px-20 py-10 lg:col-span-4 lg:border-l border-neutral-400">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}

export default Dashboard