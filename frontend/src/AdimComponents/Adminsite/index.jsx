import { Component } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { FaPlus, FaSearch } from "react-icons/fa";
import AdminHeader from "../AdminHeader";

class AdminSite extends Component {
  state = {
    movies: [],
    searchInput: "",
    totalusers:0,
    admin:""
  };

  componentDidMount() {
    this.fetchData();
  }
  componentDidUpdate(prevProps, prevState) {
    if (prevState.searchInput !== this.state.searchInput) {
      this.fetchData();
    }
  }
  fetchData = async () => {
    const { searchInput } = this.state;
    const url = `http://localhost:5001/admin/allmovies?search_q=${searchInput}`;
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
        imageUrl: eachMovie.image_url,
        language: eachMovie.language,
        name: eachMovie.name,
        
      }));
      this.setState({ movies: updatedMovies,admin:data.admin,totalusers:data.totalusers });
    } else {
      console.error(data.errMsg);
    }
  };

  deleteMovie = async (id) => {
    const url = `http://localhost:5001/admin/delete/${id} `;
    const jwtToken = Cookies.get('jwt_Admin_Token');
    const options = {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${jwtToken}`,
      },
    };

    const response = await fetch(url, options);
    if (response.ok) {
      alert("Movie Deleted Succeffully")
      await this.fetchData(); // Re-fetch data to update the list
    } else {
      console.error('Failed to delete movie');
    }
  };

  handleSearchInputChange = (e) => {
    this.setState({ searchInput: e.target.value });
    
  };

  handleSearchInputKeyDown = (e) => {
    if (e.key === "Enter") {
      this.fetchData();
    }
  };

  render() {
    const { movies } = this.state;

    return (
      <>  <AdminHeader/>
      <div className=" flex flex-col text-center mt-20 p-10 bg-slate-900  text-white">
            <div className="flex flex-wrap gap-10 justify-center items-center">
            <div className="bg-green-300 w-52 py-10 rounded-lg">
              <h1 className=" font-time py-2 text-xl ">TOTAL USERS</h1>
              <p className=" text-2xl font-time text-green-700 ">{this.state.totalusers}</p>

              
            </div>
            <div className="bg-red-300 w-52 py-10 rounded-lg">
              <h1 className=" font-time py-2 text-xl">ADMIN</h1>
              <p className=" text-2xl font-time text-red-700">{this.state.admin}</p>
              
            </div>
            </div>
           

        <h1 className="text-left font-time py-10 text-5xl">All Movies</h1>

        <div className="relative h-12 mb-20 w-1/2 mx-auto px-3 bg-white flex gap-1 rounded-xl ring-2 ring-sky-400">
          <input
            type="text"
            value={this.state.searchInput}
            onChange={this.handleSearchInputChange}
            onKeyDown={this.handleSearchInputKeyDown}
            className="h-full w-full text-2xl font-time text-black placeholder-zinc-400 pl-2 outline-none"
            placeholder="Search"
            autoFocus
          />
          <FaSearch size={40} className="text-black my-auto" />
        </div>

        <div className="min-h-screen text-white">
          <div>
            <ul className="flex flex-wrap gap-5">
              {movies.map((eachMovie) => (
                <li key={eachMovie.movieId} className="">
                  <div className="flex flex-col gap-2">
                    <img
                      className="h-72 w-48 ring-2 ring-white"
                      src={eachMovie.imageUrl}
                      alt={eachMovie.name}
                    />
                    <button
                      onClick={() => this.deleteMovie(eachMovie.movieId)}
                      className="bg-red-700 ring-2 ring-white py-3 w-full"
                      type="button"
                    >
                      Delete
                    </button>
                    
                     <button className="bg-zinc-900 ring-2 hidden ring-white py-3 w-full" type="button">
                     Update
                   </button>
                   
                  </div>
                </li>
              ))}
             <Link to="/add-movie">
              <div className="flex flex-col gap-2">
                
                <div className="ring-2 ring-white w-48 bg-white/25 h-72">
                  <FaPlus size={60} className="text-white/65 mx-auto mt-32" />
                </div>
                <p className="bg-green-700 ring-2 ring-white py-3 w-full">Add Movie</p>
               
              </div>
              </Link>
            </ul>
          </div>
        </div>
      </div>
      </>
    );
  }
}

export default AdminSite;
