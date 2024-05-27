import React, {useEffect, useState} from "react";
import { Link, useNavigate } from "react-router-dom";
//import { formatDistanceToNow } from 'date=fns';

function History(){

    const [healthData, setHealthData] = useState('');
    const [deletedItem, setDeletedItem] = useState([]);
    const [selectedData, setSelecedData] = useState(null);
    const [logginout, setLogginOut] = useState(false);
    const [isDelete, setIsDelete] = useState(false);
    const navigate = useNavigate();


    useEffect(()=> {
        const fetchData = async()=>{
            try {

                const token = localStorage.getItem('token');

                const dataResponse = await fetch('https://backend-83h2.onrender.com/api/data/',{
                    method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + token
                },
                });

                if(dataResponse.status == 200){

                    const jsonData = await dataResponse.json()
                    setHealthData(jsonData);
                }
                
            } catch (error) {
                
            }
        };
        fetchData();
    }, []);


    const deleteData = async(dataId)=>{
        setIsDelete(true);

        // attaching the token
        const token = localStorage.getItem('token');

        try {
            // sending the request
            const deleteResponse = await fetch(`https://backend-83h2.onrender.com/api/data/${dataId}/`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'token ' + token
                },
            });

            console.log(deleteResponse.statusText);
            const back = await deleteResponse.json();
            console.log(back);

            if(deleteResponse.status == 200){



                alert('Item deleted');

                setDeletedItem(prevItem=> {const index = prevItem.findIndex(item=> item.dataId === dataId);
                    if(index !== -1){
                        const updatedItems = [...prevItem];
                        updatedItems.splice(index, 1);
                        return updatedItems;
                    }
                    return prevItem;
                });

                // redirect to history page
                navigate('/history', {replace: true});

            }else{
                alert('something went wrong, try again');
                console.log('delete failed:', response.statusText);
            }
            
        } catch (error) {
            //console.error('Error:', error);
        } finally{
            setIsDelete(false);
        }

    };
    
    const handleClick = (health)=>{

        setSelecedData(health);
        const dialog = document.getElementById('health-dialog');
        dialog.showModal();

    };

    const handleClose=()=>{
        setSelecedData(null);
        const dialog = document.getElementById('health-dialog');
        dialog.close();
    };

    const formatDate = (dateString)=>{
        const date = new Date(dateString);
        return new Intl.DateTimeFormat('en-US',{
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            hour12: false,
            timeZone: 'UTC',
        }).format(date);
    }

    const dialogStyle = {
        position: "fixed",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        backgroundColor: "aliceblue",
        border: "15px",
        zIndex: "1000",
        overflowY: "auto",
        maxHeight: "60%",
        maxWidth: "350px",
        padding: "10px",
        borderRadius: "15px",
    }

    const pStyle = {
        marginBotton: "10px",
        fontSize: "20px",
        color: "black"
    }

    const lastPStyle = {
        marginBotton: "20px",
        fontSize: "20px",
    }

    const h2Style = {
        alignItems: "center",
        justifyContent: "center",
        marginBotton: "5px",
        color: "black"
    }

    const closeButton = {
        color: "#333",
        textDecoration:"none",
       fontWeight: "100",
       marginRight: "10px",
       borderRadius: "5px",
       marginTop: "10px",
       height: "30px",
       width: "45%",
       fontFamily: "Arial, Helvetica, sans-serif",
       border: "none",
       cursor: "pointer",    
    }

    const deleteButton = {
        backgroundColor: "red",
        color: "aliceblue",
        textDecoration:"none",
       fontWeight: "100",
       margin: "10px",
       borderRadius: "5px",
       height: "30px",
       width: "15%",
       fontFamily: "Arial, Helvetica, sans-serif",
       border: "none",
       cursor: "pointer",
    }

    return(
        <div className="history">
            <div className="history-content">
            <nav className="nav-bar">
            <div id="navbar">
            <ul>
            <li>
                <Link to="/home" className="nav-link">Home</Link>
            </li>
            <li>
                <Link to="/diagnose" className="nav-link">Diagnose</Link>
            </li>
            <li>
                <Link to="/update" className="nav-link">Update</Link>
            </li>
            </ul>
            </div>
        </nav>
            <h1>Your history</h1>
            <div className="health-data">
                <div className="data-box">
                <ul className="history20">
                    {healthData.length > 0 && healthData.map((health)=>(
                        <li key={health.id} onClick={()=>handleClick(health)}>
                            <h2>According to your submitted data, {health.diabetes_prediction}</h2>
                            <p>Submitted on {formatDate(health.date_created)}</p>
                            <button style={deleteButton} onClick={()=> deleteData(health.id.toString())}>Delete</button>
                            
                        </li>
                    ))}
                </ul>
                </div>
            </div>
            <dialog id="health-dialog" style={dialogStyle}>
                    <h2 style={h2Style}>{isDelete ? 'Deleting data...' : 'Provided data'}</h2>
                    {selectedData && (
                        <>
                        <p style={pStyle}>Age: {selectedData.age}</p>
                        <p style={pStyle}>Height: {selectedData.height}</p>
                        <p style={pStyle}>Weight: {selectedData.weight}</p>
                        /*<p style={pStyle}>Pregnancies: {selectedData.pregnancies}</p>*/
                        <p style={pStyle}>Glucose level: {selectedData.glucose_level}</p>
                        <p style={pStyle}>Blood pressure: {selectedData.blood_pressure}</p>
                        /*<p style={pStyle}>Skin thickness: {selectedData.skin_thickness}</p>*/
                        <p style={pStyle}>Insulin level: {selectedData.insulin_level}</p>
                        <p style={lastPStyle}>Family history with diabetes: {selectedData.family_diabetes_history}</p>
                        </>
                    )}
                    <button onClick={handleClose} style={closeButton}>Close</button>
                   
            </dialog>
        </div>
        </div>
    );

}

export default History;