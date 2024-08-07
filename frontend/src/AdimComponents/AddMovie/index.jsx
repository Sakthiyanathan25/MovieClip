import { useState,useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { IoCloseCircleOutline } from "react-icons/io5";
import Preview from "../Preview";
import Cookies from 'js-cookie';


import axios  from "axios"



const AddMovie = () => {
  const  [AllMovies,setAllMovies]=useState(null)
  const  [movieUpdateLoading,setmovieUpdateLoading]=useState(false)
  // Movie details
  const [movieImage, setMovieImage] = useState("");
  const [movieImageUrl,setmovieImageUrl]=useState("");
  const [movieTrailer, setMovieTrailer] = useState("");
  const [movieTrailerUrl,setmovieTrailerUrl]=useState("");
  const [movieName, setMovieName] = useState("");
  const [releaseDate, setReleaseDate] = useState("");
  const [runtime, setRuntime] = useState(0);
  const [imdbRating, setImdbRating] = useState(0.0);
  const [description, setDescription] = useState("");
  const [posterUrl, setPosterUrl] = useState("");
  const [moviePosterUrl,setmoviePosterUrl]=useState("");
  const [certificate, setCertificate] = useState("");
  const [category,setCategory]=useState("")

  // Director details
  const [directorImage, setDirectorImage] = useState("");
  const [directorName, setDirectorName] = useState("");
  const [directorImageUrl,setDirectorImageUrl]=useState("");
  const [directorDetails, setDirectorDetails] = useState([]);
  const [directorImageArray,setDirectorImageArray]=useState([]);

  // Music director details
  const [musicDirectorName, setMusicDirectorName] = useState("");
  const [musicDirectorImage, setMusicDirectorImage] = useState("");
  const [musicDirectorImageUrl,setMusicDirectorImageUrl]=useState("");
  const [musicDirectorDetails, setMusicDirectorDetails] = useState([]);
  const [musicdirectorImageArray,setMusicDirectorImageArray]=useState([]);

    // Writer details
    const [writerName, setwriterName] = useState("");
    const [writerDetails, setwriterDetails] = useState([]);

  // Genre details
  const [genreType, setGenreType] = useState("");
  const [genre, setGenre] = useState([]);

  // Language details
  const [originalLanguage, setOriginalLanguage] = useState("");
  const [dubbedLanguage, setDubbedLanguage] = useState("");
  const [languageDetails, setLanguageDetails] = useState([]);

  // Star details
  const [starName, setStarName] = useState("");
  const [starImage, setStarImage] = useState("");
  const [starImageUrl,setStarImageUrl]=useState("");
  const [stars, setStars] = useState([]);
  const [StarImageArray,setStarImageArray]=useState([]);


  //OTT-platform
   const [OTTplatformName, setOTTplatformName] = useState("");
   const [OTTplatformImage, setOTTplatformImage] = useState("");
   const [OTTplatformImageUrl,setOTTplatformImageUrl]=useState("");
   const [OTTplatformMovieUrl, setOTTplatformMovieUrl] = useState("");
   const [OTTPlatformImageArray,setOttplatformImageArray]=useState([]);


   
   const [OTTplatform, setOTTplatform] = useState([]);

  //Related-Videos
  const  [videoTitle,setVideoTitle]=useState("")
  const  [video,setVideo]=useState("")
  const   [videoUrl,setVideoUrl]=useState("")
  const  [videoThumbnail,setVideoThumbnail]=useState("")
  const [VideoThumbnailUrl,setVideoThumbnailUrl]=useState("");
  const  [relatedVideo,setrelatedVideo]=useState([])
  const [videoArray,setvideoArray]=useState([]);
  const [ThumbnailArray,setThumbnailArray]=useState([]);

  

  useEffect(() => {
      // Get today's date in YYYY-MM-DD format
      const today = new Date().toISOString().split('T')[0];
      setReleaseDate(today);
      fetchData()

  }, []);

  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const url = `${apiUrl}admin/allmovies`;
    const jwtToken = Cookies.get('jwt_Admin_Token');
    const options = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    }; 

    const response = await fetch(url, options);
    const data = await response.json();
    if (response.ok) {
      const updatedMovies = data.AllMovies.map((eachMovie) => ({
        movieId: eachMovie.movie_id,
        
        name: eachMovie.name,
      }));
      console.log(updatedMovies)
      setAllMovies(updatedMovies)
    } else {
      console.error(data.errMsg);
    }
  };

  // File input refs
  const directorImageRef = useRef(null);
  const musicDirectorImageRef = useRef(null);
  const starImageRef = useRef(null);
  const OTTPlatformImageRef=useRef(null)
  const videoThumbnailRef=useRef(null)
  const VideoRef=useRef(null)

  const handleCertificateChange = (e) => setCertificate(e.target.value);
  const handleCategoryChange = (e) => setCategory(e.target.value);

  const handleAddDirector = (e) => {
    e.preventDefault();
    if (!directorName || !directorImage) return;

    const newDirector = {
      id: uuidv4(),
      name: directorName,
      image: directorImage,
      imageUrl:directorImageUrl
    };

    setDirectorImageArray((prev)=>[...prev,directorImage])

    setDirectorDetails((prev) => [...prev, newDirector]);
    setDirectorName("");
    setDirectorImage("");
    setDirectorImageUrl("")
    directorImageRef.current.value = "";
  };

  const handleAddMusicDirector = (e) => {
    e.preventDefault();
    if (!musicDirectorName || !musicDirectorImage) return;

    const newMusicDirector = {
      id: uuidv4(),
      name: musicDirectorName,
      image: musicDirectorImage,
      imageUrl:musicDirectorImageUrl
    };
    setMusicDirectorImageArray((prev)=>[...prev,musicDirectorImage])


    setMusicDirectorDetails((prev) => [...prev, newMusicDirector]);
    setMusicDirectorName("");
    setMusicDirectorImage("");
    setMusicDirectorImageUrl("")
    musicDirectorImageRef.current.value = "";
  };

  const handleAddStar = (e) => {
    e.preventDefault();
    if (!starName || !starImage) return;

    const newStar = {
      id: uuidv4(),
      name: starName,
      image: starImage,
      imageUrl:starImageUrl
    };

    setStarImageArray((prev)=>[...prev,starImage])

    console.log(starImage)
    setStars((prev) => [...prev, newStar]);
    setStarName("");
    setStarImage("");
    setStarImageUrl("")
    starImageRef.current.value = "";
  };

  const handleAddGenre = (e) => {
    e.preventDefault();
    if (!genreType) return;

    const newGenre = {
      id: uuidv4(),
      type: genreType,
    };

    setGenre((prev) => [...prev, newGenre]);
    setGenreType("");
  };
  
  const handleAddWriter = (e) => {
    e.preventDefault();
    if (!writerName) return;

    const newWriter = {
      id: uuidv4(),
      name: writerName,
    };

    setwriterDetails((prev) => [...prev, newWriter]);
    setwriterName("");
  };

  const handleAddOriginalLanguage = (e) => {
    e.preventDefault();
    const OriginalPresent = languageDetails.some(each=>each.category==="Original")
    if (!originalLanguage || OriginalPresent) return;

    const newLanguage = {
      id: uuidv4(),
      language: originalLanguage,
      category: "Original",
    };

    setLanguageDetails((prev) => [...prev, newLanguage]);
  };

  const handleAddDubbedLanguage = (e) => {
    e.preventDefault();
    if (!dubbedLanguage) return;

    const newLanguage = {
      id: uuidv4(),
      language: dubbedLanguage,
      category: "Dubbed",
    };

    setLanguageDetails((prev) => [...prev, newLanguage]);
    setDubbedLanguage("");
  };

  const handleOTTPlatform = (e) => {
    e.preventDefault();
    if (!OTTplatformImage || !OTTplatformName || !OTTplatformMovieUrl) return;

    const newOTTplatform = {
      id: uuidv4(),
      name: OTTplatformName,
      image:OTTplatformImage,
      imageUrl:OTTplatformImageUrl,
      link:OTTplatformMovieUrl,
    };
    setOttplatformImageArray((prev)=>[...prev,OTTplatformImage])

    setOTTplatform((prev) => [...prev, newOTTplatform]);
    setOTTplatformName("");
    setOTTplatformImage("");
    setOTTplatformMovieUrl("")
    setOTTplatformImageUrl("")
    OTTPlatformImageRef.current.value = "";
  };
  const handleAddRelatedVideo = (e) => {
    e.preventDefault();
    if (!videoTitle || !videoThumbnail || !video) return;

    const newVideo = {
      id: uuidv4(),
      title: videoTitle,
      Thumbnail:videoThumbnail ,
      ThumbnailUrl:VideoThumbnailUrl,
      video:video,
      videoUrl:videoUrl
    };

    setvideoArray((prev)=>[...prev,video])

    setThumbnailArray((prev)=>[...prev,videoThumbnail])


    setrelatedVideo((prev) => [...prev, newVideo]);
    setVideoTitle("");
    setVideoThumbnail("");
    setVideo("")
    setVideoUrl("")
    setVideoThumbnailUrl("")
    videoThumbnailRef.current.value = "";
    VideoRef.current.value = "";
  };

  const handleToUrl=(setFunction,setUrlFunction,input)=>{
    setFunction(input)
    setUrlFunction(URL.createObjectURL(input))
  }
 


  const handleRemoveItem1 = (setFunction, id) => {

    setFunction((prev) => prev.filter((item) => item.id !== id));
  };

  const handleRemoveItem2 = (function1,setFunction1,setFunction2, id) => {
       const indexToRemove = function1.findIndex((item => item.id === id))
    setFunction1((prev)=>prev.filter((_,index)=>index !== indexToRemove))
    setFunction2((prev)=>prev.filter((_,index)=>index !== indexToRemove))
  };
  const handleRemoveItem3 = (function1,setFunction1,setFunction2,setFunction3, id) => {
    const indexToRemove = function1.findIndex((item => item.id === id))
 
 setFunction1((prev)=>prev.filter((_,index)=>index !== indexToRemove))
 setFunction2((prev)=>prev.filter((_,index)=>index !== indexToRemove))
 setFunction3((prev)=>prev.filter((_,index)=>index !== indexToRemove))

};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setmovieUpdateLoading(true)
    // Ensure all required data are present
    if (!movieName || !movieImage || !movieTrailer || !posterUrl || !certificate || !releaseDate || !runtime || !imdbRating || !description || !stars || !directorDetails || !musicDirectorDetails || !writerDetails || !genre || !languageDetails || !OTTplatform || !relatedVideo) {
      console.log(!movieName , !movieImage , !movieTrailer , !posterUrl , !certificate , !releaseDate , !runtime , !imdbRating , !description , !stars , !directorDetails , !musicDirectorDetails , !writerDetails , !genre , !languageDetails , !OTTplatform , !relatedVideo) 

        alert('Please fill out all fields.');
        return;
    }

    const formData = new FormData();
    formData.append('name', movieName);

    formData.append('movieImage', movieImage);
    formData.append('movieTrailer', movieTrailer);
    formData.append('PosterUrl', posterUrl);
    formData.append('category',category);
    formData.append('certificate', certificate);
    formData.append('releaseDate', releaseDate);
    formData.append('runtime', runtime);
    formData.append('imdbRating', imdbRating);
    formData.append('description', description);

    formData.append('stars', JSON.stringify(stars));
    
    StarImageArray.forEach((file)=>{
      formData.append('StarImage',file)
    })

    formData.append('directors', JSON.stringify(directorDetails));
    directorImageArray.forEach((file)=>{
      formData.append('DirectorImage',file)
    })

    formData.append('musicDirectors', JSON.stringify(musicDirectorDetails));
    musicdirectorImageArray.forEach((file)=>{
      formData.append('MusicDirectorImage',file)
    })

    formData.append('writer', JSON.stringify(writerDetails));
    formData.append('genre', JSON.stringify(genre));
    formData.append('language', JSON.stringify(languageDetails));

    formData.append('OTTPlatform', JSON.stringify(OTTplatform));
    OTTPlatformImageArray.forEach((file)=>{
      formData.append('OTTplatformImage',file)
    })
    formData.append('relatedVideo', JSON.stringify(relatedVideo));
    
    videoArray.forEach((file)=>{
      formData.append('Video',file)
    })
    ThumbnailArray.forEach((file)=>{
      formData.append('Thumbnail',file)
    })

    
    try {
        const jwtToken = Cookies.get('jwt_Admin_Token');
       

     
  
        if (!jwtToken) {
            alert('Authentication token not found. Please log in again.');
            return;
        }
       const filteredMovies = AllMovies.filter(movie => movie.name === movieName);
       if (filteredMovies.length>0){
        alert('Movie Already present Try Another Movie !!!');
            return;
       }
       const apiUrl = import.meta.env.VITE_API_URL; 

        const response = await axios.post(`${apiUrl}admin/upload`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
        console.log(response.data);
        alert('Movie and related videos added successfully');
        window.location.href = '/add-movie'; 
    } catch (error) {
        console.error('Error uploading the movie:', error);
        alert('An error occurred while uploading the movie. Please try again.');
    } finally{
      setmovieUpdateLoading(false)
    }
};

  return (
    <div className="flex">
      <form className="flex flex-col items-right p-10 text-white font-time space-y-4 w-1/2" onSubmit={handleSubmit}>
        <div className="flex flex-col justify-center items-center">
          <label className="text-cyan-400" htmlFor="movieName">
            MOVIE NAME
          </label>
          <input
            type="text"
            id="movieName"
            className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
            onChange={(e) => setMovieName(e.target.value)}
          />
        </div>
        <div className="flex justify-evenly">
          <div className="flex flex-col justify-center items-right">
            <label className="text-cyan-400" htmlFor="movieImage">
              MOVIE IMAGE
            </label>
            <input
              type="file"
              id="movieImage"
              onChange={(e) =>
                handleToUrl(setMovieImage,setmovieImageUrl,(e.target.files[0]))
              }
            />
          </div>

          <div className="flex flex-col justify-center items-right">
            <label className="text-cyan-400" htmlFor="movieTrailer">
              MOVIE VIDEO TRAILER
            </label>
            <input
              type="file"
              id="movieTrailer"
              onChange={(e) =>
                handleToUrl(setMovieTrailer,setmovieTrailerUrl,(e.target.files[0]))
              }
            />
          </div>
        </div>
        <div className="flex justify-around">
          <div className="flex flex-col justify-center items-center">
            <label className="text-cyan-400" htmlFor="releaseDate">
              RELEASE DATE
            </label>
            <input
              type="date"
              value={releaseDate}
              id="releaseDate"
              className="w-36 rounded-sm text-black ring-2 ring-sky-400"
              onChange={(e) => setReleaseDate(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center items-center">
            <label className="text-cyan-400" htmlFor="runtime">
              RUN TIME (in minutes)
            </label>
            <input
              type="number"
              id="runtime"
              min="1"
              className="w-20 ring-2 ring-sky-400 outline-none text-black"
              onChange={(e) => setRuntime(e.target.value)}
            />
          </div>

          <div className="flex flex-col justify-center items-center">
            <label className="text-cyan-400" htmlFor="imdbRating">
              IMDB RATING
            </label>
            <input
              type="number"
              id="imdbRating"
              step="0.1"
              min="1.0"
              max="10.0"
              className="w-20 ring-2 ring-sky-400 outline-none text-black"
              onChange={(e) => setImdbRating(e.target.value)}
            />
          </div>
        </div>

        <label className="text-cyan-400" htmlFor="description">
          DESCRIPTION
        </label>
        <textarea
          rows="10"
          cols="50"
          className="resize-none overflow-auto ring-2 text-black ring-sky-400 outline-none"
          id="description"
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="text-cyan-400" htmlFor="posterUrl">
          POSTER IMAGE
        </label>
        <input
          type="file"
          id="posterUrl"
          onChange={(e) =>handleToUrl(setPosterUrl,setmoviePosterUrl,(e.target.files[0]))}
        />

        <label className="text-cyan-400" htmlFor="certificate">
          CERTIFICATION
        </label>
        <div className="flex justify-center items-center space-x-4">
          {["U", "A", "UA", "S"].map((cert) => (
            <div key={cert}>
              <input
                type="radio"
                name="certificate"
                id={cert}
                value={cert}
                checked={certificate === cert}
                onChange={handleCertificateChange}
              />
              <label htmlFor={cert}>{cert}</label>
            </div>
          ))}
        </div>
        <label className="text-cyan-400" htmlFor="category">
          CATEGORY
        </label>
        <div className="flex justify-center items-center space-x-4">
          {["BlockBuster", "Average", "Hit", "Not yet"].map((cat)=> (
            <div key={cat}>
              <input
                type="radio"
                name="category"
                id={cat}
                value={cat}
                checked={category === cat}
                onChange={handleCategoryChange}
              />
              <label htmlFor={cat}>{cat}</label>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 justify-center items-center border-2 border-white p-2 ">
        <h2 className="text-cyan-400">Star Details</h2>
        <input
          type="text"
          value={starName}
          placeholder="Star Name"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setStarName(e.target.value)}
        />
        
        <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="">Upload Stars Image</label>
        <input
         type="file" 
         ref={starImageRef}
         onChange={(e) =>handleToUrl(setStarImage,setStarImageUrl,(e.target.files[0]))}
        className="ml-20"
        />
        </div>
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddStar}
        >
          Add Star
        </button>
        
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {stars.map((star) => (
            <div key={star.id} className="flex justify-between items-center">
              <div>
              <img src={star.imageUrl} alt={star.name} className="w-14 h-14 rounded-full" />
              <p>{star.name}</p>
              </div>
             
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem2(stars,setStarImageArray,setStars, star.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>
        </div>
        <div className="flex flex-col gap-2 justify-center items-center border-2 border-white p-2 ">
        <h2 className="text-cyan-400">Director Details</h2>
        <input
          type="text"
          value={directorName}
          placeholder="Director Name"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setDirectorName(e.target.value)}
        />
       
         
        <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="">Upload Director Image</label>
        <input
         type="file" 
         ref={directorImageRef}
         onChange={(e) =>handleToUrl(setDirectorImage,setDirectorImageUrl,(e.target.files[0]))}
        className="ml-20"
        />
        </div>
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddDirector}
        >
          Add Director
        </button>
        
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {directorDetails.map((director) => (
            <div key={director.id} className="flex justify-between items-center">
              <div>
              <img src={director.imageUrl} alt={director.name} className="w-14 h-14 rounded-full" />
              <p>{director.name}</p>
              </div>
             
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem2(directorDetails,setDirectorImageArray, setDirectorDetails, director.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>
        </div>
        <div className="flex flex-col gap-2 justify-center border-2 items-center border-white p-2 ">
        <h2 className="text-cyan-400">Music Director Details</h2>
        <input
          type="text"
          value={musicDirectorName}
          placeholder="Music Director Name"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setMusicDirectorName(e.target.value)}
        />
        
        <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="">Upload Music Director Image</label>
        <input
         type="file" 
         id="music-director-img"
         ref={musicDirectorImageRef}
         onChange={(e) =>handleToUrl(setMusicDirectorImage,setMusicDirectorImageUrl,(e.target.files[0]))}

        className="ml-20"
        />
        </div>
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddMusicDirector}
        >
          Add Music Director
        </button>
        <div  className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {musicDirectorDetails.map((director) => (
            <div key={director.id} className="flex justify-between items-center">
              <div>
              <img src={director.imageUrl} alt={director.name} className="w-14 h-14 rounded-full" />
              <p>{director.name}</p>
              </div>
              
             
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem2(musicDirectorDetails,setMusicDirectorImageArray ,setMusicDirectorDetails, director.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>
      
        
        </div>
        <div className="flex flex-col gap-2 justify-center border-2 items-center border-white p-2 ">
        <h2 className="text-cyan-400 text-center">Writer</h2>
        <input
          type="text"
          value={writerName}
          placeholder="Writer Name"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm items text-black p-1 outline-none"
          onChange={(e) => setwriterName(e.target.value)}
        />
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddWriter}
        >
          Add Writer
        </button>
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {writerDetails.map((writer) => (
            <div key={writer.id} className="flex justify-between items-center">
              <p>{writer.name}</p>
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem1(setwriterDetails, writer.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>

        </div>
        <div className="flex flex-col gap-2 justify-center border-2 items-center border-white p-2 ">
        <h2 className="text-cyan-400 text-center">Genre</h2>
        <input
          type="text"
          value={genreType}
          placeholder="Genre Type"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm items text-black p-1 outline-none"
          onChange={(e) => setGenreType(e.target.value)}
        />
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddGenre}
        >
          Add Genre
        </button>
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {genre.map((gen) => (
            <div key={gen.id} className="flex justify-between items-center">
              <p>{gen.type}</p>
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem1(setGenre, gen.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>

        </div>
        <div className="flex flex-col gap-2 justify-center border-2 items-center border-white p-2 ">
        <h2 className="text-cyan-400 text-center">Languages</h2>
        <input
          type="text"
          value={originalLanguage}
          placeholder="Original Language"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setOriginalLanguage(e.target.value)}
        />
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddOriginalLanguage}
        >
          Add Original Language
        </button>
        <input
          type="text"
          value={dubbedLanguage}
          placeholder="Dubbed Language"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setDubbedLanguage(e.target.value)}
        />
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddDubbedLanguage}
        >
          Add Dubbed Language
        </button>
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {languageDetails.map((language) => (
            <div key={language.id} className="flex justify-between items-center w-24">
              <p>{`${language.language} (${language.category})`}</p>
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem1(setLanguageDetails, language.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div> 
        </div>
        <div className="flex flex-col gap-2 justify-center items-center border-2 border-white p-2 ">
        <h2 className="text-cyan-400">OTT Details</h2>
        <input
          type="text"
          value={OTTplatformName}
          placeholder="OTT-Platorm Name"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setOTTplatformName(e.target.value)}
        />
        
         <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="">Upload OTT-Platform Image</label>
        <input
         type="file" 
         id="ott-platform-img"
         ref={OTTPlatformImageRef}
         onChange={(e) => handleToUrl(setOTTplatformImage,setOTTplatformImageUrl,(e.target.files[0]))}
         
        className="ml-20"
        />
        </div>
        <input
          type="text"
          value={OTTplatformMovieUrl}
          placeholder="OTT-Platorm Movie URL"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm text-black p-1 outline-none"
          onChange={(e) => setOTTplatformMovieUrl(e.target.value)}
        />
        
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleOTTPlatform}
        >
          Add OTT Platform
        </button>
        
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
          {OTTplatform.map((OTT) => (
            <div key={OTT.id} className="flex justify-between items-center">
              <div>
              <a href={OTT.link}>
              <img src={OTT.imageUrl} alt={OTT.name} className="w-20 h-14 rounded-full" />
              <p>{OTT.name}</p>
              </a>
              </div>
             
              <button
                className="text-red-500"
                onClick={() => handleRemoveItem2(OTTplatform,setOttplatformImageArray, setOTTplatform, OTT.id)}
              >
                <IoCloseCircleOutline size={24} />
              </button>
            </div>
          ))}
        </div>
        </div>
        <div className="flex flex-col gap-2 justify-center border-2 items-center border-white p-2 ">
        <h2 className="text-cyan-400 text-center">Related Video </h2>
        <input
          type="text"
          value={videoTitle}
          placeholder="Video Title"
          className="ring-2 ring-sky-400 h-8 w-72 rounded-sm items text-black p-1 outline-none"
          onChange={(e) => setVideoTitle(e.target.value)}
        />
        <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="">Upload Thumbnail</label>
        <input
         type="file" 
         id="video-thumbnail"
         ref={videoThumbnailRef}
         onChange={(e) => handleToUrl(setVideoThumbnail,setVideoThumbnailUrl,(e.target.files[0]))}

         className="ml-20"
        />
        </div>
        <div className="ring-2 ring-white/55 gap-2 flex flex-col justify-center items-center p-3">
        <label htmlFor="upload-video">Upload Video</label>
        <input
         type="file" 
         id="upload-video"
         ref={VideoRef}
         onChange={(e) => handleToUrl(setVideo,setVideoUrl,(e.target.files[0]))}
         className="ml-20"
        />
        </div>
        
        <button
          className="bg-cyan-400 text-white p-2 rounded"
          onClick={handleAddRelatedVideo}
        >
          Add Video
        </button>
        <div className="w-full px-5 flex gap-2 overflow-x-auto" style={{scrollbarWidth:"none"}}>
        {relatedVideo.map((video) => (
            <div className="relative" key={video.id}>
            <div
              className="flex justify-between items-center h-20 w-40 bg-cover bg-center"
              style={{ backgroundImage: `url(${video.ThumbnailUrl})` }}
            >
              <p className="text-white bg-black bg-opacity-50 p-1">{video.title}</p>
            </div>
      
            <button
              className="text-red-500 absolute top-0 right-0"
              onClick={() => handleRemoveItem3(relatedVideo,setvideoArray,setThumbnailArray,setrelatedVideo, video.id)}
            >
              <IoCloseCircleOutline size={24} />
            </button>
          </div>
          ))}
        </div>

        </div>
        <div>
          <button className="bg-sky-400 p-3" type="submit" disabled={movieUpdateLoading}> {movieUpdateLoading ? "Uploading" :"Verify And Submit"}

          </button>
        </div>
      </form>

      <div className="w-1/2  fixed top-0 right-0 m-2 border-2 border-sky-400 overflow-y-auto" style={{height:'98vh' }}>
        
        <Preview name={movieName} posterUrl={moviePosterUrl} imdbRating={imdbRating} movieImage={movieImageUrl} movieTrailer={movieTrailerUrl} Date={releaseDate} runtime={runtime} description={description} certificate={certificate} star={stars} director={directorDetails} musicDirector={musicDirectorDetails} writer={writerDetails} OTTplatform={OTTplatform} relatedVideo={relatedVideo} genre={genre} language={languageDetails}/>
   
      </div>

    </div>
  );
};

export default AddMovie;
