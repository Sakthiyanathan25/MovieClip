import Header from "../Header"
import Cookies from "js-cookie"
import { useEffect } from "react";
import { useState} from "react";
import {Link} from "react-router-dom"
import Footer from "../Footer";
import { FaSearch } from "react-icons/fa";
import "./index.css"

const Search=()=>{

    const [searchValue, setSearchValue] = useState('');
   

      const [SearchMovies,setSearchMovies]=useState([])

      const onSearchBar=(e)=>{
        setSearchValue(e.target.value)
      }

      const onKeyDownSearchBar=(e)=>{
        if (e.key === "Enter") {
          getSearch();
        }
      }
      
      
      useEffect(()=>{
        
 getSearch()
      },
      // eslint-disable-next-line
      [searchValue])
      
      const getSearch=async()=>{
        const url=`http://localhost:5001/user/search?search_q=${searchValue}`
        const jwtToken = Cookies.get('jwt_Token')
        const option={ method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${jwtToken}`,
        }}
    
    
        const response= await fetch(url,option)
        const data=await response.json()
        console.log(data)
        if (response.ok){
          console.log(data.searchResult)
          const updatedMovies=data.searchResult.map(eachMovie=>({
            movieId:eachMovie.movie_id,
            imageUrl:eachMovie.image_url,
            name:eachMovie.name,
          }))
    
         setSearchMovies(updatedMovies)
         console.log(updatedMovies)
        
        }else{
          console.log(data.errMsg)
        }
      }
    return(
      <>
      <div className="bg-slate-900 relative py-20 " style={{minHeight:'100vh'}}>
      <Header/>
      <h1 className="text-center font-time text-white text-xl">Search your Favourites</h1>
      <div className=" relative h-12 w-1/2 mx-auto my-5 px-3 bg-white flex gap-1 rounded-xl ring-2 ring-sky-400">
      
        <input type="text" onChange={onSearchBar} onKeyDown={onKeyDownSearchBar}className="h-full w-full text-2xl font-time placeholder-zinc-400 pl-2 outline-none" placeholder="Search" autoFocus />
        <FaSearch size={40} className="text-black my-auto"/>
      </div>
      <div>
  <ul className="flex  flex-wrap  gap-5 mx-5 ">
    {SearchMovies.length >0 ? SearchMovies.map(eachMovie => (
      <li className="" key={eachMovie.movieId}>
        {' '}
        <Link to={`movies/${eachMovie.movieId}`} key={eachMovie.movieId}>
          <div className="animate-slidein300 opacity-0">
            <img
              className="images"
              src={eachMovie.imageUrl}
              alt={eachMovie.name}
            />
          </div>
        </Link>
      </li>
    )):
    <li className=" w-full">
      <h1 className="text-white font-time  text-center text-7xl pt-20 ">Sorry</h1>
      <p className="text-white font-time pt-10 text-5xl text-center">No Result's Found</p>
      </li>}
  </ul>
</div>
  </div>
  <Footer/>
  </>
    )
}

export default Search