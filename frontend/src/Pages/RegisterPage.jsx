import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Header from '../Components/Header';
// import { registerUser } from '../services/authservice'; 


const RegisterPage = ({ user, onLogout, onSearch }) => { 
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const isStrongPassword = (pwd) => {
        const strongRegex = new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,})");
        return strongRegex.test(pwd);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (password !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }
        if (!isStrongPassword(password)) {
            setError('Password is not strong enough. It must be at least 8 characters long and contain uppercase, lowercase, a number, and a special character.');
            return;
        }

        setLoading(true);

        const newUser = {
            name: name,
            email: email,
            password: password,
        };

        try {
            const response = await registerUser(newUser);
            setLoading(false);
            console.log('Registration successful:', response.data);
            alert(`Registration successful for ${response.data.name}! You can now log in.`);
            navigate('/login');

        } catch (err) {
            setLoading(false);
            if (err.response && err.response.data) {
                if (typeof err.response.data === 'string') {
                    setError(err.response.data);
                } else if (err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('An unknown registration error occurred.');
                }
            } else {
                setError('Registration failed. Please check your connection and try again.');
            }
            console.error(err);
        }
    };

    return (
        <div>
            <section id="Register">
                <form onSubmit={handleSubmit}>
                    <h1> <u><b>CREATE AN ACCOUNT</b></u></h1>
                    {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
                    
                    <u><b><label htmlFor="name">YOUR NAME</label></b></u>
                    <input type="text" id="name" name="name" required value={name} onChange={(e) => setName(e.target.value)} disabled={loading} />
                    
                    <u><b><label htmlFor="email">EMAIL</label></b></u>
                    <input type="email" id="email" name="email" required value={email} onChange={(e) => setEmail(e.target.value)} disabled={loading} />
                    
                    <u><b><label htmlFor="password">PASSWORD</label></b></u>
                    <input type="password" id="password" name="password" required value={password} onChange={(e) => setPassword(e.target.value)} disabled={loading} />
                    
                    <u><b><label htmlFor="confirm_password">CONFIRM PASSWORD</label></b></u>
                    <input type="password" id="confirm_password" name="confirm_password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} disabled={loading} />
                    
                    <button type="submit" disabled={loading}>
                        {loading ? 'Registering...' : 'Register'}
                    </button>
                    
                    <br />Already Have An Account?<br /><Link to="/login"> Login Here</Link>
                    <br /><Link to="#">Forgot Password?</Link>
                </form>
            </section>

        </div>
    );
};

export default RegisterPage;