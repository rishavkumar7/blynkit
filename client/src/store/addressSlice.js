import { createSlice } from "@reduxjs/toolkit"

const initialValue = {
    addresses : []
}

const addressSlice = createSlice({
    name : "address",
    initialState : initialValue,
    reducers : {
        setAddressDetails : (state, action) => {
            state.addresses = [ ...action?.payload ]
        }
    }
})

export const { setAddressDetails } = addressSlice.actions
export default addressSlice.reducer