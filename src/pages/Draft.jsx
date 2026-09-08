import React from 'react'
import { Checkbox } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useEmail } from '../context/EmailContext';
const Draft = ({open}) => {

  const {emails,selectedEmails,handleSelectEmail,handleEmailClick } = useEmail()
  
  const draftMails= emails.filter((email)=> email.folder === 'Draft')
    return (
     <div>
       {draftMails.map((email,index)=>(
             <div onClick={()=>handleEmailClick(email.id)} key={email.id} className='flex border hover:shadow-2xl justify-between w-full  border-t-gray-200 border-l-0 border-r-0 border-b-gray-200 justify- px-5  items-center'>
          
            <div className='flex items-center w-[20%]  gap-2 '>
 <Checkbox
                checked={selectedEmails.includes(email.id)}
  onChange={() => handleSelectEmail(email.id)}

              />             {
  email.starred ? (
    <StarIcon  sx={{ fontSize: 42, color: "gold" }} className="hover:bg-gray-200 p-2 rounded-full" />
  ) 
  :
   ( <StarBorderIcon sx={{ fontSize: 42 }} className="hover:bg-gray-200 p-2 rounded-full"/>)
}
              <p className='text-md font-bold'>{email.sender}</p>
            </div>
    
    
    
            <div className=' text-start w-[70%]  flex gap-2'>
    <p>{email.subject}</p> 
    <p className='text-gray-400'>{open? email.body.slice(0,50):email.body.slice(0,100)}...</p>
            </div>
    
    
            <div className='text-xs w-[8%] text-gray-500'>
              {email.date}
            </div>
          </div>
           ))}
         
        </div>
  )
}

export default Draft
