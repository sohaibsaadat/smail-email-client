import { Routes, Route } from "react-router-dom";
import { useState } from "react";

import Layout from "./components/Sidebar";

import Inbox from "./pages/Inbox";
import AllMail from "./pages/AllMail";
import Draft from "./pages/Draft";
import Sent from "./pages/Sent";
import Starred from "./pages/Starred";
import Trash from "./pages/Trash";

import Compose from "./components/Compose";
import LoadingPage from "./pages/LoadingPage";

import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import Email from "./pages/Email";

import PublicRoute from "./routes/PublicRoute";
import ProtectedRoute from "./routes/ProtectedRoute";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  const [open, setOpen] = useState(false);
  const [showSplash, setShowSplash] = useState(true);

  if (showSplash) {
    return (
      <LoadingPage
        onFinish={() => setShowSplash(false)}
      />
    );
  }

  return (
    <div>
      <Routes>

        {/* =========================
            PUBLIC ROUTES
        ========================== */}

        <Route element={<PublicRoute />}>
          <Route path="/signup" element={<SignUp />} />
          <Route path="/login" element={<Login />} />
        </Route>


        {/* =========================
            PROTECTED ROUTES
        ========================== */}

        <Route element={<ProtectedRoute />}>

          <Route
            path="/"
            element={
              <Layout
                setOpen={setOpen}
                open={open}
              />
            }
          >

            <Route
              path="inbox"
              element={<Inbox open={open} />}
            />

            <Route
              path="all-mail"
              element={<AllMail open={open} />}
            />

            <Route
              path="draft"
              element={<Draft open={open} />}
            />

            <Route
              path="sent"
              element={<Sent open={open} />}
            />

            <Route
              path="starred"
              element={<Starred open={open} />}
            />

            <Route
              path="trash"
              element={<Trash open={open} />}
            />

            <Route
              path="compose"
              element={<Compose open={open} />}
            />


            {/* Email pages */}

            <Route
              path="inbox/mail/:id"
              element={<Email />}
            />

            <Route
              path="all-mail/mail/:id"
              element={<Email />}
            />

            <Route
              path="sent/mail/:id"
              element={<Email />}
            />

            <Route
              path="starred/mail/:id"
              element={<Email />}
            />

            <Route
              path="trash/mail/:id"
              element={<Email />}
            />

            <Route
              path="draft/mail/:id"
              element={<Email />}
            />

          </Route>

        </Route>

      </Routes>

      <button
        className="fixed right-5 bottom-10 z-20 flex w-fit cursor-pointer items-center rounded-full bg-blue-300 px-8 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:border-gray-500 hover:shadow-2xl"
      >
        <Compose btnText="Compose" />
      </button>

      <ToastContainer />
    </div>
  );
};

export default App;