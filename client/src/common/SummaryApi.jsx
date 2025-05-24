export const baseURL = "http://localhost:9500"

const SummaryApi = {
    register : {
        url : "/api/user/register",
        method : "post"
    },
    login : {
        url : "/api/user/login",
        method : "post"
    },
    forgot_password : {
        url : "/api/user/forgot-password",
        method : "put"
    },
    verify_forgot_password_otp : {
        url : "/api/user/verify-forgot-password-otp",
        method : "put"
    },
    reset_password : {
        url : "api/user/reset-password",
        method : "put"
    },
    refresh_token : {
        url : "api/user/refresh-token",
        method : "post"
    },
    user_details : {
        url : "api/user/user-details",
        method : "get"
    },
    logout : {
        url : "api/user/logout",
        method : "get"
    },
    upload_avatar : {
        url : "api/user/upload-avatar",
        method : "put"
    },
    update_user : {
        url : "api/user/update-user",
        method : "put"
    }
}

export default SummaryApi