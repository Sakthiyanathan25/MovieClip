
import React from 'react'


const PopupHover = ({content,input}) => (
   <div className='relative group'>
    {input}
    <div className='hidden group-hover:block p-1 bg-white opacity-80 absolute rounded-lg italic font-sans text-sm'>
      {content}
    </div>
   </div>
  
)

export default PopupHover