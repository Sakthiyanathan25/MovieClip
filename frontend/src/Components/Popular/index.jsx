import React, { useEffect, useState, Suspense, lazy } from 'react';
import Footer from '../Footer';
import Header from '../Header';
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Lazy load the image component
const LazyImage = lazy(() => import('./lazyImage'));

function Popular() {
  const [PopularMovies, setPopularMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const url = 'http://localhost:5001/';
    const jwtToken = Cookies.get('jwt_Token');
    const options = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      if (response.ok) {
        const popularMovie = data.popularMovie.map((eachMovie) => ({
          movieId: eachMovie.movie_id,
          imageUrl: eachMovie.image_url,
          name: eachMovie.name,
        }));

        setPopularMovies(popularMovie);
        setLoading(false);
      } else {
        console.log(data.errMsg);
      }
    } catch (error) {
      console.error('Error fetching popular movies:', error);
    }
  };

  return (
    <>
    <div className="bg-slate-900 py-20" style={{ minHeight: '100vh' }}>
      <Header />
      <div>
        <ul className="flex justify-center flex-wrap gap-5 mx-5 ">
          {loading ? (
            Array.from({ length: 20 }).map((_, index) => (
              <li key={index} className="w-48">
                <Skeleton className="w-full  h-72 " baseColor="#1e293b" highlightColor="#374151" />
                <Skeleton className="w-full h-5 " baseColor="#1e293b" highlightColor="#374151" />
              </li>
            ))
          ) : (
            PopularMovies.map((eachMovie) => (
              <li key={eachMovie.movieId} className='animate-slidein300 opacity-0'>
                <Link to={`/movies/${eachMovie.movieId}`}>
                  <Suspense fallback={
                    <div className="w-48">
                      <Skeleton className="w-full h-72" baseColor="#1e293b" highlightColor="#374151" />
                      <Skeleton className="w-full h-5" baseColor="#1e293b" highlightColor="#374151" />
                    </div>
                  }>
                    <LazyImage src={eachMovie.imageUrl} alt={eachMovie.name} />
                   
                  </Suspense>
                </Link>
              </li>
            ))
          )}
        </ul>
      </div>
     
    </div>
    <Footer/>
    </>
  );
}

export default Popular;
