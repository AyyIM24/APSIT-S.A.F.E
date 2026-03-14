import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';


const LoginPage = ({ onLogin, user, onLogout, onSearch }) => { 
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        const credentials = {
            email: email,
            password: password
        };

        try {
            await onLogin(credentials);
            
            setLoading(false);
            console.log('Login successful!');
            navigate('/');

        } catch (err) {
            setLoading(false);
            if (err.response && (err.response.status === 401 || err.response.status === 403)) {
                setError('Invalid email or password. Please try again.');
            } else if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError('Login failed. Please check your connection and try again.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <Header user={user} onLogout={onLogout} onSearch={onSearch} />
            <section id="login">
                <form onSubmit={handleSubmit}>
                    <h1> <u>LOGIN</u></h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    
                    <u><b><label htmlFor="email">EMAIL</label></b></u>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                    
                    <u><b><label htmlFor="password">PASSWORD</label></b></u>
                    <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                    <div className='footer'>
                    <h2>Don't Have An Account?</h2>
                    <Link to="/register"> Register Here</Link>
                    <br /><Link to="/forgotpassword">Forgot Password?</Link>
                    </div>
                    
                </form>
            </section>
        </div>
    );
};

export default LoginPage;