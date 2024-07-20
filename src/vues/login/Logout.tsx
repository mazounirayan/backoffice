import axios from 'axios';
import React, { useEffect } from 'react';
import {  useNavigate } from 'react-router-dom';

const LogoutPage: React.FC = () => {
    const navigate = useNavigate(); // Utiliser le hook useNavigate

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
        // Rediriger l'utilisateur vers la page d'accueil ou une autre page après la déconnexion
        navigate(`/`);
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        // Gérer l'erreur de déconnexion, afficher un message à l'utilisateur si nécessaire
      }
    };

    logout(); // Appeler la fonction de déconnexion lors du montage du composant
  }, []); // Le tableau vide signifie que useEffect s'exécute une seule fois après le montage initial

  // Affichage pendant la déconnexion
  return (
    <div>
      <p>Déconnexion en cours...</p>
      {/* Vous pouvez ajouter un loader ou un message ici si nécessaire */}
    </div>
  );
};

export default LogoutPage;
