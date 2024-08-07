import { Link } from "react-router-dom";
import { useState ,useEffect} from "react";
import Cookies from 'js-cookie';

function AdminHeader() { 

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(()=>{
    const handleScroll=()=>{
      if (window.scrollY > 200){
         setIsScrolled(true)
      }
      else{
        setIsScrolled(false)
      }

    }
    window.addEventListener("scroll",handleScroll)
    
  },[])

  const onClickAdminLogout = () => {
    Cookies.remove('jwt_Admin_Token');
    window.location.href = "/admin-login";
  };

  return (
    <div className={`bg-black/25 backdrop-blur-sm fixed w-full z-10 transition-all duration-1000 ${isScrolled ? "-top-14" :"top-0"}`}>
    <header className="flex flex-row w-full h-14 px-2 sm:px-6 lg:px-8 py-2">
      <Link to="/admin-site">
      <img  className="w-36   ml-3" src="https://fontmeme.com/permalink/240504/21eced2740090b43bd0001634ee2db4e.png" alt="brushers-hands-font" border="0"/>
      </Link>
      <div className=" flex items-center ml-auto  space-x-12 mr-16">
        <Link to="/add-movie" className="text-md  font-medium text-sky-400  hover:text-sky-300 ">Add Movie</Link>
        <Link to="/admin-register" className="text-md  font-medium text-sky-400  hover:text-sky-300 ">Create New Account</Link>
        <button className="bg-red-500 p-2 rounded-md text-white text-sm font-semibold" onClick={onClickAdminLogout}>Logout</button>
        

      </div>
      
     
    </header>
    
      </div>
  )
}

export default AdminHeader;

