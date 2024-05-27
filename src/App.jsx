import {BrowserRouter as Router, Route, Routes} from "react-router-dom"
import Login from "./Login"
import Register from "./Register"
import Update from "./Update"
import Check from "./Diagnosis"
import About from "./About"
import Contacts from "./Contacts"
//import Index from "./Index"
import HomePage from "./Home"
import Passwords from "./Passwords"
import History from "./History"
import NewUser from "./New"

const LogOut = function(div){
    setTimeout(()=>{
        const navbar = document.querySelector('#navbar');
        if(navbar){
            const navs = document.querySelectorAll('.nav-link');
            for(let nav of navs){
                if(!nav)
                    continue;
                
                let t = nav.textContent.toLowerCase().trim();
                if(t == 'logout')
                    nav.classList.add('nav-lo');
                else if(t == 'me')
                    nav.parentElement.remove();
                else if(t == 'start')
                    nav.textContent = 'Log IN';
            }
        }
    })
    
    return div;
}

function App() {

// Initializes the routes/redirects of the pages in the website

  return (
    <div className="App">
      <meta name = "viewport" content = "width = device-width, initial-scale = 1"></meta>
      
      <Router>
        <Routes>
          <Route path="/" element={LogOut(<Login/>)}/>
          <Route path="/login" element={LogOut(<Login/>)}/>
          <Route path="/register" element={LogOut(<Register/>)}/>
          <Route path="/update" element={LogOut(<Update/>)}/>
          <Route path="/diagnose" element={LogOut(<Check/>)}/>
          <Route path="/about" element={LogOut(<About/>)}/>
          <Route path="/contacts" element={LogOut(<Contacts/>)}/>
          <Route path="/home" element={LogOut(<HomePage/>)}/>
          <Route path="/passwords" element={LogOut(<Passwords/>)}/>
          <Route path="/history" element={LogOut(<History/>)}/>
          <Route path="/new_user" element={LogOut(<NewUser/>)}/>
        </Routes>
      </Router>
    </div>
  )
}

export default App;