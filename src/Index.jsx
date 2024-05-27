import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
function Static(){
    // button styling
    const styles = {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginTop: "10px",
        marginLeft: "10px",
        borderRadius: "15px",
        border: "none",
        backgroundColor: "rgba(255, 255, 255, 0.75)",
        padding: "15px",
        cursor: "pointer",
        fontFamily: "Arial, Helvetica, sans-serif",
        fontSize: "20px",
        fontWeight: "bold",
        color: "#333",
        textDecoration: "none",
        marginBottom: "12px",
        margin: '25px'
    }

    // button tag styling
    const tagStyle = {
        color: "#333",
        textDecoration:"none",
        fontWeight: "600",
    }

    // nav bar styling
    const navStyles = {
        padding: "10px",
        display: "inline-block"
    }


    return(
        <>
        <div className="welcome-screen">
            <div className="welcome-content">
            <nav className="nav-bar">
            <div id="navbar">
            <ul>
            <li>
                <Link to="/contacts" className="nav-link" activeClassName="active">Contacts</Link>
            </li>
            <li>
                <Link to="/about" className="nav-link" activeClassName="active">About</Link>
            </li>
            </ul>
            </div>
        </nav>
            <h1>Online Health self Check</h1>
            <h2>Health is wealth, be up to date with your health, click below to proceed</h2>
            <button className="welcome-button" style={styles}><p><a href="/login" style={tagStyle}>Get Started</a></p></button>
            </div>
            <br></br>
        </div>
        </>
    );

}

export default Static

/*
className="welcome-button" 

.container{
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    background-image: url('./assets/images/wallpapersden.com_gradient-4k_4243x2387.jpg');
    background-size: cover;
}

.container h1, h2{
    color: aliceblue;
    padding: 10px;
}
.container h1{
    justify-content: center;
    align-items: center;
}

.container h2 {
    justify-content: center;
    align-items: center;
}

.container > div {
    display: flex;
    flex-direction: column;
    align-items: center;

}

.welcome-button{
    justify-content: center;
    align-items: center;
}

.welcome-button {
    margin-top: 10px;
    border-radius: 15px;
    border: none;
    background-color: rgba(255, 255, 255, 0.75);
    padding: 15px;
    cursor: pointer;
    font-family: Arial, Helvetica, sans-serif;
    font-size: 15px;
    font-weight: bold;
    letter-spacing: 1px;
    color: #333;
}

.welcome-button p a{
    color: #333;
    text-decoration: none;
    font-weight: 600;

}

*/