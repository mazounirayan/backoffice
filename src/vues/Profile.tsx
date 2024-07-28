import React, { useState } from "react";
import Image from "../components/image/logo.png";
import "./single.scss";
import { useAuth } from "../services/AuthService";

const Profile = () => {
  const { user, updatePassword } = useAuth();
  const [newPassword, setNewPassword] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const handlePasswordChange = async () => {
    if (user) {
      try {
        await updatePassword(user.id, newPassword);
        alert("Mot de passe mis à jour avec succès");
        setIsEditing(false);
      } catch (error) {
        console.error("Erreur lors de la mise à jour du mot de passe:", error);
        alert("Échec de la mise à jour du mot de passe");
      }
    }
  };

  return (
    <div className="single">
      <div className="singleContainer">
        <div className="top">
          <div className="left">
            <h1 className="title">Information</h1>
      
            <div className="item">
              <img src={Image} alt="" className="itemImg" />
              <div className="details">
                <h1 className="itemTitle">{user?.nom} {user?.prenom}</h1>
                <div className="detailItem">
                  <span className="itemKey">Email: </span>
                  <span className="itemValue">{user?.email}</span>
                </div>
                <div className="detailItem">
                  <span className="itemKey">Mot de passe: </span>
                  <span className="itemValue">********</span>
                </div>
                {isEditing && (
                  <div className="detailItem">
                    <span className="itemKey">Nouveau mot de passe: </span>
                    <input
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="itemValue"
                    />
                    <button onClick={handlePasswordChange}>Enregistrer</button>
                  </div>
                )}
                <div className="detailItem">
                  <span className="itemKey">Numéro de téléphone: </span>
                  <span className="itemValue">{user?.numTel}</span>
                </div>
           
              </div>
            </div>
          </div>
          <div className="right"></div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
