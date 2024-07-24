import React, { useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/navbar/navbar";
import Sidebar from "./components/sidbar/sidbar";
import Dashboard from "./vues/home";
import Contacts from "./vues/visiteur";
import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./components/theme/theme";
import Team from "./vues/team";
import New from "./vues/new";
import FAQ from "./vues/FAQ";
import Calendar from "./vues/calendrier";
import Dashboard2 from "./vues/dashbord";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoginForm from './vues/login/LoginForm';
import { AuthProvider } from './services/AuthService';
import PrivateRoute from './services/PrivateRoute';
import CreateVote from "./vues/createvote";

import DisplayVotes from "./vues/ag/vote";
import Payment from "./vues/payment/payment";
import AgList from "./vues/ag/ag";
import   VotePage from "./vues/vote/vote";
import CreateAGForm from "./vues/ag/CreateAGForm";

import CreatePropositionForm from "./vues/ag/propostions";
import AgDetail from "./vues/ag/AgDetail";
import LogoutPage from "./vues/login/Logout";
import TransactionsList from "./vues/Transaction";
import Demandes from "./vues/Demande/Demande";
import { UserProvider } from "./services/UserContext";
import EvenementsPage from "./vues/evenement/createEvent";

import VoteForm from "./vues/ag/vote";
import VoteResults from "./vues/ag/VoteResults";
import DocumentsContainer from "./vues/Documents/DocumentContainer";


function App() {
  const [theme, colorMode] = useMode();
  const [isSidebar, setIsSidebar] = useState<boolean>(true);
  const location = useLocation();
  const [currentAG, setCurrentAG] = useState<number | null>(null);

  const handleAGCreated = (ag: any) => {
    setCurrentAG(ag.id); 
  };


  const isLoginPage = location.pathname === '/login';

  return (
    <AuthProvider>
      <ColorModeContext.Provider value={colorMode}>
      <UserProvider>
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <div className="app">
            <ToastContainer />
            {!isLoginPage && <Sidebar isSidebar={isSidebar} />}
            <main className="content">
              {!isLoginPage && <Topbar setIsSidebar={setIsSidebar} />}
              <Routes>
                <Route path="/login" element={<LoginForm />} />
                {/* <Route path="/" element={<PrivateRoute element={<Dashboard />} />} /> */}
             
                <Route
                  path="/createAG"
                  element={<PrivateRoute element={<CreateAGForm onAGCreated={handleAGCreated} />} />}
                />
                <Route
                  path="/createProposition/:agId"
                  element={<PrivateRoute element={<CreatePropositionForm   />} />}
                />
                <Route
                  path="/ags/:id" 
                  element={<PrivateRoute element={<AgDetail   />} />}
                />
                <Route path="/vote1" element={<PrivateRoute element={<VotePage />} />} />
                <Route path="/stripe" element={<PrivateRoute element={<Payment />} />} />
                <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/team" element={<PrivateRoute element={<Team />} />} />
                <Route path="/contacts" element={<PrivateRoute element={<Contacts />} />} />
                <Route path="/form" element={<PrivateRoute element={<New  title={"Créer un nouvel utilisateur"}  />} />} />
                <Route path="/Account" element={<PrivateRoute element={<Dashboard2 />} />} />
                <Route path="/faq" element={<PrivateRoute element={<FAQ />} />} />
                <Route path="/calendar" element={<PrivateRoute element={<Calendar />} />} />
                <Route path="/createVote" element={<PrivateRoute element={<CreateVote />} />} />
                <Route path="/vote" element={<PrivateRoute element={<DisplayVotes />} />} />
                <Route path="/document" element={<PrivateRoute element={<DocumentsContainer />} />} />
                <Route path="/ag" element={<PrivateRoute element={<AgList />} />} />
                <Route path="/logout" element={<PrivateRoute element={<LogoutPage />} />} />
                <Route path="/transaction" element={<PrivateRoute element={<TransactionsList />} />} />
                {/* <Route path="/ag" element={<PrivateRoute element={<AgList />} />} /> */}
                <Route path="/demande" element={<PrivateRoute element={<Demandes />} />} />
                {/* <Route path="/transaction" element={<PrivateRoute element={<TransactionsList />} />} /> */}
                <Route path="/ags/:agId/vote" element={<PrivateRoute element={<VoteForm />} />} />
                
                <Route path="/VoteResults" element={<PrivateRoute element={<VoteResults />} />} />
                <Route path="/evenement" element={<PrivateRoute element={<EvenementsPage />} />} />
            
              </Routes>
            </main>
          </div>
        </ThemeProvider>
      </UserProvider>  
      </ColorModeContext.Provider>
    </AuthProvider>
  );
}

export default App;

