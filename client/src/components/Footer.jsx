import { FaFacebook, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="container border-t-1 px-10 py-4 mx-auto text-center flex flex-col gap-2 lg:flex-row lg:justify-between">
            © All Rights Reserved 2025.
            <div className="text-3xl flex justify-center gap-4">
                <a>
                    <FaFacebook className="hover:text-blue-700"/>
                </a>
                <a>
                    <FaInstagram className="hover:text-pink-500"/>
                </a>
                <a>
                    <FaLinkedin className="hover:text-blue-800"/>
                </a>
            </div>
        </footer>
    )
}

export default Footer