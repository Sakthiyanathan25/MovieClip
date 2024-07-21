import React from 'react';

const LazyImage = ({ src, alt }) => {
  return (
    <>
    <img
      loading="lazy"
      className="w-48 h-72 object-cover border-2 border-white "
      src={src}
      alt={alt}
    />
     <p className="text-center text-white font-sans text-lg">{alt}</p>
    </>
  );
};


export default LazyImage;
