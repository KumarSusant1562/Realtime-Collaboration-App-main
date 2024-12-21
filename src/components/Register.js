import React, { useState } from 'react';
const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const handleRegister = async (e) => {
        e.preventDefault();
        // setError(''); // Clear any previous errors
        // try {
        //     const { data } = await axios.post('http://localhost:5000/api/auth/register', { name, email, password });
        //     localStorage.setItem('token', data.token);
        //     navigate('/'); // Redirect to login if registration is successful
        // } catch (error) {
        //     if (error.response && error.response.data && error.response.data.message) {
        //         setError(error.response.data.message); // Set error message if registration fails
        //     } else {
        //         setError('An unexpected error occurred. Please try again later.');
        //     }
        // }
    };

    return (
        <div className="container">
            <h2>Register</h2>
            <form onSubmit={handleRegister}>
                <div className="mb-3">
                    <label htmlFor="name" className="form-label">Username</label>
                    <input
                        type="text"
                        className="form-control"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input
                        type="email"
                        className="form-control"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input
                        type="password"
                        className="form-control"
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Register</button>
            </form>
            {error && <p className="text-danger mt-3">{error}</p>} {/* Display error message */}
            <p>Already have an account? <a href="/">Login</a></p>
        </div>
    );
};

export default Register;