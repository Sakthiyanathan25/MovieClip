import React from "react";
import { format } from "date-fns";
import Shadow from "./shadow";

const ReleaseDate = ({ input }) => {
  // Parse input date
  const inputDate = new Date(input);

  // Check if the input is a valid date
  if (isNaN(inputDate)) {
    console.error("Invalid Date:", input);
    return "Invalid Date";
  }

  // Format the date to 'dd-LLL-yyyy'
  const formattedDate = format(inputDate, "dd-LLL-yyyy");

  // Split the formatted date string into an array of characters
  const dateChars = formattedDate.split("");

  // Apply styling to each character, adding padding if the character is "-"
  const styledDate = dateChars.map((char, index) => {
    if (char === "-") {
      return null; 
    }
    return (
      <Shadow input={<div
        key={index}
        className={`relative ${
          (dateChars.length - 1 === index ? "" : (dateChars[index+1]==="-" ?  "mr-2":""))
        } h-10 w-10 flex justify-center items-center rounded-lg text-4xl font-time bg-white/80`}
      >
        {char.toUpperCase()}
      </div>}/>
    );
  });

  return <div className="flex gap-1">{styledDate}</div>;
};

export default ReleaseDate;
