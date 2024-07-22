import axios from 'axios';
import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate(); 

  useEffect(() => {
    const logout = async () => {
      try {
     
        
        const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser') || '{}');
        console.log(loggedInUser.nom)
      if(!loggedInUser){
        alert("pas disop")
      }
  const token = localStorage.getItem('token');
     

  const response = await axios.delete(
    `https://pa-api-0tcm.onrender.com/auth/logout/${loggedInUser.id}`,
    {   data: {
      token: token  // Envoyer le token dans le corps de la requête
    }}
  );
  console.log(response.data);



        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
     
        navigate(`/`);
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
      }
    };

    logout(); 
  }, []); 
 
  return (
    <div>
      <p>Déconnexion en cours...</p>
     
    </div>
  );
};

export default LogoutPage;
