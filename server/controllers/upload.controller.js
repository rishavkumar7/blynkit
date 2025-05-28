import uploadImageCloudinary from "../utils/uploadImageCloudinary.js"

export const uploadImageController = async (req, res) => {
    try {
        const file = req.file
        if (!file) {
            return res.status(400).json({
                message : error.message || error,
                success : false,
                error : true
            })
        }

        const uploadedImage = await uploadImageCloudinary(file)

        return res.status(200).json({
            message : "Image uploaded successfully !!",
            success : true,
            error : false,
            data : uploadedImage
        })
    } catch(error) {
        return res.status(500).json({
            message : error.message || error,
            success : false,
            error : true
        })
    }
}