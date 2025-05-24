const MenuItemWrapper = ({ children }) => {
    return (
        <div className="flex transition transform duration-200 text-neutral-700 lg:hover:scale-110 hover:shadow-[0_0_30px_rgba(0,0,0,0.3)] rounded-lg hover:bg-white/50">
            { children }
        </div>
    )
}

export default MenuItemWrapper