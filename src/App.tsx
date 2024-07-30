import React, { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Topbar from "./components/navbar/navbar";
import Sidebar from "./components/sidbar/sidbar";
import Dashboard from "./vues/Dashboard";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { ColorModeContext, useMode } from "./components/theme/theme";
import Team from "./vues/team";
import New from "./vues/new";
import FAQ from "./vues/FAQ";
import Calendar from "./vues/calendrier";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import LoginForm from './vues/login/LoginForm';
import { AuthProvider } from './services/AuthService';
import PrivateRoute from './services/PrivateRoute';

import AgList from "./vues/ag/ag";
import CreateAGForm from "./vues/ag/CreateAGForm";
import CreatePropositionForm from "./vues/ag/propostions";
import AgDetail from "./vues/ag/AgDetail";
import LogoutPage from "./vues/login/Logout";
import TransactionsList from "./vues/Transaction/Transaction";
import Demandes from "./vues/Demande/Demande";
import { UserProvider } from "./services/UserContext";
import EvenementsPage from "./vues/evenement/createEvent";
import VoteForm from "./vues/ag/vote";
import VoteResults from "./vues/ag/VoteResults";
import DocumentsContainer from "./vues/Documents/DocumentContainer";
import ModifyAg from "./vues/ag/AgEdit";

import AdherentsManagement from "./vues/adherant/adherant";
import CotisationsPage from "./vues/Transaction/CotisationsPage";
import Info from "./vues/Dashboard";

import StatisticsDashboard from "./vues/Transaction/dashbordStat";
import GestionEvenements from "./vues/evenement/GestionEvent";
import Profile from "./vues/Profile";

import VisiteursManagement from "./vues/visiteur/visitieur";
import SondageSystem from "./vues/vote/SondageSystem";
import SondageListPage from "./vues/vote/SondageList";
import VotePage from "./vues/vote/voteSysteme";
import DownloadPage from "./vues/javainweb";
import ResultsPage from "./vues/vote/Resultat";
import VoteStatistics from "./vues/vote/voteStats";
import UnbanManagement from "./vues/visiteur/unbanManagement";
import ProjectPage from "./vues/Demande/aideprojet";
import AgResults from "./vues/ag/agResultat";
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
                  <Route
                  path="/ags/:id/results" 
                  element={<PrivateRoute element={<AgResults   />} />}
                />
                 <Route
                  path="/stats/:sondageId" 
                  element={<PrivateRoute element={<VoteStatistics   />} />}
                />
           
           {/* <Route path="/VoteStatistics" element={<PrivateRoute element={<VoteStatistics />} />} />
                 */}
                
                <Route path="/" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="/team" element={<PrivateRoute element={<Team />} />} />
                {/* <Route path="/contacts" element={<PrivateRoute element={<Contacts />} />} /> */}
                {/* <Route path="/form" element={<PrivateRoute element={<New  title={"Créer un nouvel utilisateur"}  />} />} /> */}
                <Route path="/Account" element={<PrivateRoute element={<Profile />} />} />
                <Route path="/faq" element={<PrivateRoute element={<FAQ />} />} />
                {/* <Route path="/calendar" element={<PrivateRoute element={<Calendar />} />} /> */}
                <Route path="/createVote" element={<PrivateRoute element={<SondageSystem />} />} />
                {/* <Route path="/vote" element={<PrivateRoute element={<VotingSystem/>} />} /> */}
            
                <Route path="/vote" element={<SondageListPage />} />
                <Route path="/vote/:sondageId" element={<VotePage />} />



                <Route path="/document" element={<PrivateRoute element={<DocumentsContainer />} />} />
                <Route path="/ag" element={<PrivateRoute element={<AgList />} />} />
                <Route path="/logout" element={<PrivateRoute element={<LogoutPage />} />} />
                <Route path="/transaction" element={<PrivateRoute element={<TransactionsList />} />} />
                {/* <Route path="/ag" element={<PrivateRoute element={<AgList />} />} /> */}
                <Route path="/demande" element={<PrivateRoute element={<Demandes />} />} />
                <Route path="/ags/:agId/vote" element={<PrivateRoute element={<VoteForm />} />} />
                
                <Route path="/VoteResults" element={<PrivateRoute element={<VoteResults />} />} />
                <Route path="/evenement" element={<PrivateRoute element={<EvenementsPage />} />} />
                <Route path="/evenementEdit" element={<PrivateRoute element={<GestionEvenements />} />} />
           
                <Route path="/stats" element={<PrivateRoute element={<StatisticsDashboard />} />} />
                
                <Route path="/ags/:id/modify" element={<PrivateRoute element={<ModifyAg />} />} />
                <Route path="/Adherent" element={<PrivateRoute element={<AdherentsManagement />} />} />
              
                <Route path="/Cotisation" element={<PrivateRoute element={<CotisationsPage />} />} />
                <Route path="/visiteur" element={<PrivateRoute element={<VisiteursManagement />} />} />
                <Route path="/DownloadPage" element={<PrivateRoute element={<DownloadPage />} />} />
                <Route path="/results/:sondageId" element={<ResultsPage />} />
                <Route path="/UnbanManagement" element={<PrivateRoute element={<UnbanManagement />} />} />

                <Route path="/ProjectPage" element={<PrivateRoute element={<ProjectPage />} />} />
                
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

