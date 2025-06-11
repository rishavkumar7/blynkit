import Swal from "sweetalert2"

export const successAlert = (message) => {
    Swal.fire({
        title: "Done",
        text: message,
        icon: "success"
    });
}