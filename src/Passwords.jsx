import { Link, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";

function Passwords(){

    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [loggingOut, setLogginOut] = useState(false);
    const navigate = useNavigate();
    
    // update the password
    const updatePassowrd = async(e)=>{
        e.preventDefault();
        setLoading(true);
        if(validate()){
            const token = localStorage.getItem('token');
            if(token){
                try{
                    const response = await fetch('https://backend-83h2.onrender.com/password/change/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'token ' + token
                        },
                        body: JSON.stringify({
                            old_password: currentPassword,
                            new_password1: newPassword,
                            new_password2: confirmNewPassword
                        })
                    });
    
                    setLoading(false);
                    if(response.status == 200){
                        alert('Password successfully changed');
                        // redirect to home page
                        navigate('/login', {replace: true});
                    }else{
                        alert('something went wrong, try again');
                        console.log('Login failed:', response.statusText);
                    }
                }catch(error){
                    console.error('Error:', error);
                    setLoading(false);
                }

            } else{
                setLoading(false);
                alert("you're not logged in or registered, please login or register to use this service");
                navigate('/login', {replace: true});
            }
        }
        else
            setLoading(false);
    }

    const validate=()=>{
        if(currentPassword ==='' || currentPassword ===null){
            //alert('Invalid username');
            return false;
        }
        else if(newPassword ==='' || newPassword ===null){
            //alert('Invalid password');
            return false;
        }
        else if(confirmNewPassword ==='' || confirmNewPassword ===null){
            //alert('passwords do not match');
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
                            <Link to="/update" className="nav-link">Update</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div>
            <div className="card" >
                <form onSubmit={updatePassowrd}>
                    <h1>Update Password</h1>
                    <div className="input-box"><input type="password" placeholder="Current Password" required value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} onInput={btnColor()}></input></div>
                    <div className="input-box"><input type="password" placeholder="New Password" required value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} onInput={btnColor()}></input></div>
                    <div className="input-box"><input type="password" placeholder="Confirm Password" required value={confirmNewPassword} onChange={(e)=>setConfirmNewPassword(e.target.value)} onInput={btnColor()}></input></div>
                    <button type="submit" className="btn" disabled={loading}>{loading ? 'Updating...' : 'Update'}</button>
                </form>
            </div>
            </div>
        </div>
    );

}

export default Passwords;