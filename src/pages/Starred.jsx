import React from 'react'
import { Checkbox } from '@mui/material'
import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';
import { useEmail } from '../context/EmailContext';
import { useResponsiveSlice } from '../hooks/useResponsiveSlice';
import { useOutlet, useOutletContext } from 'react-router-dom';

const Starred = ({ open }) => {
  const { emails, selectedEmails, handleSelectEmail, readMail, starredMail, formatEmailDate } = useEmail();
  const { sliceNumber } = useResponsiveSlice();
  const { filteredEmails } = useOutletContext();
  

  // Starred emails filter (deleted emails check to exclude trashed starred emails)

  // Helper Function: HTML tags ko strip karke text nikalne ke liye
  const getPlainText = (htmlContent) => {
    if (!htmlContent) return "No content";
    const doc = new DOMParser().parseFromString(htmlContent, 'text/html');
    return doc.body.textContent || doc.body.innerText || "";
  };

  return (
    <div className="w-full">
      {filteredEmails.map((email) => {
        const plainBody = getPlainText(email.body);
        const previewLimit = open ? 50 : sliceNumber;

        return (
          <div
            key={email.id}
            onClick={() => readMail(email.id)}
            className="flex cursor-pointer border hover:shadow-2xl justify-between w-full border-t-gray-200 border-l-0 border-r-0 border-b-gray-200 md:px-5 px-2 py-2 items-center gap-2"
          >
            {/* Left Icons: Checkbox & Star */}
            <div className="flex items-center min-w-[70px] lg:min-w-[90px] gap-1">
              <div className="flex lg:flex-row flex-col items-center">
                <Checkbox
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: { xs: 16, sm: 18, md: 20, lg: 22, xl: 24 },
                    },
                  }}
                  checked={selectedEmails.includes(email.id)}
                  onClick={(e) => e.stopPropagation()}
                  onChange={() => handleSelectEmail(email.id)}
                />
                <div onClick={(e) => { e.stopPropagation(); starredMail(email.id); }}>
                  {email.is_starred ? (
                    <StarIcon
                      sx={{ fontSize: { xs: 24, sm: 28, md: 32 }, color: "gold" }}
                      className="hover:bg-gray-200 p-1 rounded-full"
                    />
                  ) : (
                    <StarBorderIcon
                      sx={{ fontSize: { xs: 24, sm: 28, md: 32 } }}
                      className="hover:bg-gray-200 p-1 rounded-full"
                    />
                  )}
                </div>
              </div>

              {!email.is_read && (
                <div className="px-1.5 py-0.5 lg:block hidden rounded-full bg-blue-700 text-[10px] text-white font-semibold">
                  New
                </div>
              )}
            </div>

            {/* Middle Section: Sender, Subject, & Body Preview */}
            <div className="flex-1 flex lg:flex-row flex-col items-start lg:items-center gap-1 lg:gap-3 overflow-hidden min-w-0">
              <p className="text-sm font-bold text-gray-900 truncate min-w-[80px] max-w-[120px]">
                {email.sender || "Unknown"}
              </p>

              <p className="text-sm font-semibold text-gray-800 truncate min-w-[100px] max-w-[180px]">
                {email.subject || "(no subject)"}
              </p>

              {/* Cleaned Plain Text Preview */}
              <p className="text-xs lg:text-sm text-gray-500 truncate flex-1 min-w-0">
                - {plainBody.slice(0, previewLimit)}...
              </p>
            </div>

            {/* Right Section: Date & Badge */}
            <div className="text-xs min-w-[65px] text-right text-gray-500 whitespace-nowrap" title={new Date(email.created_at).toLocaleString()}>
              {formatEmailDate(email.created_at)}
              {!email.is_read && (
                <div className="px-1 lg:hidden block text-center rounded-full bg-blue-700 text-[10px] text-white font-semibold mt-1">
                  New
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default Starred;