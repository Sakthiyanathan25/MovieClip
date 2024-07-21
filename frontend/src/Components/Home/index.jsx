import { React, useEffect, useState } from 'react';
import Header from '../Header';
import Footer from '../Footer';
import { Link } from "react-router-dom";
import { LiaImdb } from "react-icons/lia";
import { IoCalendarOutline } from "react-icons/io5";
import { MdOutlineTimer } from "react-icons/md";
import { PiLineVertical } from "react-icons/pi";
import Cookies from 'js-cookie';
import SimpleSlider from '../Slider';
import { format } from 'date-fns';
import Popup from '../Popup';
function Home() {
  const [allMovies, setAllMovies] = useState([]);
  const [popularMovies, setPopularMovies] = useState([]);
  const [randomMovie, setRandomMovie] = useState({});
  const [ImdbMovie,setImdbMovie] = useState([])
  const [showPopUp,setShowPopup]=useState(false)

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    console.log(randomMovie);
  }, [randomMovie]);

  const fetchData = async () => {
    const url = "http://localhost:5001/";
    const jwtToken = Cookies.get('jwt_Token');
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };
    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok && data.allmovies) {
        const updatedMovies = data.allmovies.map(eachMovie => ({
          movieId: eachMovie.movie_id,
          imageUrl: eachMovie.image_url,
          language: eachMovie.language,
          name: eachMovie.name,
        }));

        const popularMovie = data.allmovies
    .filter(movie => movie.category == "Blockbuster")
    .map(movie => ({
        movieId: movie.movie_id,
        imageUrl: movie.image_url,
        name: movie.name
    }));

    const HighRatingMovies = data.allmovies
    .filter(movie => movie.imdb_rating>=8.0)
    .map(movie => ({
        movieId: movie.movie_id,
        imageUrl: movie.image_url,
        name: movie.name
    }));

    
        const randomIndex = Math.floor(Math.random() * data.allmovies.length);
        setRandomMovie(data.allmovies[randomIndex]);
        setAllMovies(updatedMovies);
        setPopularMovies(popularMovie);
        setImdbMovie(HighRatingMovies)
      } else {
        console.error('Failed to fetch data:', data.errMsg);
      }
    } catch (error) {
      console.error('Network error:', error);
    }
  };

  const timeCalculator=(value)=>{
     let hours=Math.floor(value / 60)
     let minutes=Math.floor(value % 60)
     return `${hours} h ${minutes} min `
  }
  const dateformat = (value) => {
    const inputDate = new Date(value);
    
    if (isNaN(inputDate)) {
      console.error('Invalid Date:', value);
      return 'Invalid Date';
    }

    // Format the date to 'dd/MM/yyyy'
    const formattedDate = format(inputDate, 'dd LLL yyyy');
    return formattedDate;
  }

  const tooglePopup=()=>{
    setShowPopup(!showPopUp)
    console.log("x")
  }
  return (
    <>
    <div className='bg-slate-900 relative '>
      {showPopUp && <Popup handleClickPopup={tooglePopup} videoUrl={randomMovie.video_url}/>}
      <div className='' style={{ 
  backgroundImage: `linear-gradient(180deg, rgba(4, 21, 45, 0) 0%, #0f172a 79.17%), url(${randomMovie.poster_url})`, 
  position:"relative",
  minHeight: '100vh', 
  minWidth: '100%',
  backgroundSize: 'cover',
  border: '2px solid #fff'
}}>
        <Header />
        <div className='absolute top-1/3 left-6  text-white'>
           <h1 className='text-8xl font-MontserBarlowCondensed font-medium'>{randomMovie.name?.toUpperCase()}</h1>
            <div className='flex flex-row ml-6'>
            <MdOutlineTimer className="text-amber-50 pr-1" size={40}/>
            <p className='pt-2 font-sans font-medium text-xl'>{timeCalculator(randomMovie.runtime)}</p>

            <PiLineVertical className='px-3' size={50}/>
            <LiaImdb className="text-yellow-500 pr-1 pb-1" size={50}/>
            <p className='pt-2 font-sans font-medium text-xl'>{randomMovie.imdb_rating}</p>
  
           <PiLineVertical className='px-3' size={50}/>
           <IoCalendarOutline size={40} className='pr-1'/>
           <p className='pt-2 font-sans font-medium text-xl'>{dateformat(randomMovie.release_date)}</p>
            </div>
            <div>
            <p className='font-lato font-medium text-lg w-4/5 h-22 pt-1 text-ellipsis overflow-hidden line-clamp-3'>{`${randomMovie.description}`}...</p>
            </div>
        </div>
        <div className=' absolute bottom-20 ml-16 flex flex-row gap-10'>
            <div className='relative group'>
              <div className='absolute -inset-0.5 bg-cyan-400 rounded-sm blur-lg  transition duration-300 opacity-50 group-hover:opacity-100'></div>
              <button onClick={tooglePopup} className='relative px-7 py-4 font-MontserBarlowCondensed tracking-wider bg-slate-900 rounded-lg shadow-inner shadow-cyan-500 text-white border-2 border-cyan-500 leading-none text-center'>
                WATCH TRAILER
              </button>
            </div>

            <Link to={`/movies/${randomMovie.movie_id}`} className='relative group'>
              <div className='absolute -inset-0.5 bg-cyan-400 rounded-sm blur-lg  transition duration-300 opacity-50 group-hover:opacity-100'></div>
              <button className='relative px-7 py-4 font-MontserBarlowCondensed tracking-wider bg-slate-900 rounded-lg shadow-inner shadow-cyan-500 text-white border-2 border-cyan-500 leading-none text-center'>
                MOVIE DETAILS 
              </button>
            </Link>
        </div>
       
      </div>
      <div className='p-5 pt-16 text-cyan-400 hover:text-cyan-300 text-2xl tracking-wider	font-sans font-medium'>
        <Link to="/allmovies">
          <h1 className='p-5 font-MontserBarlowCondensed  '>ALL MOVIES</h1>
        </Link>
        <SimpleSlider List={allMovies} />

        <Link to="/Latest Releases">
          <h1 className='p-5 font-MontserBarlowCondensed '>POPULAR MOVIES</h1>
        </Link>
        <SimpleSlider List={popularMovies} />
        
        
        <Link to="/popular">
          <h1 className='p-5 font-MontserBarlowCondensed '>Top Rated on IMDB</h1>
        </Link>
        <SimpleSlider List={ImdbMovie} />
        
      </div>
      
    </div>
    <Footer/>
    </>
  );
}

export default Home;
