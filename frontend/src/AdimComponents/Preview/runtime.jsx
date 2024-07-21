import Shadow from "./shadow"
const Runtime=({runtime})=>{
    
    let hours = Math.floor(runtime / 60).toString().padStart(2, '0');
let minutes = Math.floor(runtime % 60).toString().padStart(2, '0');

    return(
        <div className='flex gap-1'>
                <Shadow input={ <div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           {hours[0]}
        </div>}/>
        <Shadow input={ <div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           {hours[1]}
        </div>}/>
        <Shadow input={<div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
         H
        </div>}/>
        <Shadow input={<div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           {minutes[0]}
        </div>}/>
        <Shadow input={<div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           {minutes[1]}
        </div>}/>
        <Shadow input={<div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           M
        </div>}/>
        
        <Shadow input={<div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
          I
        </div>}/>
       <Shadow input={ <div className='relative h-6 w-6 flex justify-center items-center rounded-lg text-sm font-time bg-white/80'>
           N
        </div>}/>
     </div>
    )
}

export default Runtime