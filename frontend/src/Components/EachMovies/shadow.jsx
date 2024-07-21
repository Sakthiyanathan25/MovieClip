
const Shadow=({input})=>{
    return(
        <div className='relative group'>
        <div className='absolute -inset-0.5 bg-cyan-400 rounded-sm blur-lg  transition duration-300 opacity-50 group-hover:opacity-100'></div>
        {input}
      </div>
    )
}

export default Shadow