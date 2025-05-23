import { Navigate, Route , Routes } from "react-router-dom";
import Navbar from "./Components/Navbar";
import "./index.css"
import HomePage from "./Pages/HomePage";
import SignUpPage from "./Pages/SignUpPage";
import LoginPage from "./Pages/LoginPage";
import SettingsPage from "./Pages/SettingsPage";
import ProfilePage from "./Pages/ProfilePage";
import { useAuthStore } from "./Store/useAuthStore";
import { useEffect } from "react";
import { Loader} from "lucide-react"
import {Toaster} from "react-hot-toast"


export default function App() {
  const {checkAuth,isCheckingAuth, authUser} = useAuthStore()

  useEffect(()=>{
    checkAuth()
  },[checkAuth])

  if(isCheckingAuth && !authUser){
    return <div className="flex items-center justify-center h-screen">
        <Loader className="size-10 animate-spin" />
    </div>
  }
  return (
<div>
    <Navbar />
    <Routes>
      <Route path="/" element={authUser?<HomePage /> : <Navigate to={"/login"} /> } />
      <Route path="/signup" element={!authUser? <SignUpPage /> : <Navigate to={"/"} />} />
      <Route path="/login" element={!authUser? <LoginPage />: <Navigate to={"/"} />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/profile" element={authUser?<ProfilePage />: <Navigate to={"/login"} />} />
    </Routes>
    <Toaster />
</div>

    
  );
}
