import { Link } from "react-router-dom";

function About(){

    return(
        <div>
            <nav className="nav-bar">
                <div id="navbar">
                    <ul>
                        <li>
                            <Link to="/" className="nav-link">Log In</Link>
                        </li>
                        <li>
                            <Link to="/contacts" className="nav-link">Contacts</Link>
                        </li>
                    </ul>
                </div>
            </nav>
        <div className="about-wrapper">
            <div className="about-content">
                <h1>ABOUT US</h1>
                <p>
                    {location.host} is a pioneering online platform dedicated to empowering individuals with the tools and resources they need to take control of their health. Our mission is to make healthcare more accessible and personalized, right at your fingertips.
                    
                    Our platform offers a unique self-diagnosing feature that allows users to understand their symptoms better and make informed decisions about their health. By combining advanced technology with medical expertise, we provide reliable, easy-to-understand health information that can guide you towards the next steps in your healthcare journey.
                    
                    Our team comprises dedicated professionals from diverse backgrounds, including experienced healthcare practitioners, data scientists, and software engineers. We are united by our commitment to improving healthcare accessibility and our belief in the power of technology to transform lives.
                    
                    At {location.host}, we prioritize your health and well-being. We understand that every individual is unique, and so is their health journey. That's why our platform is designed to provide personalized health insights based on your specific symptoms and conditions.
                    
                    Please note that while {location.host} strives to provide accurate health information, it should not replace professional medical advice, diagnosis, or treatment. Always consult with a qualified healthcare provider for any medical concerns.
                    
                    Join us in our mission to make healthcare more accessible and personalized. Together, we can create a healthier future.
                </p>
                <p>&copy; {new Date().getFullYear()+' '+location.host}</p>
            </div>
        </div>
        </div>
    );
}

export default About