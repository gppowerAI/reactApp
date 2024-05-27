import React, {useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";


function UserDetails(){

    const [userData, setUserData] = useState('');
    const [loading, setLoading] = useState(false);
    const [isLoggingOut, setLogginOut] = useState(false);
    const navigate = useNavigate();

    useEffect(()=>{
        const fetchUser = async()=>{
            setLoading(true);

            try {

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

            }else{
                alert('user not captured, please login or register');
                // redirect to home page
                navigate('/login', {replace: true});
            }
        }
                
            } catch (error) {
                
            }finally{
                setLoading(false);
            }
        };
        fetchUser();
    }, []);


    const logout = async(e)=>{
        e.preventDefault();
        setLogginOut(true);

        // attaching the token
        const token = localStorage.getItem('token');

        try {
            // sending the request
            const response = await fetch('https://backend-83h2.onrender.com/api/logout/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + token
                },
            });

            if(response.status == 200){

                alert('Successfully logged out');
                // redirect to home page
                navigate('/login', {replace: true});

            }else{
                alert('something went wrong, try again');
                console.log('Login failed:', response.statusText);
            }
            
        } catch (error) {
            console.error('Error:', error);
        }

    }


    const {user} = userData || {};
    const {username} = user || {username: ''};
    const {email} = user || {email: ''};
    const {first_name} = user || {first_name: ''};
    const {last_name} = user || {last_name: ''};

    // capitalize the data
    const capitalizedUsername = username.charAt(0).toUpperCase() + username.slice(1);
    const capitalizedFirstName = first_name.charAt(0).toUpperCase() + first_name.slice(1);
    const capitalizedLastName = last_name.charAt(0).toUpperCase() + last_name.slice(1);

    return (
        <div className='user-ui'>
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
            <div className="user-data">
                <hr />
                <h2>Username: { capitalizedUsername }</h2>
                <h2>Email: {email}</h2>
                <h2>First name: {capitalizedFirstName}</h2>
                <h2>Last name: {capitalizedLastName}</h2>
                <hr />
                <p>&copy; {new Date().getFullYear()} ntsako.onlinehealth.institution.org</p>
            </div>
        </div>
    );
}
export default UserDetails