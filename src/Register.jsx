import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

function Register(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password1, setPassword1] = useState('');
    const [password2, setPassword2] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const registerUser= async(e) =>{
        e.preventDefault();

        if(validate()){

            setLoading(true);
        try {

            const response = await fetch('https://backend-83h2.onrender.com/api/register/',
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            
            body: JSON.stringify({
                username: username,
                email: email,
                password1: password1,
                password2: password2,
            })
        });

        if(response.status == 201){
            const data = await response.json();
            const {token} = data;

            // save token in secure storage
            localStorage.setItem('token', token);

            // redirect to home page
            navigate('/new_user', {replace: true});
        }
            
        } catch (error) {
            
            console.error('Error:', error);

        }finally{
            setLoading(false);
        }

        }
    }

    const validate=()=>{
        let results = true;
        if(username ==='' || username ===null){
            results = false;
            alert('Invalid username, type in username');
        }
        else if(email ==='' || email === null){
            results = false;
            alert('Invalid email, type in email')
        }
        else if(password1 ==='' || password1 ===null){
            results = false;
            alert('Invalid password, type in password');
        }
        else if(password2 ==='' || password2 ===null){
            results = false;
            alert('paswords do not match');
        }

        return results;
    }

    return(
        <div className="wrapper">
            <nav className="nav-bar">
            <div id="navbar">
            <ul>
            <li>
                <Link to="/" className="nav-link">Start</Link>
            </li>
            <li>
                <Link to="/contacts" className="nav-link">Contacts</Link>
            </li>
            <li>
                <Link to="/about" className="nav-link">About</Link>
            </li>
            </ul>
            </div>
        </nav>
        <div className="card">
            <form onSubmit={registerUser}>
                <h1>Register</h1>
                <div className="input-box"><input type="text" placeholder="Username" required value={username} onChange={(e)=>setUsername(e.target.value)}></input><i class='bx bx-user'></i></div>
                <div className="input-box"><input type="email" placeholder="Email" required value={email} onChange={(e)=>setEmail(e.target.value)}></input><i class='bx bx-envelope'></i></div>
                <div className="input-box"><input type="password" placeholder="Password" required value={password1} onChange={(e)=>setPassword1(e.target.value)}></input></div>
                <div className="input-box"><input type="password" placeholder="Confirm Password" required value={password2} onChange={(e)=>setPassword2(e.target.value)}></input></div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
                <div className="register-link">
                    <p>Already have an account? <Link to="/login">Login</Link></p>
                </div>
            </form>
        </div>
        </div>
    );

}

export default Register