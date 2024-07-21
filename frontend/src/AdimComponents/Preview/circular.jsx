import React from "react";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const CircularRating = ({ rating }) => {
    
  return (
    <div className="w-1/3 bg-slate-900 border-4 border-slate-900 rounded-full">
      <CircularProgressbar
        value={rating}
        maxValue={10}
        text={rating?.toString().length === 1 ? `${rating}.0` : rating} 
        styles={buildStyles({
          pathColor: rating < 5 ? "red" : rating < 7 ? "orange" : "green",
          textSize: "30px",
          pathTransitionDuration: 0.5, 
          trailColor: "#0f172a",
        })}
      />
    </div>
  );
};

export default CircularRating;