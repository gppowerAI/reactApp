import React, {useState} from "react";
import { Link, useNavigate } from "react-router-dom";

function Login(){

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    //const [returned, setReturned] = useState('');
    const navigate = useNavigate();

    const loginUser = async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(validate()){
            try{

                const response = await fetch('https://backend-83h2.onrender.com/api/login/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        username: 'thabiso',
                        password: password
                    })
                });

                // console.log(response);

                // const returnedData = await response.json();
                // console.log(returnedData);

    
                if(response.status == 200){

                const data = await response.json();
                const {token} =data;
                    
                    // save token in secure storage
                    localStorage.setItem('token', token);
                    localStorage.setItem('name', username);
                    
                    
                    // redirect to home page
                    navigate('/home', {replace: true});

                }else{
                    console.log(response.statusText);
                    alert('something went wrong, try again');
                    console.log('Login failed:', response.statusText);
                    setLoading(false);
                }
        
            }catch(error){
                console.error('Error:', error);
                setLoading(false);
            }finally{
                setLoading(false);
            }
        }
        else
            setLoading(false);
    }

    const validate=()=>{
        let results = true;
        if(username ==='' || username == null){
            //alert('Invalid username');
            return false;
        }
        if(password ==='' || password == null){
            //alert('Invalid password');
            return false;
        }
        
        return true;
    }

    const btnColor = function(){
        const btn = document.querySelector('.card form .btn');
        if(!btn)
            return;
        
        if(validate())
            btn.setAttribute('checked', true);
        else if(btn.hasAttribute('checked'))
            btn.removeAttribute('checked');
    }
    
    return(
        <div className="wrapper">
            <nav className="nav-bar">
            <div id="navbar">
            <ul>
            <li>
                <Link to="/contacts" className="nav-link">Contacts</Link>
            </li>
            <li>
                <Link to="/about" className="nav-link">About US</Link>
            </li>
            </ul>
            </div>
        </nav>
        <div className="card">
            <form onSubmit={loginUser}>
                <h1>Login</h1>
                <div className="input-box"><input type="text" placeholder="Username" required value={username} onChange={(e)=>setUsername(e.target.value)} onInput={btnColor()}></input><i className='bx bx-user'></i></div>
                <div className="input-box"><input type="password" placeholder="Password" required value={password} onChange={(e)=>setPassword(e.target.value)} onInput={btnColor()}></input></div>
                <div className="remember-forgot">
                  
                </div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Logging in...' : 'Login'}</button>
                <div className="register-link">
                    <p>Don't have an account? <Link to="/register">Register</Link></p>
                </div>
            </form>
        </div>
        </div>
    );

}

export default Login