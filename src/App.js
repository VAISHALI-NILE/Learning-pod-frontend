import React from "react";
import { Routes, Route, useLocation, BrowserRouter } from "react-router-dom";
import "./App.css";
import Login from "./components/login/Login";
import SignUp from "./components/signup/SignUp";
import Dashboard from "./components/dashboard/Dashboard";
import CreatePod from "./components/pods/CreatePod";
import Explore from "./components/explore/Explore";
import WhiteBoard from "./components/whiteboard/WhiteBoard";
import Pod from "./components/pods/Pod";
import TaskSubmission from "./components/submissions/TaskSubmission";
import { Slider } from "./components/slider/Slider"; // import your Slider
import ResourceList from "./components/resource/ResourceList";
import ResourcePage from "./components/resource/ResourcePage";
import FolderResources from "./components/resource/FolderResources";
import TaskCreation from "./components/submissions/TaskCreation";

const AppContent = () => {
  const location = useLocation();
  const hideSliderRoutes = ["/", "/sign-up"]; // Define routes where you want to hide the Slider

  return (
    <div className="app-container">
      {!hideSliderRoutes.includes(location.pathname) && <Slider />}{" "}
      {/* Conditionally render the Slider */}
      <div className="content">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/sign-up" element={<SignUp />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/create-pod" element={<CreatePod />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/whiteboard" element={<WhiteBoard />} />
          <Route path="/pod" element={<Pod />} />
          <Route path="/folder/:folderName" element={<FolderResources />} />

          <Route path="/submission" element={<TaskSubmission />} />
          <Route path="/resource" element={<ResourcePage />} />
          <Route path="/task-creation" element={<TaskCreation />} />
        </Routes>
      </div>
    </div>
  );
};
function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}

export default App;
