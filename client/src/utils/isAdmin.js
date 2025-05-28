const isAdmin = (user) => {
    return user?.role === "ADMIN"
}

export default isAdmin