import React, { useState } from "react";
import '../Login.css';
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from 'js-cookie';
import { NgrokUrl } from "./NgrokUrl";


function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault(); // Previene el comportamiento por defecto del formulario
        try {
            const { data } = await axios.post(`https://${NgrokUrl}/api/validateUser`, { username, password });
            if (data.success) {
                localStorage.setItem('userData', JSON.stringify(data.userData));
                //cookie
                Cookies.set('user_id', data.userData.id);
                navigate(`/projects/${data.userData.id}`);
                 // Redirección a la página de inicio solo si la autenticación es exitosa
            } else {
                setError(data.message || 'Error de autenticación'); // Mostrar mensaje de error si la autenticación falla
            }
        } catch (error) {
            setError('No se pudo conectar con el servidor'); // Manejo de error de conexión
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Login</h1>
                <h2>Welcome to Ripipsa!</h2>
                <form onSubmit={handleLogin}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="username" name="username" placeholder='Enter username' value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name="password" placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    <button type="submit" className="login-button">LOGIN</button>
                    {error && <p>{error}</p>}
                </form>
                <div className="links">
                    <a href="#forgot">Forgot Password?</a>
                    <Link to="/register">New? Register Here</Link>
                </div>
            </div>
        </div>
    )
};

export default Login;