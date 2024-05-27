import { Link, useNavigate } from "react-router-dom";
import React, {useEffect, useState} from "react";
import axios from 'axios';


function NewUser(){

    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUser = async() =>{
            setLoading(true);
            try{
                const token = localStorage.getItem('token');

                if(token){

                    const response = await fetch('https://backend-83h2.onrender.com/api/user/', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'token ' + token
                    },
                    });

                    if(response.status == 200){
                        const responseData = await response.json();
                        setUserData(responseData);
                    }else {
                        console.alert('Error fetching data:', response.statusText);
                      }
                }else{
                    alert('user not captured, please login or register');
                    // redirect to home page
                    navigate('/login', {replace: true});
                }

            }catch(error){

            }finally{
            setLoading(false)};
        };

        fetchUser();
        
    }, []);

    const {user} = userData || {};
    const {username} = user || {username: ''};

    // capitalizing the username
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);


    const logout= async()=>{

        try{
            const token = localStorage.getItem('token');

            if(token){

                const response = await fetch('https://backend-83h2.onrender.com/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + token
                },
                });

                if(response.status == 200){
                    navigate('/login', {replace: true});

                }else {
                    console.alert('Error logging out:', response.statusText);
                  }
            }else{
                
            }

        }catch(error){

        }
    }


    return(
        <div className="home-wrapper">
            <nav className="nav-bar">
            <div id="navbar">
            <ul>
            <li>
                <Link to="/home" className="nav-link">Home</Link>
            </li>
            <li>
                <Link to="/history" className="nav-link">History</Link>
            </li>
            <li>
                <Link to="/update" className="nav-link">Update</Link>
            </li>
            <li>
                <Link to="#" className="nav-link" onClick={logout}>Logout</Link>
            </li>
            </ul>
            </div>
        </nav>
        <div className="home">
            <>
                <h1>Hello {capitalizedUsername}, are you having a good day?</h1>
                <p>let's check health status?</p>
                <p>See <Link to="/diagnose" className="diagnose-link">self diagnose</Link></p>
            </>
            
        </div>
        </div>
    );
}

export default NewUser
