import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Sidebar";

import Inbox from "./pages/Inbox";
import AllMail from "./pages/AllMail";
import Draft from "./pages/Draft";
import Sent from "./pages/Sent";
import Starred from "./pages/Starred";
import Trash from "./pages/Trash";
import Compose from "./components/Compose";
import LoadingPage from "./pages/LoadingPage";

import { useState } from "react";
import SignUp from "./pages/SignUp";
import Login from "./pages/Login";
import VerifyEmail from "./pages/VerifyEmail";
import ForgetPasswordEmail from "./pages/ForgetPasswordEmail";

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
    <Routes>

      {/* Login */}
      <Route path="/signup" element={<SignUp  />} />
      <Route path="/login" element={<Login  />} />
      <Route path="/verifyEmail" element={<VerifyEmail  />} />
      <Route path="/forgetPasswordEmail" element={<ForgetPasswordEmail  />} />

      {/* Main Application */}
      <Route
        path="/*"
        element={
          <div className="relative">

            <Layout setOpen={setOpen} open={open}>
              <Routes>
                <Route path="/" element={<Inbox open={open} />} />
                <Route path="/all-mail" element={<AllMail open={open} />} />
                <Route path="/drafts" element={<Draft open={open} />} />
                <Route path="/sent" element={<Sent open={open} />} />
                <Route path="/starred" element={<Starred open={open} />} />
                <Route path="/trash" element={<Trash open={open} />} />
              </Routes>
            </Layout>

            <button
              className="fixed right-5 bottom-10 z-20 flex w-fit cursor-pointer items-center rounded-full bg-blue-300 px-8 py-2 transition-all duration-300 ease-in-out hover:scale-105 hover:border-gray-500 hover:shadow-2xl"
            >
              <Compose btnText="Compose" />
            </button>

          </div>
        }
      />

    </Routes>
  );
};

export default App;