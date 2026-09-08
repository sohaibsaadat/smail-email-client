import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import List from '@mui/material/List';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import CloseIcon from '@mui/icons-material/Close';
import Slide from '@mui/material/Slide';
import EditIcon from '@mui/icons-material/Edit';
import EmailInput from './EmailInput';
import AttachFileOutlinedIcon from '@mui/icons-material/AttachFileOutlined';
import InsertLinkOutlinedIcon from '@mui/icons-material/InsertLinkOutlined';
import EmojiEmotionsOutlinedIcon from '@mui/icons-material/EmojiEmotionsOutlined';
import InsertPhotoOutlinedIcon from '@mui/icons-material/InsertPhotoOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import ClearOutlinedIcon from '@mui/icons-material/ClearOutlined';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import FormatItalicIcon from '@mui/icons-material/FormatItalic';
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined';
import StrikethroughSIcon from '@mui/icons-material/StrikethroughS';
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import FormatListBulletedIcon from '@mui/icons-material/FormatListBulleted';
import FormatAlignLeftIcon from '@mui/icons-material/FormatAlignLeft';
import FormatAlignCenterIcon from '@mui/icons-material/FormatAlignCenter';
import FormatAlignRightIcon from '@mui/icons-material/FormatAlignRight';
import FormatQuoteIcon from '@mui/icons-material/FormatQuote';
import FormatColorTextIcon from '@mui/icons-material/FormatColorText';
import FormatColorFillIcon from '@mui/icons-material/FormatColorFill';
import TitleIcon from '@mui/icons-material/Title';
import UndoIcon from '@mui/icons-material/Undo';
import RedoIcon from '@mui/icons-material/Redo';
import FormatClearIcon from '@mui/icons-material/FormatClear';
import TextFieldsIcon from '@mui/icons-material/TextFields';
import EmojiPicker from "emoji-picker-react";
import { toast } from "react-toastify";
import api from '../axios/axios';

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function Compose({ btnText }) {
  const [open, setOpen] = React.useState(false);
  const [focused, setFocused] = React.useState(false);
  const [files, setFiles] = React.useState([]);
  
  // Link Modal States
  const [linkModal, setLinkModal] = React.useState(false);
  const [linkText, setLinkText] = React.useState("");
  const [linkUrl, setLinkUrl] = React.useState("");

  // Image Modal States
  const [imageModal, setImageModal] = React.useState(false);
  const [imageUrl, setImageUrl] = React.useState("");

  // Emoji States
  const [emojiOpen, setEmojiOpen] = React.useState(false);

  // Email States
  const [to, setTo] = React.useState([]);
  const [cc, setCc] = React.useState([]);
  const [bcc, setBcc] = React.useState([]);
  const [subject, setSubject] = React.useState("");

  // Formatting Toolbar States
  const [showToolbar, setShowToolbar] = React.useState(true);
  const [activeFormats, setActiveFormats] = React.useState({
    bold: false,
    italic: false,
    underline: false,
    strikeThrough: false,
    insertOrderedList: false,
    insertUnorderedList: false,
    justifyLeft: false,
    justifyCenter: false,
    justifyRight: false,
  });

  const editorRef = React.useRef(null);
  const savedEmojiRange = React.useRef(null);
  const savedRange = React.useRef(null);
  const fileInputRef = React.useRef(null);
  const inlineImageInputRef = React.useRef(null);

  // Check Active Formats on Selection Change
  const checkActiveFormats = () => {
    if (!editorRef.current) return;
    setActiveFormats({
      bold: document.queryCommandState("bold"),
      italic: document.queryCommandState("italic"),
      underline: document.queryCommandState("underline"),
      strikeThrough: document.queryCommandState("strikeThrough"),
      insertOrderedList: document.queryCommandState("insertOrderedList"),
      insertUnorderedList: document.queryCommandState("insertUnorderedList"),
      justifyLeft: document.queryCommandState("justifyLeft"),
      justifyCenter: document.queryCommandState("justifyCenter"),
      justifyRight: document.queryCommandState("justifyRight"),
    });
  };

  // Helper to execute document commands safely
  const executeCommand = (command, value = null) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    checkActiveFormats();
  };

  // Save Selection Range
  const saveSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (editorRef.current?.contains(range.commonAncestorContainer)) {
        return range.cloneRange();
      }
    }
    return null;
  };

  // Send Email Function
  const handleSend = async () => {
    if (!to || to.length === 0) {
        toast.error("Add at least one recipient");
        return;
    }

    const rawContent = editorRef.current?.innerHTML || "";
    const cleanContent = sanitizeHtmlContent(rawContent);

    const formData = new FormData();
    to.forEach((email) => formData.append("to", email));
    cc.forEach((email) => formData.append("cc", email));
    bcc.forEach((email) => formData.append("bcc", email));

    formData.append("subject", subject || "");
    formData.append("body", cleanContent); // Clean HTML backend ko bhejen

    files.forEach((file) => formData.append("files", file));

    try {
        const res = await api.post("/email/send", formData, {
            headers: { "Content-Type": "multipart/form-data" },
        });

        if (res.data.success) {
            toast.success(res.data.message);
            // reset form logic...
        }
    } catch (err) {
        console.error(err);
        toast.error(err.response?.data?.message || "Failed to send email");
    }
};

  // Reset Draft/Form
  const handleResetForm = () => {
    setTo([]);
    setCc([]);
    setBcc([]);
    setSubject("");
    if (editorRef.current) {
      editorRef.current.innerHTML = "";
    }
    setFiles([]);
    setEmojiOpen(false);
  };

  // Open & Insert Link
  const openLinkModal = () => {
    const range = saveSelection();
    if (range) {
      savedRange.current = range;
      const selectedText = range.toString();
      if (selectedText) setLinkText(selectedText);
    }
    setLinkModal(true);
  };

  const insertLink = () => {
    if (!linkUrl) return;
    let url = linkUrl.trim();
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      url = "https://" + url;
    }

    if (savedRange.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedRange.current);
    }

    const linkHtml = `<a href="${url}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline cursor-pointer">${linkText || url}</a>`;
    executeCommand("insertHTML", linkHtml);

    setLinkModal(false);
    setLinkText("");
    setLinkUrl("");
  };

  // Inline Image Insertion
  const handleInlineImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        executeCommand("insertImage", event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const insertImageFromUrl = () => {
    if (!imageUrl) return;
    executeCommand("insertImage", imageUrl.trim());
    setImageUrl("");
    setImageModal(false);
  };

  // Emoji Operations
  const openEmojiPicker = () => {
    savedEmojiRange.current = saveSelection();
    setEmojiOpen((prev) => !prev);
  };

  const handleEmojiClick = (emojiData) => {
    if (savedEmojiRange.current) {
      const selection = window.getSelection();
      selection.removeAllRanges();
      selection.addRange(savedEmojiRange.current);
    } else {
      editorRef.current?.focus();
    }

    executeCommand("insertText", emojiData.emoji);
    setEmojiOpen(false);
  };

  // File Attachments
  const handleFiles = (e) => {
    const newFiles = Array.from(e.target.files);
    setFiles((prev) => [...prev, ...newFiles]);
  };

  const removeFile = (indexToRemove) => {
    setFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };
const sanitizeHtmlContent = (htmlString) => {
  if (!htmlString) return "";
  
  const parser = new DOMParser();
  const doc = parser.parseFromString(htmlString, 'text/html');

  // Unwanted elements ko strip karein
  doc.querySelectorAll('.PDq2pG_selectionAnchor').forEach(el => el.remove());
  
  // Custom metadata attributes clear karein
  const allElements = doc.body.querySelectorAll('*');
  allElements.forEach(el => {
    el.removeAttribute('data-section-id');
    el.removeAttribute('data-start');
    el.removeAttribute('data-end');
  });

  return doc.body.innerHTML;
};
  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <React.Fragment>
      <div className="flex items-center gap-1">
        <EditIcon />
        <Button sx={{ fontSize: 14, color: 'black', fontWeight: 500 }} onClick={handleClickOpen}>
          {btnText}
        </Button>
      </div>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{ transition: Transition }}
      >
        <AppBar sx={{ position: 'relative', backgroundColor: '#1a73e8' }}>
          <Toolbar>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              New Message
            </Typography>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
          </Toolbar>
        </AppBar>

        <List className='flex flex-col h-full justify-between bg-gray-50'>
          <div className='px-5 py-3 flex h-full flex-col gap-3 bg-white shadow-sm rounded-lg mx-4 my-2 border'>
            {/* Recipient Input */}
            <div onFocus={() => setFocused(true)} tabIndex={0}>
              {focused ? (
                <EmailInput
                  to={to} setTo={setTo}
                  cc={cc} setCc={setCc}
                  bcc={bcc} setBcc={setBcc}
                />
              ) : (
                <input
                  placeholder='Recipients'
                  className='w-full h-10 text-base border-b border-gray-300 focus:outline-none focus:border-blue-500'
                  type="text"
                />
              )}
            </div>

            {/* Subject Input */}
            <input
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder='Subject'
              className='w-full h-10 text-base border-b border-gray-300 focus:outline-none focus:border-blue-500 font-medium'
              type="text"
            />

            {/* Rich Editor Editable Body */}
            <div
              ref={editorRef}
              contentEditable
              suppressContentEditableWarning
              onKeyUp={checkActiveFormats}
              onMouseUp={checkActiveFormats}
              className="min-h-[250px] flex-1 overflow-y-auto p-3 text-base outline-none border rounded-md focus:border-blue-400 empty:before:content-[attr(data-placeholder)] empty:before:text-gray-400"
              data-placeholder="Compose email..."
            />

            {/* Gmail-Style Rich Text Formatting Toolbar */}
            {showToolbar && (
              <div className="flex flex-wrap items-center gap-1 p-1.5 border-t border-b bg-gray-100 rounded-md text-gray-700">
                {/* Undo / Redo */}
                <button title="Undo" type="button" onClick={() => executeCommand("undo")} className="p-1 hover:bg-gray-200 rounded">
                  <UndoIcon fontSize="small" />
                </button>
                <button title="Redo" type="button" onClick={() => executeCommand("redo")} className="p-1 hover:bg-gray-200 rounded">
                  <RedoIcon fontSize="small" />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Font Family */}
                <select
                  title="Font Family"
                  onChange={(e) => executeCommand("fontName", e.target.value)}
                  className="bg-transparent text-sm p-1 rounded hover:bg-gray-200 outline-none cursor-pointer"
                >
                  <option value="Sans-Serif">Sans Serif</option>
                  <option value="Serif">Serif</option>
                  <option value="Monospace">Fixed Width</option>
                  <option value="Wide">Wide</option>
                  <option value="Comic Sans MS">Comic Sans</option>
                  <option value="Garamond">Garamond</option>
                  <option value="Georgia">Georgia</option>
                  <option value="Tahoma">Tahoma</option>
                  <option value="Trebuchet MS">Trebuchet MS</option>
                  <option value="Verdana">Verdana</option>
                </select>

                {/* Font Size */}
                <select
                  title="Font Size"
                  onChange={(e) => executeCommand("fontSize", e.target.value)}
                  className="bg-transparent text-sm p-1 rounded hover:bg-gray-200 outline-none cursor-pointer"
                >
                  <option value="1">Small</option>
                  <option value="3">Normal</option>
                  <option value="5">Large</option>
                  <option value="7">Huge</option>
                </select>

                {/* Heading Preset */}
                <select
                  title="Heading Style"
                  onChange={(e) => executeCommand("formatBlock", e.target.value)}
                  className="bg-transparent text-sm p-1 rounded hover:bg-gray-200 outline-none cursor-pointer"
                >
                  <option value="p">Normal text</option>
                  <option value="h1">Heading 1</option>
                  <option value="h2">Heading 2</option>
                  <option value="h3">Heading 3</option>
                </select>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Basic Inline Styles */}
                <button
                  title="Bold"
                  type="button"
                  onClick={() => executeCommand("bold")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.bold ? "bg-gray-300 font-bold" : ""}`}
                >
                  <FormatBoldIcon fontSize="small" />
                </button>
                <button
                  title="Italic"
                  type="button"
                  onClick={() => executeCommand("italic")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.italic ? "bg-gray-300" : ""}`}
                >
                  <FormatItalicIcon fontSize="small" />
                </button>
                <button
                  title="Underline"
                  type="button"
                  onClick={() => executeCommand("underline")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.underline ? "bg-gray-300" : ""}`}
                >
                  <FormatUnderlinedIcon fontSize="small" />
                </button>
                <button
                  title="Strikethrough"
                  type="button"
                  onClick={() => executeCommand("strikeThrough")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.strikeThrough ? "bg-gray-300" : ""}`}
                >
                  <StrikethroughSIcon fontSize="small" />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Text Color */}
                <label title="Text Color" className="p-1 hover:bg-gray-200 rounded cursor-pointer relative flex items-center">
                  <FormatColorTextIcon fontSize="small" />
                  <input
                    type="color"
                    onChange={(e) => executeCommand("foreColor", e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0"
                  />
                </label>

                {/* Background Color */}
                <label title="Background Color" className="p-1 hover:bg-gray-200 rounded cursor-pointer relative flex items-center">
                  <FormatColorFillIcon fontSize="small" />
                  <input
                    type="color"
                    onChange={(e) => executeCommand("hiliteColor", e.target.value)}
                    className="absolute opacity-0 w-full h-full cursor-pointer top-0 left-0"
                  />
                </label>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Text Alignment */}
                <button
                  title="Align Left"
                  type="button"
                  onClick={() => executeCommand("justifyLeft")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.justifyLeft ? "bg-gray-300" : ""}`}
                >
                  <FormatAlignLeftIcon fontSize="small" />
                </button>
                <button
                  title="Align Center"
                  type="button"
                  onClick={() => executeCommand("justifyCenter")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.justifyCenter ? "bg-gray-300" : ""}`}
                >
                  <FormatAlignCenterIcon fontSize="small" />
                </button>
                <button
                  title="Align Right"
                  type="button"
                  onClick={() => executeCommand("justifyRight")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.justifyRight ? "bg-gray-300" : ""}`}
                >
                  <FormatAlignRightIcon fontSize="small" />
                </button>

                <div className="h-4 w-[1px] bg-gray-300 mx-1" />

                {/* Lists */}
                <button
                  title="Numbered List"
                  type="button"
                  onClick={() => executeCommand("insertOrderedList")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.insertOrderedList ? "bg-gray-300" : ""}`}
                >
                  <FormatListNumberedIcon fontSize="small" />
                </button>
                <button
                  title="Bulleted List"
                  type="button"
                  onClick={() => executeCommand("insertUnorderedList")}
                  className={`p-1 rounded hover:bg-gray-200 ${activeFormats.insertUnorderedList ? "bg-gray-300" : ""}`}
                >
                  <FormatListBulletedIcon fontSize="small" />
                </button>

                {/* Blockquote */}
                <button
                  title="Quote"
                  type="button"
                  onClick={() => executeCommand("formatBlock", "blockquote")}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <FormatQuoteIcon fontSize="small" />
                </button>

                {/* Clear Formatting */}
                <button
                  title="Remove Formatting"
                  type="button"
                  onClick={() => executeCommand("removeFormat")}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <FormatClearIcon fontSize="small" />
                </button>
              </div>
            )}
          </div>

          {/* Attachments Section */}
          <div className='px-5 py-2'>
            <div className='flex gap-2 flex-wrap mb-2'>
              {files.map((file, index) => (
                <div key={index} className="flex items-center gap-2 border bg-blue-50 text-blue-800 px-3 py-1.5 rounded-full border-blue-200 text-sm">
                  <span className="font-medium">{file.name.length > 25 ? file.name.slice(0, 22) + "..." : file.name}</span>
                  <ClearOutlinedIcon
                    className="cursor-pointer text-blue-600 hover:text-red-600"
                    fontSize="small"
                    onClick={() => removeFile(index)}
                  />
                </div>
              ))}
            </div>

            {/* Footer Action Bar */}
            <div className='flex items-center justify-between border-t pt-3'>
              <div className='flex items-center gap-4'>
                <button
                  onClick={handleSend}
                  className='bg-blue-600 hover:bg-blue-700 text-white px-7 py-2 rounded-full font-semibold transition-all shadow-sm active:scale-95'
                >
                  Send
                </button>

                {/* Toggle Formatting Toolbar */}
                <button
                  title="Formatting options"
                  type="button"
                  onClick={() => setShowToolbar((prev) => !prev)}
                  className={`p-1.5 rounded-full hover:bg-gray-200 ${showToolbar ? "bg-gray-200" : ""}`}
                >
                  <TextFieldsIcon className="text-gray-600" />
                </button>

                {/* File Attachment */}
                <input
                  type="file"
                  id='file-upload'
                  ref={fileInputRef}
                  hidden
                  multiple
                  onChange={handleFiles}
                />
                <label htmlFor="file-upload" title="Attach files" className="cursor-pointer p-1.5 hover:bg-gray-200 rounded-full">
                  <AttachFileOutlinedIcon className='text-gray-600' />
                </label>

                {/* Insert Link */}
                <button title="Insert link" type="button" onClick={openLinkModal} className="p-1.5 hover:bg-gray-200 rounded-full">
                  <InsertLinkOutlinedIcon className="text-gray-600" />
                </button>

                {/* Emoji Picker */}
                <div className="relative">
                  <button title="Insert emoji" type="button" onClick={openEmojiPicker} className="p-1.5 hover:bg-gray-200 rounded-full">
                    <EmojiEmotionsOutlinedIcon className="text-gray-600" />
                  </button>
                  {emojiOpen && (
                    <div className="absolute bottom-12 left-0 z-50 shadow-xl rounded-lg">
                      <EmojiPicker onEmojiClick={handleEmojiClick} />
                    </div>
                  )}
                </div>

                {/* Inline Image Upload */}
                <input
                  type="file"
                  accept="image/*"
                  id="inline-image-upload"
                  ref={inlineImageInputRef}
                  hidden
                  onChange={handleInlineImageUpload}
                />
                <label htmlFor="inline-image-upload" title="Insert photo" className="cursor-pointer p-1.5 hover:bg-gray-200 rounded-full">
                  <InsertPhotoOutlinedIcon className="text-gray-600" />
                </label>
              </div>

              {/* Reset / Delete Draft */}
              <button
                title="Discard draft"
                type="button"
                onClick={handleResetForm}
                className="p-2 hover:bg-red-50 text-gray-500 hover:text-red-600 rounded-full transition-colors"
              >
                <DeleteOutlinedIcon fontSize="medium" />
              </button>
            </div>
          </div>
        </List>

        {/* Link Insertion Modal */}
        <Dialog open={linkModal} onClose={() => setLinkModal(false)}>
          <div className="flex w-96 flex-col gap-4 p-5">
            <h2 className="text-xl font-semibold text-gray-800">Edit Link</h2>
            <input
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              placeholder="Text to display"
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
            <input
              value={linkUrl}
              onChange={(e) => setLinkUrl(e.target.value)}
              placeholder="Web address (URL)"
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setLinkModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={insertLink}
                className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                Apply
              </button>
            </div>
          </div>
        </Dialog>

        {/* Image URL Modal (Optional visual prompt fallback) */}
        <Dialog open={imageModal} onClose={() => setImageModal(false)}>
          <div className="flex w-96 flex-col gap-4 p-5">
            <h2 className="text-xl font-semibold text-gray-800">Insert Image URL</h2>
            <input
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Image address (https://...)"
              className="border p-2 rounded outline-none focus:border-blue-500"
            />
            <div className="flex justify-end gap-2 mt-2">
              <button
                onClick={() => setImageModal(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded"
              >
                Cancel
              </button>
              <button
                onClick={insertImageFromUrl}
                className="rounded bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700"
              >
                Insert
              </button>
            </div>
          </div>
        </Dialog>
      </Dialog>
    </React.Fragment>
  );
}