import  { Component } from 'react';
import Cookies from 'js-cookie';
import Header from '../Header';
import Footer from '../Footer';
import CircilarRating from './circular';
import Runtime from './runtime';
import ReleaseDate from './ReleaseDate';
import Shadow from './shadow';
import LikeButton from './OnLike';
import { IoCheckboxOutline } from "react-icons/io5";
import { PiPlusSquare } from "react-icons/pi";
import { toast, ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import Popup from '../Popup';
class EachMovies extends Component{

    state = {
        movieDetails:[],
        diretorDetails:[],
        writerDetails:[],
        musicDirector:[],
        relatedVideo:[],
        ottPlatform:[],
        stars:[],
        genre:[],
        Dublanguage:[],
        orginalLanguage:[],
        like:false,
        isWatchList:false,
        showPopUp:false,
        VideoUrlPopUp:"",
      }
    componentDidMount(){
        this.fetchData()
    }
   
    fetchData = async () => {
        const {id}=this.props.match.params
        const apiUrl = import.meta.env.VITE_API_URL; 
        try {
          const url = `${apiUrl}user/movies/${id}`;
          const jwtToken = Cookies.get('jwt_Token');
          const options = {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            }
          };
    
          const response = await fetch(url, options);
          const data = await response.json();
          
          console.log(data)

    
          if (response.ok) {

            const movieresult=data.movieResult.map(eachMovie=>({
                movieId:eachMovie.movie_id,
                imageUrl:eachMovie.image_url,
                videoUrl:eachMovie.video_url,
                runtime:eachMovie.runtime,
                posterUrl:eachMovie.poster_url,
                isWatchList:eachMovie.in_watchlist!==0,
                releaseDate:eachMovie.release_date,
                isLiked:eachMovie.liked!==0,
                totalLikes:eachMovie.total_likes,
                imdbRating:eachMovie.imdb_rating,
                description:eachMovie.description,
                name:eachMovie.name,
              }))
          
              const GenreType = data.genre.map(each=>each.type)
              const dubbedLanguages= data.language
              .filter(each => each.category !== "Original")
              .map(each => each.language);
              
              const OrginalLanguage=data.language.filter(each=>each.category === "Original").map(each=>each.language)
              console.log(OrginalLanguage)
                          
            this.setState({ movieDetails: movieresult[0],
              like:movieresult[0].isLiked,
              isWatchList:movieresult[0].isWatchList,
              genre:GenreType,
              Dublanguage:dubbedLanguages,
              orginalLanguage:OrginalLanguage,
              diretorDetails:data.director,
              musicDirector:data.musicdirector,
              stars:data.stars,
              ottPlatform:data.ott,
              relatedVideo:data.relatedVideos,
              writerDetails:data.writer,
              VideoUrlPopUp:movieresult[0].video_url
              
          });
            console.log(movieresult[0]) 
            console.log(this.state.relatedVideo)
          } else {lan
            console.log(data.errMsg);
          }
        } catch (error) {
          console.error('Error fetching movie details:', error);
        }
      }
       

      isLikedMovie = async () => {
        const {movieId}=this.state.movieDetails
        try {
          const jwtToken = Cookies.get("jwt_Token");
          const apiUrl = import.meta.env.VITE_API_URL; 
          const url = `${apiUrl}user/movies/${movieId}/likes`;
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          };

         
    
          const response = await fetch(url, options);
          const data = await response.json();
    
          if (response.ok) {
            
            this.setState({like:data.liked})
            this.fetchData()

                    } else {
            console.log(data.errMsg);
          }
        } catch (error) {
          console.error("Error checking if movie is liked:", error);
        }
      };

       onWatchList=async()=>{
        const {movieId}=this.state.movieDetails
        try {
          const jwtToken = Cookies.get("jwt_Token");
          const apiUrl = import.meta.env.VITE_API_URL; 
          const url = `${apiUrl}user/movies/${movieId}/watchlist`;
          const options = {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${jwtToken}`,
            },
          };

          const response = await fetch(url, options);
          const data = await response.json();
    
          if (response.ok) {
            
            this.setState({watchlist:data.watchList})
           
            const toastMessage = data.watchList ? "Added to WatchList" : "Removed from WatchList";
            toast.info(toastMessage, { position: "top-left",
            autoClose: 1000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "dark",
            });
            this.fetchData()

                    } else {
            console.log(data.errMsg);
          }
        } catch (error) {
          console.error("Error checking if movie is watchlist:", error);
        }
      }

      tooglePopup = (value) => {
        this.setState(prevState => ({
          VideoUrlPopUp: value,
          showPopUp: !prevState.showPopUp
        }));
      }
    
    render(){



        const {videoUrl,name,movieId,imdbRating,description,imageUrl,runtime,releaseDate,totalLikes,posterUrl} = this.state.movieDetails

         
       
        return(
          <>
            <div className='relative bg-slate-900  ' style={{minHeight:'250vh'}}>
                <div className='' style={{ 
   backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.90), rgba(15, 23, 42, 1)), url(${posterUrl})`, 
  position:"absolute",
  height: '100vh', 
  minWidth: '100%',
  backgroundSize: 'cover',
  opacity:'50px',
}}>
  <Header/>
  <div className='absolute flex flex-col divide-y-2 '>
  <div className='mt-28 mx-10 flex flex-row mb-5'>
  <div className='flex flex-col' style={{width:'360px'}}>
    <div>
    <Shadow input={<img
    src={imageUrl}
    alt={name}
    style={{ height: '500px', width: '350px' }}
    className=' relative rounded-xl bg-cover'
  />}/>
  <div className='relative z-30 -mt-20 flex justify-end -mr-2'>
    
  <CircilarRating  rating={imdbRating} />
  </div>
  <div className=' mx-20 flex justify-start items-center'>
    <LikeButton isLike={this.state.like} isLikedMovie={this.isLikedMovie}/>
    <p className='text-2xl font-sans text-white/90 italic '>{`${totalLikes} likes`}</p>
    <button type="button" className='ml-3 transition  duration-700' onClick={this.onWatchList}>
    {this.state.isWatchList ? <IoCheckboxOutline size={50} className=' text-sky-400'/>:<PiPlusSquare size={50} className=' text-sky-400'/>}
    </button>

  </div>
   
   
   <div className='relative group mx-20 py-2'>
              <div className='absolute -inset-0.5 w-10/12  bg-cyan-400 rounded-sm blur-lg  transition duration-300 opacity-50 group-hover:opacity-100'></div>
              <button onClick={()=>this.tooglePopup(videoUrl)} className='relative px-7 py-4 font-MontserBarlowCondensed tracking-wider bg-slate-900 rounded-lg shadow-inner shadow-cyan-500 text-white border-2 border-cyan-500 leading-none text-center'>
                WATCH TRAILER
              </button>
            </div>

    </div>
    
</div>
{this.state.showPopUp && <Popup handleClickPopup={this.tooglePopup} videoUrl={this.state.VideoUrlPopUp}/>}
    <ToastContainer/>

    <div className='ml-24 w-2/3 divide-y-2'>
      <div className='flex'>
      <h1 className="text-7xl font-MontserBarlowCondensed font-medium mb-2 text-white truncate ...">{name}</h1>
      <ul className='my-5 ml-5 flex-wrap flex w-3/12 justify-center '>
        {this.state.genre.map((each)=><li className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400'>{each}</li>)}
      </ul>
      </div>
      <div className='flex flex-row divide-x-4 gap-10 py-4 mb-4'>
      <div className='-mr-5  pb-4'>
        <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block'>Runtime</h1>
       <Runtime  runtime={runtime}/>
      </div>
      <div className='pl-5 pb-4'>
      <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block'>Release Date</h1>
      <ReleaseDate input={releaseDate}/>
      </div> 
      </div>
      <div>
      <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block' >Storyline</h1>
        <p className='text-white stroke-2 stroke-gray-400 text-xl font-sans pb-3'>{description}</p>
      </div>
      <div>
        <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block'>Languages</h1>
        <ul className='my-3 ml-5 flex-wrap flex justify-center '>
          <li className='text-sm h-5 font-sans italic text-white font-semibold  px-2 mb-2 mr-2 bg-green-500' >Original</li>
          <li className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400'>{this.state.orginalLanguage}</li>
          <li className='text-sm h-5 font-sans italic text-white font-semibold  px-2 mb-2 mr-2 bg-red-700' >Dubbed</li>

        {this.state.Dublanguage.map((each)=><li className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400' key={each}>{each}</li>)}
      </ul>
      </div>
    </div>
  </div>
  <div className='mx-10 flex mb-3 justify-evenly flex-wrap items-center'>
  <div>
  <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block '>DIRECTOR</h1>
    <ul className='flex justify-center gap-3'>
     
      {this.state.diretorDetails.map(each=>
        <li key={each.director_id} className=''>
           <img src={each.director_img_url} className='relative h-36 w-36' alt={each.director_name}/>
           <p className='font-sans text-white text-center'>{each.director_name}</p>
        </li>
      )}

    </ul>
  </div>
  <div>
  <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block '>MUSIC-DIRECTOR</h1>
    <ul className='flex justify-center gap-3'>
     
      {this.state.musicDirector.map(each=>
        <li  className=''>
           <img src={each.music_dir_img_url} className='relative h-36 w-36' alt={each.music_dir_name}/>
           <p className='font-sans text-white text-center'>{each.music_dir_name}</p>
        </li>
      )}

    </ul>
  </div>
  <div className=''>
  <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block '>STARS</h1>
    <ul className='flex justify-center gap-3'>
     
      {this.state.stars.map(each=>
        <li  className=''>
           <img src={each.star_img_url} className='relative h-36 w-36' alt={each.star_name}/>
           <p className='font-sans text-white text-center'>{each.star_name}</p>
        </li>
      )}

    </ul>
  </div>
  </div>
  <div className='mx-10  gap-2 flex py-6'>
       <h1 className='text-xl text-white px-3 font-time bg-lime-400 inline-block '>Writers</h1>
       <p className='text-xl text-white  px-3 font-time  '>
        {this.state.writerDetails.map(each=>each.writter_name).join(" , ")}
       </p>
  </div>
  <div className='mx-10 py-6'>
    <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block '>RELATED VIDEOS</h1>
    <ul className=' mx-auto flex gap-5  overflow-x-auto' style={
      {
        width:'90%',
        maxWidth:'1200px',
        scrollbarWidth:'none'
      }
    }>
    {this.state.relatedVideo.map(each => (
  <li key={each.video_url} onClick={() => this.tooglePopup(each.video_url)}>
    <img src={each.video_url_img} className='h-36 w-56 rounded-lg' alt="name" />
    <p className=' text-white w-52'>{each.video_name}</p>

  </li>
))}




    </ul>
  </div>
  <div className='mx-10'>
    <h1 className='text-xl text-white my-5 px-3 font-time bg-lime-400 inline-block '>OTT PLATFORM</h1>
     <ul className='flex justify-start px-5 gap-3  '>
      {
        this.state.ottPlatform.map(each=>(
          <li >
            <a href={each.ott_url}>
               <img src={each.ott_img_url} className='h-20 w-20' alt="OTT"/>
            </a>
          </li>
        ))
      }

     </ul>
  </div>
  <div className='mt-32'>
    <Footer/>
  </div>
  </div>
 
  </div>
  
</div>   
</>     
           
        )
    }
}


export default (EachMovies);
