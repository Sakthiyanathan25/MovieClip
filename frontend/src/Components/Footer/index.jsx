import { FaGoogle } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { FaLinkedinIn } from "react-icons/fa";
import { FaInstagram } from "react-icons/fa";


export default function Footer(){
   
    return(
        <div className="flex flex-col gap-7  py-10 bg-slate-950">
            <ul className="flex gap-6 justify-center ">
                <li className="text-lg font-sans text-white hover:text-orange-500 duration-300">Terms Of Use</li>
                <li className="text-lg font-sans text-white hover:text-orange-500 duration-300">Privacy-Policy</li>
                <li className="text-lg font-sans text-white hover:text-orange-500 duration-300">About</li>
                <li className="text-lg font-sans text-white hover:text-orange-500 duration-300">Blog</li>
                <li className="text-lg font-sans text-white hover:text-orange-500 duration-300">FAQ</li>  
            </ul>
            <p className="text-white text-center">
            © 2024 MoveClip. All rights reserved.
            </p>
            <ul className="flex gap-6 justify-center ">
                <FaGoogle size={20} className=" text-white hover:text-orange-500 duration-300"/>
                <FaXTwitter size={20}  className=" text-white hover:text-orange-500 duration-300"/>
                <FaInstagram size={20} className=" text-white hover:text-orange-500 duration-300"/>
                <FaLinkedinIn size={20} className=" text-white hover:text-orange-500 duration-300"/>    
            </ul>

        </div>
    )

}