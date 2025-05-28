import {v2 as cloudinary} from "cloudinary"

cloudinary.config({
    cloud_name : process.env.CLOUDINARY_CLOUD_NAME,
    api_key : process.env.CLOUDINARY_API_KEY,
    api_secret : process.env.CLOUDINARY_API_SECRET_KEY
})

const uploadImageCloudinary = async (image, subfolder) => {
    try{
        const buffer = image?.buffer || Buffer.from(await image.arrayBuffer())
        const folderPath = `blynkit${ subfolder ? "/" + subfolder : "" }`

        const uploadImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder : folderPath }, (error, uploadResult) => {
                return resolve(uploadResult)
            }).end(buffer)
        })

        return uploadImage
    } catch(error) {
        console.log(error)
    }
}

export default uploadImageCloudinary