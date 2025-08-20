import AddressModel from "../models/address.model.js"
import UserModel from "../models/user.model.js"

export const addAddressController = async (req, res) => {
    try {
        const user_id = req?.userId
        const { address_line, city, state, country, pincode, contact, status } = req?.body

        if (!user_id || !address_line || !city || !state || !country || !pincode || !contact || !status) {
            return res.status(400).json({
                message : "Please provide the user_id and address details",
                success : false,
                error : true
            })
        }

        const addressCount = await AddressModel.countDocuments({
            user_id,
            address_line,
            city,
            state,
            country,
            pincode
        })
        if (addressCount !== 0) {
            return res.status(400).json({
                message : "This address was already added.",
                success : false,
                error : true
            })
        }
        
        const addedAddress = await AddressModel.create({
            user_id,
            address_line,
            city,
            state,
            country,
            pincode,
            contact,
            status
        })

        const updateUserAddress = await UserModel.findByIdAndUpdate(user_id, {
            $push : { address_details : addedAddress?._id }
        })

        return res.status(200).json({
            message : "Address added successfully !!",
            success : true,
            error : false,
            data : addedAddress
        })
    } catch(error) {
        return res.status(500).json({
            message : error?.message || error,
            success : false,
            error : true
        })
    }
}

export const getAddressController = async (req, res) => {
    try {
        const user_id = req?.userId
        if (!user_id) {
            return res.status(400).json({
                message : "Please provide the user_id",
                success : false,
                error : true
            })
        }

        const { address_details : addresses } = await UserModel.findById(user_id).select("address_details").populate({
            path : "address_details",
            select : "-user_id"
        })
        return res.status(200).json({
            message : "Addresses fetched successfully !!",
            success : true,
            error : false,
            data : addresses
        })
    } catch(error) {
        return res.status(500).json({
            message : error?.message || error,
            success : false,
            error : true 
        })
    }
}

export const updateAddressController = async (req, res) => {
    try {
        const user_id = req?.userId
        const { _id, address_line, city, state, country, pincode, contact, status } = req?.body

        const updatedAddress = await AddressModel.updateOne({ _id : _id }, {
            address_line,
            city,
            state,
            country,
            pincode,
            contact,
            status
        })
        
        return res.status(200).json({
            message : "Address updated successfully !!",
            success : true,
            error : false,
            data : updatedAddress
        })
    } catch(error) {
        return res.status(500).json({
            message : error?.message || error,
            success : false,
            error : true
        })
    }
}

export const deleteAddressController = async (req, res) => {
    try {
        const user_id = req?.userId
        const { _id } = req?.body
        
        const deleteAddress = await AddressModel.deleteOne({ _id : _id })

        const updateUserAddressDetails = await UserModel.updateOne({ _id : user_id }, {
            $pull : { address_details : _id }
        })

        return res.status(200).json({
            message : "Address deleted successfully !!",
            success : true,
            error : false,
            data : deleteAddress
        })
    } catch(error) {
        return res.status(500).json({
            message : error?.message || error,
            success : false,
            error : true
        })
    }
}