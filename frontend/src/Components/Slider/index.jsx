import React from "react";
import {Link} from "react-router-dom"
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { FaArrowLeft,FaArrowRight } from "react-icons/fa";

function SampleNextArrow(props) {
  const {onClick } = props;
  return (
   <div className="absolute top-1/2 right-0 h-16 w-14 border-2 border-white/70 rounded-r-md flex justify-center items-center bg-black/75 ">
   <FaArrowRight className="  fill-cyan-400 " size={30} color="white" onClick={onClick} />
   </div>
  );
}

function SamplePrevArrow(props) {
  const {onClick } = props;
  return (
    <div className="absolute top-1/2 left-0 h-16 w-14 border-2 border-white/70 rounded-l-md flex justify-center items-center bg-black/75 z-10 ">
    <FaArrowLeft className="  fill-cyan-400 " size={30} color="white" onClick={onClick} />
    </div>
  );
}
const SimpleSlider = ({ List }) => {
  const settings = {
    dots: false,
    infinite: true,
    slidesToShow: 6,
    slidesToScroll: 1,
    initialSlide: 1,
    speed: 500,
    draggable:true,
    touchMove:true,
    swipeToSlide: true,
        nextArrow: <SampleNextArrow />,
    prevArrow: <SamplePrevArrow />
  };

  return (
    <div className=" relative">
      <Slider {...settings} >
        {List.map((eachMovie) => (
          <Link to={`movies/${eachMovie.movieId}`} key={eachMovie.movieId} >
            <img
              className="images"
              src={eachMovie.imageUrl}
              alt={eachMovie.name}
            />
            <p className="text-lg text-sky-400 text-center">{eachMovie.name}</p>
          </Link>
        ))}
      </Slider>
    </div>
  );
};

export default SimpleSlider;
