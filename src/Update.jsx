import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";

function Update(){

    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const updateUser = async(e)=>{
        e.preventDefault();
        setLoading(true);
        
        if(!validate())
            return setLoading(false);
        
        try{
            const token = localStorage.getItem('token');
            if(token){
                const response = await fetch('https://backend-83h2.onrender.com/api/update/', {
                    method: 'PUT', // partial update
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + token
                    },
                    body: JSON.stringify({
                        username: username,
                        email: email,
                        first_name: firstName,
                        last_name: lastName,
                    })
                });
                
                setLoading(false);
                
                if(response.ok){
                    alert('successfully updated  details');
                    navigate('/home');
                }else
                    console.log('Update failed:', response.statusText);
            }else{
                alert("you're not logged in or registered, please login or register to use this service");
                navigate('/login', {replace: true});
                setLoading(false);
            }
        }catch(error){
            console.error('Error:', error);
            setLoading(false);
        }
    }
    
    const validate=()=>{
        let results = true;
        if(username ==='' || username == null){
            //alert('Invalid username');
            return false;
        }
        if(email ==='' || email == null){
            //alert('Invalid password');
            return false;
        }
        if(firstName ==='' || firstName == null){
            //alert('Invalid password');
            return false;
        }
        if(lastName ==='' || lastName == null){
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
                <Link to="/home" className="nav-link">Home</Link>
            </li>
            <li>
                <Link to="/passwords" className="nav-link">Passwords</Link>
            </li>
            </ul>
            </div>
        </nav>
        <div className="card" >
            <form onSubmit={updateUser}>
                <h1>Update Details</h1>
                <div className="input-box"><input type="text" placeholder="Username" value={username} onChange={(e)=>setUsername(e.target.value)} onInput={btnColor()}></input><i class='bx bx-user'></i></div>
                <div className="input-box"><input type="email" placeholder="Email" value={email} onChange={(e)=>setEmail(e.target.value)} onInput={btnColor()}></input><i class='bx bx-envelope'></i></div>
                <div className="input-box"><input type="text" placeholder="First Name" value={firstName} onChange={(e)=>setFirstName(e.target.value)} onInput={btnColor()}></input><i class='bx bx-user'></i></div>
                <div className="input-box"><input type="text" placeholder="Last Name" value={lastName} onChange={(e)=>setLastName(e.target.value)} onInput={btnColor()}></input><i class='bx bx-user'></i></div>
                <button type="submit" className="btn" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
            </form>
        </div>
        </div>
    );
}

export default Update