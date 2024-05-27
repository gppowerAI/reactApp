import { Link } from "react-router-dom";

function Contacts(){

    return(
        <div>
            <nav className="nav-bar">
                <div id="navbar">
                    <ul>
                        <li>
                            <Link to="/" className="nav-link">Log IN</Link>
                        </li>
                        <li>
                            <Link to="/about" className="nav-link">About</Link>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="contacts-wrapper">
                <div className="contacts-content">
                    <h1>
                        CONTACT US
                    </h1>
                    <h2>
                        To communicate with with us you can use the following contact details
                    </h2>
                    <h2>email: natasha@mail.com</h2>
                    <h2>call/text: +27 (12) 234 567</h2>
                    <p>&copy; {new Date().getFullYear()+' '+location.host}</p>
                </div>
            </div>
        </div>
    );

}
export default Contacts