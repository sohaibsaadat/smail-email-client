import React, { useState } from "react";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { useEmail } from "../context/EmailContext";
import { useParams } from "react-router-dom";
import PrintIcon from '@mui/icons-material/Print';
import Box from '@mui/material/Box';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Portal from '@mui/material/Portal';
import StarBorderIcon from '@mui/icons-material/StarBorder';
import ReplyIcon from '@mui/icons-material/Reply';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import DownloadIcon from '@mui/icons-material/Download';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

// File attachment preview. Shows name + size by default; reveals
// download / verify buttons on hover (Tailwind's `group` utility).
const AttachmentCard = ({ fileName = "Document.pdf", fileSize = "0 KB", onDownload, onVerify }) => {
  return (
    <div className="group relative flex w-full max-w-xs items-center gap-3 overflow-hidden rounded-xl border border-transparent bg-gray-50 p-3 transition-colors hover:border-gray-200 hover:bg-white">
      <div
        aria-hidden="true"
        className="absolute right-0 top-0 h-0 w-0 border-y-16 border-r-16 border-y-transparent border-r-red-500"
      />

      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md bg-red-50">
        <InsertDriveFileIcon className="text-red-600" sx={{ fontSize: 18 }} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="truncate text-sm font-medium text-gray-900">{fileName}</p>
        <p className="text-xs text-gray-400">{fileSize}</p>
      </div>

      <div className="flex shrink-0 gap-1 opacity-0 translate-x-1 transition-all duration-150 group-hover:opacity-100 group-hover:translate-x-0">
        <button
          type="button"
          aria-label="Download file"
          onClick={onDownload}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-200 active:scale-95"
        >
          <DownloadIcon sx={{ fontSize: 18 }} />
        </button>
        <button
          type="button"
          aria-label="Verify file"
          onClick={onVerify}
          className="flex h-8 w-8 items-center justify-center rounded-full text-gray-600 transition-colors hover:bg-gray-200 active:scale-95"
        >
          <VerifiedUserIcon sx={{ fontSize: 18 }} />
        </button>
      </div>
    </div>
  );
};

const Email = () => {
  const { emails , formatEmailDate } = useEmail();
  const { id } = useParams();
    const [open, setOpen] = useState(false);



  const email = emails.find(
    (email) => String(email.id) === String(id)
  );
console.log(email);



const handlePrint = () => {
  window.print()
}

  if (!email) {
    return <h2>Email not found</h2>;
  }

  return (
    <div className="py-8    md:px-15 px-5">
        <div className="flex  justify-between">
          <h1 className="md:text-2xl text-md ">{email.subject}</h1>
          <div onClick={handlePrint}>
          <PrintIcon  className="text-gray-500"/>

          </div>

        </div>
        <div className="flex justify-between">
          <div className="w-full">
            <p className="font-bold md:text-md text-sm">{email.sender}</p>
            <div className="flex items-center justify-between">
              <div className=" justify-between ">
<button
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
      >
        to me
        <ExpandMoreIcon
          size={16}
          className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`}
        />
      </button>
              </div>

       <div className="text-sm text-gray-400 flex items-center gap-5">
          <p>{email.time}</p>
<StarBorderIcon className="hover:bg-gray-200 p-1 rounded-full " sx={{fontSize:30}}/>
<ReplyIcon className="hover:bg-gray-200 p-1 rounded-full " sx={{fontSize:30}}/>  
          </div>
            </div>
  
 
      {open && (
        <div className=" rounded-lg fixed border w-xl z-20 border-gray-200 bg-white shadow-sm px-2 py-2">
          
            <div key={email.id} className="flex flex-col text-[15px] leading-8">
              <div className="flex">
 <div className="w-20 shrink-0 text-right pr-2.5 text-gray-500">
                from:
              </div>
              <div className="gap-2 flex">
 <div className="text-gray-900">{email.sender}</div>
              <div className="text-gray-400">&lt;{email.sender_email}&gt;</div>
              </div>
              </div>
             <div className="flex">
<div className="w-20 shrink-0 text-right pr-2.5 text-gray-500">
                to:
              </div>
              <div className="gap-2 flex">
 <div className="text-gray-900">{
  email.recipients.map((recipient)=>(
    recipient.type === "to" ?   
    recipient.name :null
  ))

  
  }</div>
              <div className="text-gray-400">&lt;{
  email.recipients.map((recipient)=>(
    recipient.type === "to" ?   
    recipient.email :null
  ))

  
  }&gt;</div>
              </div>
             </div>
             <div className="flex">
<div className="w-30 shrink-0 text-right pr-2.5 text-gray-500" title={new Date(email.created_at).toLocaleString()}>
  
             Date:   {formatEmailDate(email.updated_at)}

                              </div>
              <div className="gap-2 flex">
              <div className="text-gray-400">{email.date},{email.time}</div>
              </div>
             </div>
             <div className="flex">
<div className="w-20 shrink-0 text-right pr-2.5 text-gray-500">
                subject:
              </div>
              <div className="gap-2 flex">
              <div className="text-gray-400">{email.subject}</div>
              </div>
             </div>
              
             
            </div>
        
        </div>
      )}
          </div>
         
        </div>
<div dangerouslySetInnerHTML={{ __html: email.body }} className="border-b border-gray-300 md:text-md text-xs w-auto whitespace-pre-line">

    </div>  
<div className="mt-4">
  {email.attachments && email.attachments.length > 0 && (
    <>
      <p className="mb-2 text-sm font-medium text-gray-700">Attachments</p>
      <div className="flex flex-wrap gap-3">
       {email.attachments.map((attachment, index) => (
  <AttachmentCard
    key={attachment.id || index}
    fileName={attachment.file_name}
    fileSize={`${(attachment.file_size / 1024).toFixed(1)} KB`}
    onDownload={() => window.open(attachment.file_url, "_blank")}
    onVerify={() => console.log("Verify", attachment.file_name)}
  />
))}
      </div>
    </>
  )}
</div>

    </div>
  );
};

export default Email;