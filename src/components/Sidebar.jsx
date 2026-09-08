import * as React from 'react';
import { useState, useEffect, useMemo } from 'react';
import { useTheme, styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import List from '@mui/material/List';
import CssBaseline from '@mui/material/CssBaseline';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import StarBorderPurple500OutlinedIcon from '@mui/icons-material/StarBorderPurple500Outlined';
import SendOutlinedIcon from '@mui/icons-material/SendOutlined';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import MarkAsUnreadOutlinedIcon from '@mui/icons-material/MarkAsUnreadOutlined';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import ArrowBackOutlinedIcon from '@mui/icons-material/ArrowBackOutlined';
import MarkEmailUnreadOutlinedIcon from '@mui/icons-material/MarkEmailUnreadOutlined';
import RestoreOutlinedIcon from '@mui/icons-material/RestoreOutlined';
import RefreshIcon from '@mui/icons-material/Refresh';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Link, useLocation, useNavigate, useParams, Outlet } from "react-router-dom";
import { Checkbox, IconButton } from "@mui/material";
import { useEmail } from '../context/EmailContext';
import { useDialog } from "../context/DialogContext";
import api from '../axios/axios';
import { toast } from 'react-toastify';
import GmailSearchBar from './GmailSearchBar';
import { filterEmails } from '../utils/filterEmails';

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justify: 'flex-end',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
}));

export default function Layout({ open, setOpen }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleDrawerClose = () => setOpen(false);

  const menuItems = [
    { text: "Inbox", icon: <InboxIcon />, path: "/inbox" },
    { text: "Starred", icon: <StarBorderPurple500OutlinedIcon />, path: "/starred" },
    { text: "Send Email", icon: <SendOutlinedIcon />, path: "/sent" },
    { text: "Drafts", icon: <NoteOutlinedIcon />, path: "/draft" },
    { text: "All Mail", icon: <MarkAsUnreadOutlinedIcon />, path: "/all-mail" },
    { text: "Trash", icon: <DeleteOutlinedIcon />, path: "/trash" },
  ];

  const [userName, setUserName] = useState("");
  const [isRotated, setIsRotated] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // <-- Search state

  const { handleSelectAll, checked, emails, selectedEmails, trashMail, getMail, restoreEmail } = useEmail();
  const { openDialog } = useDialog();
  const location = useLocation();
  const navigate = useNavigate();
  const { id } = useParams();

  const isEmailOpen = location.pathname.includes("/mail/");
  const path = location.pathname.split("/")[1] || "inbox";
  const capitalizePath = path.charAt(0).toUpperCase() + path.slice(1);

  // Apply folder + Gmail search filter
  const filteredEmails = useMemo(() => {
    return filterEmails(emails, location.pathname, searchQuery);
  }, [emails, location.pathname, searchQuery]);

  const countedMail = filteredEmails.length;
  const currentIndex = filteredEmails.findIndex((email) => String(email.id) === String(id));

  const getUserName = async () => {
    try {
      const res = await api.get("/user/byid");
      if (res.data?.success) {
        setUserName(res.data.user.firstname);
      }
    } catch (error) {
      console.log(error.response);
    }
  };

  useEffect(() => {
    getUserName();
  }, []);

  const handlePrevious = () => {
    if (currentIndex > 0) {
      navigate(`/${path}/mail/${filteredEmails[currentIndex - 1].id}`);
    }
  };

  const handleNext = () => {
    if (currentIndex < filteredEmails.length - 1) {
      navigate(`/${path}/mail/${filteredEmails[currentIndex + 1].id}`);
    }
  };

  const handleBack = () => navigate(-1);

  const handleLogOut = () => {
    localStorage.removeItem("token");
    setUserName("");
    navigate("/login");
  };

  const handleDelete = () => {
    if (selectedEmails.length > 0) {
      openDialog({
        title: "Delete Email?",
        message: "Are you sure you want to delete this email?",
        onYes: () => { trashMail(selectedEmails); },
        onNo: () => { console.log("Cancelled"); }
      });
    } else {
      toast.error("No email selected");
    }
  };

  const handleRestore = () => {
    if (selectedEmails.length > 0) {
      openDialog({
        title: "Restore Email?",
        message: "Are you sure you want to restore this email?",
        onYes: () => { restoreEmail(selectedEmails); },
        onNo: () => { console.log("Cancelled"); }
      });
    } else {
      toast.error("No email selected");
    }
  };

  const drawerContent = (
    <>
      <DrawerHeader>
        <div className='flex w-full justify-center items-center px-2'>
          <img className='scale-125 cursor-pointer max-w-12 h-auto' src="/public/logo.png" alt="Logo" />
        </div>
        <IconButton onClick={handleDrawerClose}>
          {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      </DrawerHeader>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding sx={{ display: "block" }}>
            <ListItemButton
              component={Link}
              to={item.path}
              onClick={() => isMobile && handleDrawerClose()}
              sx={[
                { minHeight: 48, px: 2.5, textDecoration: "none", color: "inherit" },
                open ? { justifyContent: "initial" } : { justifyContent: "center" },
              ]}
            >
              <ListItemIcon sx={[{ minWidth: 0, justifyContent: "center" }, open ? { mr: 3 } : { mr: "auto" }]}>
                {item.icon}
              </ListItemIcon>
              <ListItemText primary={item.text} sx={[open ? { opacity: 1 } : { opacity: 0 }]} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <MuiAppBar
        position="fixed"
        sx={{
          backgroundColor: "#fff",
          zIndex: (theme) => theme.zIndex.drawer + 1,
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar className='justify-between gap-4'>
          <div className='flex items-center'>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(!open)}
              edge="start"
              sx={{ marginRight: 1 }}
            >
              <MenuIcon sx={{ color: '#000' }} />
            </IconButton>
            <img className='sm:block hidden ml-4 scale-150 cursor-pointer max-w-15 h-auto' src="/public/logo.png" alt="Logo" />
          </div>

          {/* Connected GmailSearchBar props */}
          <GmailSearchBar query={searchQuery} setQuery={setSearchQuery} />

          <div className='flex items-center gap-8'>
            <div className='text-center hidden sm:block'>
              <h1 className='text-black text-[clamp(12px,1.2vw,18px)]'>Logged In As</h1>
              <h1 className='text-black text-[clamp(12px,1.2vw,18px)] font-bold'>{userName}</h1>
            </div>
            <button onClick={handleLogOut} className='text-black bg-red-100 px-4 py-2 border cursor-pointer hover:scale-105 transition-all duration-300 ease-in-out rounded-full text-sm sm:text-base'>
              Logout
            </button>
          </div>
        </Toolbar>
      </MuiAppBar>

      {/* Drawer Section */}
      {isMobile ? (
        <MuiDrawer
          variant="temporary"
          open={open}
          onClose={handleDrawerClose}
          PaperProps={{
            sx: {
              width: '100vw',
              height: '100vh',
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      ) : (
        <MuiDrawer
          variant="permanent"
          open={open}
          sx={{
            width: open ? drawerWidth : `calc(${theme.spacing(7)} + 1px)`,
            flexShrink: 0,
            whiteSpace: 'nowrap',
            boxSizing: 'border-box',
            '& .MuiDrawer-paper': {
              ...(open ? openedMixin(theme) : closedMixin(theme)),
              boxSizing: 'border-box',
            },
          }}
        >
          {drawerContent}
        </MuiDrawer>
      )}

      {/* Main Content View */}
      <Box 
        component="main" 
        sx={{ 
          flexGrow: 1, 
          p: 2, 
          width: '100%',
          minWidth: 0, 
          overflowX: 'auto' 
        }}
      >
        <DrawerHeader />
        {isEmailOpen ? (
          <div>
            <div className='flex items-center justify-between'>
              <div className='flex justify-center items-center'>
                <div className="flex gap-4 pr-2 items-center">
                  <ArrowBackOutlinedIcon onClick={handleBack} sx={{ fontSize: 40 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                  <div onClick={() => { trashMail(id); navigate("/inbox"); }}>
                    <DeleteOutlinedIcon sx={{ fontSize: 40 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                  </div>
                  <MarkEmailUnreadOutlinedIcon sx={{ fontSize: 40 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                </div>
              </div>
              <div className='flex items-center gap-2'>
                <p className='text-xs text-gray-500'> {currentIndex + 1} of {countedMail}</p>
                <ChevronLeftIcon onClick={handlePrevious} sx={{ fontSize: 40 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                <ChevronRightIcon onClick={handleNext} sx={{ fontSize: 40 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
              </div>
            </div>

            {/* Pass state via Outlet context */}
            <Outlet context={{ filteredEmails, searchQuery }} />
          </div>
        ) : (
          <div className='sticky top-0 '>
            <div className="flex items-center">
              <Checkbox checked={checked} onChange={handleSelectAll} />
              
              <div>
                {capitalizePath === "Trash" ? (
                  <div onClick={handleRestore}>
                    <RestoreOutlinedIcon sx={{ fontSize: 35 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                  </div>
                ) : (
                  <div onClick={handleDelete}>
                    <DeleteOutlinedIcon sx={{ fontSize: 35 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
                  </div>
                )}
              </div>
              <div onClick={getMail}>
                <RefreshIcon 
                  onClick={() => setIsRotated(!isRotated)}
                  sx={{
                    fontSize: 32,
                    cursor: 'pointer',
                    transition: 'transform 0.3s ease-in-out',
                    transform: isRotated ? 'rotate(0deg)' : 'rotate(360deg)',
                  }} 
                  className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' 
                />
              </div>
              <MoreVertIcon sx={{ fontSize: 35 }} className='rounded-full hover:bg-gray-200 p-2 cursor-pointer' />
            </div>

            {/* Pass state via Outlet context */}
            <Outlet context={{ filteredEmails, searchQuery }} />
          </div>
        )}
      </Box>
    </Box>
  );
}