import { Component } from 'react';
import CircilarRating from './circular';
import Runtime from './runtime';
import ReleaseDate from './ReleaseDate';
import Shadow from './shadow';
import LikeButton from './OnLike';
import { IoCheckboxOutline } from "react-icons/io5";
import { PiPlusSquare } from "react-icons/pi";
import 'react-toastify/dist/ReactToastify.css';
import Popup from '../Popup';

class Preview extends Component {
    state = {
        like: false,
        isWatchList: false,
        showPopUp: false,
        VideoUrlPopUp: "",
    }

    getOriginalLanguages() {
        return this.props.language.filter(each => each.category === "Original");
    }

    getDubbedLanguages() {
        return this.props.language.filter(each => each.category !== "Original");
    }

    togglePopup = (value) => {
        this.setState(prevState => ({
            VideoUrlPopUp: value,
            showPopUp: !prevState.showPopUp
        }));
    }

    render() {
        const originalLanguages = this.getOriginalLanguages();
        const dubbedLanguages = this.getDubbedLanguages();

        return (
            <>
                <div className='relative bg-slate-900' style={{ height: '100%' }}>
                    <div className='' style={{
                        backgroundImage: `linear-gradient(rgba(15, 23, 42, 0.90), rgba(15, 23, 42, 1)), url(${this.props.posterUrl})`,
                        position: "absolute",
                        height: '100%',
                        minWidth: '100%',
                        backgroundSize: 'cover',
                        opacity: '50px',
                    }}>
                        <div className='absolute flex flex-col divide-y-2 '>
                            <div className='mt-5 mx-3 flex flex-row mb-5'>
                                <div className='flex flex-col' style={{ width: '160px' }}>
                                    <div>
                                        <Shadow input={<img
                                            src={this.props.movieImage}
                                            alt={this.props.name}
                                            style={{ height: '250px', width: '150px' }}
                                            className=' relative rounded-xl bg-cover'
                                        />} />
                                        <div className='relative z-30 -mt-10 flex justify-end -mr-2'>
                                            <CircilarRating rating={this.props.imdbRating} />
                                        </div>
                                        <div className='mx-2 flex justify-start items-center'>
                                            <LikeButton isLike={this.state.like} />
                                            <p className='text-md font-sans text-white/90 italic'>{`0 likes`}</p>
                                            <button type="button" className='ml-3 transition duration-700'>
                                                {this.state.isWatchList ? <IoCheckboxOutline size={50} className='text-sky-400' /> : <PiPlusSquare size={20} className='text-sky-400' />}
                                            </button>
                                        </div>

                                        <div className='relative group py-2'>
                                            <div className='absolute -inset-0.5 w-28 bg-cyan-400 rounded-sm blur-lg transition duration-300 opacity-50 group-hover:opacity-100'></div>
                                            <button onClick={() => this.togglePopup(this.props.movieTrailer)} className='relative px-1 py-2 w-28 text-sm font-MontserBarlowCondensed text-md tracking-wider bg-slate-900 rounded-lg shadow-inner shadow-cyan-500 text-white border-2 border-cyan-500 leading-none text-center'>
                                                WATCH TRAILER
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                {this.state.showPopUp && <Popup handleClickPopup={this.togglePopup} videoUrl={this.state.VideoUrlPopUp} />}
                                <div className='ml-5 divide-y-2' style={{ width: "400px" }}>
                                    <div className='flex'>
                                        <h1 className="text-xl font-MontserBarlowCondensed font-medium mb-2 text-white truncate ...">{this.props.name}</h1>
                                        <ul className='my-5 ml-5 flex-wrap flex w-3/12 justify-center '>
                                            {this.props.genre.map((each, index) => <li key={index} className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400'>{each.type}</li>)}
                                        </ul>
                                    </div>
                                    <div className='flex flex-row divide-x-2 gap-10 py-4 mb-4'>
                                        <div className='-mr-5 pb-4'>
                                            <h1 className='text-md text-white my-2 px-1 font-time bg-lime-400 inline-block'>Runtime</h1>
                                            <Runtime runtime={this.props.runtime} />
                                        </div>
                                        <div className='pl-5 pb-4'>
                                            <h1 className='text-md text-white my-2 px-1 font-time bg-lime-400 inline-block'>Release Date</h1>
                                            <ReleaseDate input={this.props.Date} />
                                        </div>
                                    </div>
                                    <div>
                                        <h1 className='text-md text-white my-2 px-3 font-time bg-lime-400 inline-block'>Storyline</h1>
                                        <p className='text-white stroke-2 stroke-gray-400 text-xl font-sans pb-3'>{this.props.description}</p>
                                    </div>
                                    <div>
                                        <h1 className='text-md text-white my-2 px-3 font-time bg-lime-400 inline-block'>Languages</h1>
                                        <ul className='my-3 ml-5 flex-wrap flex justify-center '>
                                            <li className='text-sm h-5 font-sans italic text-white font-semibold px-2 mb-2 mr-2 bg-green-500'>Original</li>
                                            {originalLanguages.map((each, index) => <li key={index} className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400'>{each.language}</li>)}
                                            <li className='text-sm h-5 font-sans italic text-white font-semibold px-2 mb-2 mr-2 bg-red-700'>Dubbed</li>
                                            {dubbedLanguages.map((each, index) => <li key={index} className='text-sm h-5 font-sans italic text-white font-semibold rounded-lg px-2 mb-2 mr-2 bg-cyan-400'>{each.language}</li>)}
                                        </ul>
                                    </div>
                                </div>
                            </div>
                            <div className='mx-10 flex mb-3 justify-evenly flex-wrap items-center'>
                                <div>
                                    <h1 className='text-sm text-white my-2 px-3 font-time bg-lime-400 inline-block'>DIRECTOR</h1>
                                    <ul className='flex justify-center gap-3'>
                                        {this.props.director.map(each =>
                                            <li key={each.id}>
                                                <img src={each.imageUrl} className='relative h-16 w-16 rounded-full' alt={each.name} />
                                                <p className='font-sans text-white text-center'>{each.name}</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div>
                                    <h1 className='text-sm text-white my-1 px-3 font-time bg-lime-400 inline-block'>MUSIC-DIRECTOR</h1>
                                    <ul className='flex justify-center gap-1'>
                                        {this.props.musicDirector.map(each =>
                                            <li key={each.id}>
                                                <img src={each.imageUrl} className='relative h-16 w-16 rounded-full' alt={each.name} />
                                                <p className='font-sans text-white text-center'>{each.name}</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className=''>
                                    <h1 className='text-sm text-white my-1 px-3 font-time bg-lime-400 inline-block'>STARS</h1>
                                    <ul className='flex justify-center gap-3'>
                                        {this.props.star.map(each =>
                                            <li key={each.id}>
                                                <img src={each.imageUrl} className='relative h-16 w-16 rounded-full' alt={each.name} />
                                                <p className='font-sans text-white text-center'>{each.name}</p>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                            </div>
                            <div className='mx-10 gap-2 flex py-6'>
                                <h1 className='text-sm text-white px-3 font-time bg-lime-400 inline-block'>Writers</h1>
                                <p className='text-sm text-white px-3 font-time'>
                                    {this.props.writer.map(each => each.name).join(" , ")}
                                </p>
                            </div>
                            <div className='mx-10 py-6'>
                                <h1 className='text-sm text-white my-1 px-3 font-time bg-lime-400 inline-block'>RELATED VIDEOS</h1>
                                <ul className='mx-auto flex gap-5 overflow-x-auto' style={{
                                    width: '90%',
                                    maxWidth: '500px',
                                    scrollbarWidth: 'none'
                                }}>
                                    {this.props.relatedVideo.map(each => (
                                        <li key={each.video} onClick={() => this.togglePopup(each.videoUrl)}>
                                            <img src={each.ThumbnailUrl} className='h-16 w-24 rounded-lg' alt="name" />
                                            <p className='text-white w-20'>{each.title}</p>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className='mx-10'>
                                <h1 className='text-sm text-white my-5 px-3 font-time bg-lime-400 inline-block'>OTT PLATFORM</h1>
                                <ul className='flex justify-start px-5 gap-3'>
                                    {this.props.OTTplatform.map((each, index) => (
                                        <li key={index}>
                                            <a href={each.link}>
                                                <img src={each.imageUrl} className='h-20 w-20' alt="OTT" />
                                            </a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </>
        );
    }
}

export default Preview;
