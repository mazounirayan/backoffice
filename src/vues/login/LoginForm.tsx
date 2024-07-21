import { useState } from 'react';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../services/AuthService';
import Toastify from 'toastify-js';
import 'toastify-js/src/toastify.css';

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [authError, setAuthError] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const showToast = (text: string, success = true) => {
    Toastify({
      text,
      duration: 3000,
      close: true,
      gravity: "top",
      position: "right",
      backgroundColor: success ? "linear-gradient(to right, #00b09b, #96c93d)" : "linear-gradient(to right, #ff5f6d, #ffc371)",
    }).showToast();
  };

  const onButtonClick = async () => {
    setEmailError("");
    setPasswordError("");
    setAuthError("");

    if (email === "") {
      setEmailError("Please enter your email");
      showToast("Please enter your email", false);
      return;
    }

    if (password === "") {
      setPasswordError("Please enter a password");
      showToast("Please enter a password", false);
      return;
    }

    if (password.length < 7) {
      setPasswordError("Password must be 8 characters or longer");
      showToast("Password must be 8 characters or longer", false);
      return;
    }

    if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      setEmailError("Please enter a valid email address");
      showToast("Please enter a valid email address", false);
      return;
    }

    try {
      await login(email, password);
      showToast("Login successful!");
      navigate('/');
    } catch (error) {
      setAuthError("Login failed. Please check your email and password.");
      showToast("Login failed. Please check your email and password.", false);
    }
  };

  return (
    <div className="login-box">
      <h2>Login</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="user-box">
          <input  
            value={email}
            placeholder='Enter email address here' 
            onChange={ev => setEmail(ev.target.value)}
            className="user-box"      
          />
          <label className='errorLabel'>{emailError}</label>
        </div>
        <div className="user-box">
          <input 
            type="password"
            value={password}
            placeholder='Enter password here'
            onChange={ev => setPassword(ev.target.value)}
            className="user-box"
          />
          <label className='errorLabel'>{passwordError}</label>
        </div>
        {authError && <p className="errorLabel">{authError}</p>}
        <input 
          onClick={onButtonClick}
          className="inputButton"
          type="button"      
          value="Submit"
        />
      </form>
    </div>     
  );
}

export default Login;
