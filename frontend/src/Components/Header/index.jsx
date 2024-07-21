import { Link } from "react-router-dom";
import { useState ,useEffect} from "react";
import PopupHover from "../Popup1";

function Header() { 

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

  return (
    <div className={`bg-black/25 backdrop-blur-sm fixed min-w-full z-10 transition-all duration-1000 ${isScrolled ? "-top-14" :"top-0"}`}>
    <header className="flex flex-row w-full h-14 px-2 sm:px-6 lg:px-8 py-2">
      <Link to="/">
      <img  className="w-36   ml-3" src="https://fontmeme.com/permalink/240504/21eced2740090b43bd0001634ee2db4e.png" alt="brushers-hands-font" border="0"/>
      </Link>
      <div className=" flex items-center ml-auto  space-x-12 mr-16">
        <Link to="/" className="text-md  font-medium text-sky-400  hover:text-sky-300 ">Home</Link>
        <Link to="/popular" className="text-md  font-medium text-sky-400  hover:text-sky-300 ">Popular</Link>
        <Link to="/profile" className="text-md  font-medium text-sky-400  hover:text-sky-300 ">Profile</Link>
        <Link to="/search">
       
         <PopupHover content="Search" input={ <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-2  text-sky-400  hover:text-sky-300">
  <path strokeLinecap="round" strokeLinejoin="round" d="m15.75 15.75-2.489-2.489m0 0a3.375 3.375 0 1 0-4.773-4.773 3.375 3.375 0 0 0 4.774 4.774ZM21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
</svg>}/>
        </Link>
        
      <Link to="/profile"  >
        
        <PopupHover content="Profile" input={<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 stroke-2  text-sky-400  hover:text-sky-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.982 18.725A7.488 7.488 0 0 0 12 15.75a7.488 7.488 0 0 0-5.982 2.975m11.963 0a9 9 0 1 0-11.963 0m11.963 0A8.966 8.966 0 0 1 12 21a8.966 8.966 0 0 1-5.982-2.275M15 9.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
        </svg>} />
      </Link>

      </div>
      
     
    </header>
    
      </div>
  )
}

export default Header;

