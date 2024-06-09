import React, { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Topbar from "./components/navbar/navbar";
import Sidebar from "./components/sidbar/sidbar";
import Dashboard from "./vues/home";
import Contacts from "./vues/contact";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./components/theme/theme";
import Team from "./vues/team";
import New from "./vues/new";
import { userInputs } from "./vues/source";
import FAQ from "./vues/FAQ";
import Calendar from "./vues/calendrier";
import Dashboard2 from "./vues/dashbord";
import Apitest from "./vues/apiTest";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoginForm from './vues/LoginForm';
import { AuthProvider } from './services/AuthService';
import PrivateRoute from './services/PrivateRoute';
import CreateVote from "./vues/createvote";

import Documents from "./vues/Documents";
import DisplayVotes from "./vues/vote";

function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
 
  
  return (
    <AuthProvider>
      
        <ColorModeContext.Provider value={colorMode}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <div className="app">
              <ToastContainer />
              <Sidebar isSidebar={isSidebar} />
              <main className="content">
                <Topbar setIsSidebar={setIsSidebar} />
                <Routes>
                  <Route path="/login" element={<LoginForm />} />
                  <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
                  <Route path="/apitest" element={<PrivateRoute element={<Apitest />} />} />
                  <Route path="/team" element={<PrivateRoute element={<Team />} />} />
                  <Route path="/contacts" element={<PrivateRoute element={<Contacts />} />} />
                  <Route path="/form" element={<PrivateRoute element={<New inputs={userInputs} title={"Créer un nouvel utilisateur"} />} />} />
                  <Route path="/Account" element={<PrivateRoute element={<Dashboard2 />} />} />
                  <Route path="/faq" element={<PrivateRoute element={<FAQ />} />} />
                  <Route path="/calendar" element={<PrivateRoute element={<Calendar />} />} />
                  <Route path="/createVote" element={<PrivateRoute element={<CreateVote  />} />} />
                  <Route path="/vote" element={<PrivateRoute element={<DisplayVotes  />} />} />
                  <Route path="/document" element={<PrivateRoute element={<Documents  />} />} />
                  
                </Routes>
              </main>
            </div>
          </ThemeProvider>
        </ColorModeContext.Provider>
      
    </AuthProvider>
  );
}

export default App;
function setToken(storedToken: string) {
  throw new Error("Function not implemented.");
}

