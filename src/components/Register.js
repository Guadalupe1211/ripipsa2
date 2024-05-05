import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from "axios";
import { NgrokUrl } from './NgrokUrl';
import  Cookies  from 'js-cookie';

function Signup() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    

    const handleRegister = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(`https://${NgrokUrl}/api/Usuario`, { username, password });
            console.log(data+' yo escribi esto con console log')
            if (data === 'Registro creado.') {
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
            } else {
                setError(data.message || 'Se ha registrado el usuario');
            }
        } catch (error) {
            setError('No se pudo conectar con el servidor');
        }
    };

    return (
        <div className="login-container">
            <div className="login-form">
                <h1>Register</h1>
                <form onSubmit={handleRegister}>
                    <div className="input-group">
                        <label htmlFor="username">Username</label>
                        <input type="text" name='username' placeholder='Enter username' value={username} onChange={e => setUsername(e.target.value)} />
                    </div>
                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input type="password" name='password' placeholder='Enter password' value={password} onChange={e => setPassword(e.target.value)} />
                    </div>
                    
                    <button type="submit" className="login-button">REGISTER</button>
                   
                    {error && <p>{error}</p>}
                </form>
                <div className="links">
                    <Link to="/">You have an account? Login</Link>
                </div>
            </div>
        </div>
    )
};

export default Signup;
