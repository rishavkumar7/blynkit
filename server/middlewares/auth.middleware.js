import jwt from "jsonwebtoken"

const auth = async (req, res, next) => {
    try {
        const token = req.cookies["access-token"] || req.headers?.authorization?.split(" ")[1]
        if (!token) {
            return res.status(401).json({
                message : "Please provide the token",
                success : false,
                error : true
            })
        }
        
        const decode = await jwt.verify(token, process.env.SECRET_KEY_ACCESS_TOKEN)
        if (!decode) {
            return res.status(401).json({
                message : "Unauthorized access",
                success : false,
                error : true
            })
        }

        req.userId = decode.id

        next()
    } catch(error) {
        if (error.name === "TokenExpiredError") {
            return res.status(401).json({
                message : "Token has expired",
                success : false,
                error : true
            })
        }

        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}

export default auth