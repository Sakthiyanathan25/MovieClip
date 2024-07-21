import ReactPlayer from "react-player";
import { IoIosClose } from "react-icons/io";

function Popup({ handleClickPopup, videoUrl }) {
  const handleCloseButtonClick = (event) => {
    event.stopPropagation();
    handleClickPopup(); 
  };

  return (
    <>
      <div className="fixed z-50 inset-0 flex justify-center items-center backdrop-blur-sm ">
        <div className="relative group">
          <div className='absolute -inset-0.5 bg-cyan-400 rounded-sm blur-lg transit transition duration-300 opacity-50 group-hover:opacity-100'></div>

          <div className=" relative bg-black px-6 py-4 rounded-lg flex-col flex" onClick={handleClickPopup}>
            <div className="self-end mb-2">
              <button onClick={handleCloseButtonClick} className="text-white pb-2">
                <IoIosClose size={40} />
              </button>
            </div>
            <ReactPlayer url={videoUrl} controls width='640px' height='360px' />
          </div>
        </div>
      </div>
    </>
  );
}

export default Popup;
