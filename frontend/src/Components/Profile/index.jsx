import React, { useEffect, useState } from 'react';
import Header from '../Header';
import Cookies from 'js-cookie';
import Footer from '../Footer';

function Profile() {
  const [userDetails, setUserDetails] = useState({});
  const [likedMovies, setLikedMovies] = useState([]);
  const [watchListMovies, setWatchListMovies] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);
  const fetchData = async () => {
    const apiUrl = import.meta.env.VITE_API_URL; 
    const url = `${apiUrl}user/userDetails`;
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

    if (response.ok) {
      const user = data.userDetails.map(user => ({
        userID: user.user_id,
        Password: "*".repeat(8),
        userName: user.username,
      }));

      setUserDetails(user[0]);
      setWatchListMovies(data.WatchList);
      setLikedMovies(data.likedMovies);
    } else {
      console.log(data.errMsg);
    }
  };

  const onClickLogout = () => {
    Cookies.remove('jwt_Token');
    window.location.href = "/login";
  };

  return (
    <>
      <Header />
      <div className="px-20 my-32 flex flex-col gap-6">
        <h1 className="text-8xl font-MontserBarlowCondensed text-white">Account</h1>
        <hr />
        <div className="flex flex-col gap-3">
          <p className="text-3xl font-inter text-white">Username: {userDetails.userName}</p>
          <p className="text-3xl font-inter text-white">Password: ************</p>
        </div>
        <hr />
        <div className="mx-auto">
          <button
            className="h-12 text-white px-4 rounded-lg bg-red-600"
            type="button"
            onClick={onClickLogout}
          >
            Logout
          </button>
        </div>
        <div className='flex flex-col gap-5'>
          <h1 className="text-4xl text-white">LIKED MOVIES  <span className=' px-3 text-cyan-400 rounded-md bg-white'>{likedMovies.length}</span></h1>
          <ul className="flex gap-5 overflow-x-auto p-3" style={{
            width:'100%',
            scrollbarWidth:'none',
          }}>
            {likedMovies.map(movie => (
              <li key={movie.movie_id} className="w-52">
                <img src={movie.image_url} className="h-72 w-48  ring-2 ring-white" alt={movie.name} />
                <p className='w-48 text-center text-lg font-sans  text-white'>{movie.name}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className='flex flex-col gap-5'>
          <h1 className="text-4xl text-white">WATCHLIST MOVIES <span className='px-3 text-cyan-400 rounded-md bg-white'>{watchListMovies.length}</span></h1>
          <ul className="flex gap-5 overflow-x-auto p-3" style={{
            width:'100%',
            scrollbarWidth:'none',
          }}>
            {watchListMovies.map(movie => (
              <li key={movie.movie_id} className="w-52">
                <img src={movie.image_url} className="h-72 w-48 ring-2 ml-1 ring-white" alt={movie.name} />
                <p className='w-48 text-center text-lg font-sans  text-white'>{movie.name}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Footer />
    </>
  );
}

export default Profile;
