import './reports.css';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import logo from '/unc_logo.png';
import axios from 'axios'
import './faciformCSS.css';
import './FaciForm.css';

const ApproveFinancialForm = () => {


   const location = useLocation();
 //   const navigate = useNavigate();
    const { userId, userInfo } = location.state || {};
    const [orgId, setOrgId] = useState(null);
    const [orgName, setOrgName] = useState(''); 
    const [reqdep, setReqdep] = useState('');

  const [title, setTitle] = useState('') ;
  const [fetchedImages, setFetchedImages] = useState([]); // Array to store multiple images

    const [financialfiles, setFinancialfiles] = useState([]) ;
        const [financialfilesPreview, setFinancialfilesPreview] = useState([]) ;

        const [date, setDate] = useState('') ;
            const [total, setTotal] = useState('') ;
            const [remaining, setRemaining] = useState('') ;
 

  // const [group_id, setGroup_id] = useState("");
      const [fetchedData, setFetchedData] = useState([]);
      const [source, setSource] = useState('') ;


  const [director, setDirector]= useState(null);

  const{group_id} = useParams();
  const{fr_id} = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dirResponse] = await Promise.all([
          axios.get('http://localhost:8800/approvers')
        
        ]);

        const approversData = dirResponse.data;

        // Find adviser based on userId
        const directorData = approversData.find(
            (director) => director.employee_position === "OSA Director"
          );
   //     const foundAdviser = directorData.find((director) => director.user_id === userId);
   if (directorData) {
    setDirector({
      dir_id: directorData.approver_key,
      dir_name: directorData.employee_name,
      sy_id: directorData.sy_id,
      user_id: directorData.user_id,
    });
  }
        setDirector(directorData);
        console.log(directorData); 

      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };
    fetchData();
  }, [userId]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };
 

     const [dragging, setDragging] = useState(false);

  const navigate = useNavigate();

   const [toggle, setToggle] = useState(1);
  
      function updateToggle(reps_id) {
          setToggle(reps_id)
      }


       useEffect(() => {
        // Ensure group_id is valid before making the request
        if (!group_id) return;
      
        console.log("Fetching data for ID:", group_id);
      
        axios
          .get(`http://localhost:8800/getFinancialData/${group_id}`)
          .then((res) => {
            console.log("Fetched Data:", res.data);
      
            // Validate response data structure
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              setTitle(res.data[0].title);
              setReqdep(res.data[0].reqdep);
              setSource(res.data[0].source);
              setDate(res.data[0].date);
              setTotal(res.data[0].total);
              setRemaining(res.data[0].remaining);
              setFetchedData(res.data);  // ✅ Fixed incorrect reference

            } else {
              console.warn("No data found for the given group_id");
              setFetchedData([]); // Ensure we reset the state if no data is found
            }


          })
          .catch((err) => {
            console.error("Error fetching data:", err);
          });
      }, [group_id]); // ✅ Only re-run when group_id changes */


      useEffect(() => {
        // Ensure group_id is valid before making the request
        if (!group_id) return;
    
        console.log("Fetching data for ID:", group_id);
    
        axios
            .get(`http://localhost:8800/getFinancialDatafiles/${group_id}`)
            .then((res) => {
                console.log("Fetched Data:", res.data);
    
                // Validate response data structure
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    const selectedRow = res.data[0]; // Select only the first row
    
                    // Parse and extract images from only this row
                    const financialfiles1 = selectedRow.financialfiles
                        ?.replace(/[\[\]"]/g, "")
                        .split(",")
                        .map((img) => img.trim());
    
                    setFetchedImages(financialfiles1 || []); // Store only this row's images
                } else {
                    console.warn("No data found for the given group_id");
                    setFetchedImages([]); // Reset images if no data is found
                }
            })
            .catch((err) => {
                console.error("Error fetching data:", err);
            });
    }, [group_id]); // ✅ Only re-run when group_id changes
    


      
        const handleDelete = (index) => {
          const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
          setRows(newRows);
        };
      
            const [rows, setRows] = useState([
              { item: "", description: "", amount: "" },
            ]);
          
            // Add a new row
            const addRow = () => {
              setRows([...rows, { item: "", description: "", amount: "" }]);
            };
          
            // Handle input changes
            const handleChangeRow = (index, field, value) => {
              const newRows = [...rows];
              newRows[index][field] = value;
              setRows(newRows);
            };

            const [selectedImage, setSelectedImage] = useState(null); // Track selected image

// Function to open image preview
const handleImageClick = (src) => {
  setSelectedImage(src);
};

// Function to close the preview
const handleClosePreview = () => {
  setSelectedImage(null);
};

// Close preview when pressing the Escape key
useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      handleClosePreview();
    }
  };
  
  window.addEventListener("keydown", handleKeyDown);
  return () => window.removeEventListener("keydown", handleKeyDown);
}, []);
      

    
  return (
    <div className="main-wrapper">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-text-section">
            <img src="/unc_logo.png" alt="Logo" className="logo-img" />
            <div className="text-section">
              <div className="one-text-section">UNIVERSITY STUDENT AFFAIRS</div>
              <div className="two-text-section">MANAGEMENT SYSTEM</div>
            </div>
          </div>
          <div className="right-section">
            <div className="ellipse-div" />
            <img className="vector-icon" loading="lazy" alt="" src="/vector.svg" />
            <img className="pfp-1-icon" loading="lazy" alt="" src="/default.png" />

            {director && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {director.employee_name}
                  </div>
                  <button className="sign-out-button" onClick={handleSignOut}>
                    SIGN OUT
                  </button>
                </div>
              </>
            )}
            
          </div>
        </div>
        <div className="navbar">
          <div className="navbar-links">
            <a href="#" className="navbar-link">Home</a>
            <a href="#" className="navbar-link">Activities</a>
            <a href="#" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>
<br></br>
<br></br>
 
       <div className="main-content">
       
        <div className='unctext'>University of Nueva Caceres</div>
        <h1 className="text1reports">FINANCIAL REPORTS</h1>
       
        <hr className="hr1reports"></hr>

<br></br>

        <div className="main-containerreports">
          <div className="guidelineform">         
          <div >
           
            <div>
           
        <div className="detailsform">
          <div className='col1details'>

          <label for="title" className='activitynamelabel' >Activity Name:</label>
          <input type="text" id="orgidfaci" name="reqdep" className= "title" value={title} 
                            onChange={e => setTitle(e.target.value)}
       ></input>

<label for="title" className='activitydatelabel'>Activity Date:</label> 
          <input type="text" id="orgidfaci" name="reqdep" className= "title" value={date} 
                            onChange={e => setDate(e.target.value)}
       ></input>

       <br></br>
    

          <label for="title" className='sourcefundlabel' >Source of Fund:</label>
          <input type="text" id="orgidfaci" name="reqdep" className= "title" value={source} 
                            onChange={e => setSource(e.target.value)}
       ></input>
<label for="title" className='totalfundlabel'>Total Fund:</label> 
          <input type="text" id="orgidfaci" name="reqdep" className= "title" value={total} 
                            onChange={e => setTotal(e.target.value)}
       ></input>
    <br></br>
    <br></br>
    <br></br>

<div className='financialdocstext'>Liquidation of Expenses: </div>
      <br></br>

    
      <table className="financial-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {fetchedData.length > 0 ? (
            fetchedData.map((row, index) => (
              <tr key={index}>
                <td>{row.item}</td>
                <td>{row.description}</td>
                <td>{row.amount}
                <br></br>
                </td>
        
              </tr>
              
            ))
            
          ) : (
            <tr>
              <td colSpan="3">No data found</td>
            </tr>
          )}
                
        </tbody>
        
      </table>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
<div className='financialdocstext'>Uploaded Attachments: </div>
        <div  className="draganddropfile"
        
        style={{
          border: dragging ? '2px dashed #4CAF50' : '2px dashed #787276',
          borderRadius: '5px',
          padding: '20px',
          textAlign: 'center',
          cursor: 'pointer',
          marginLeft: '2px'
        }}
      >
       
       {fetchedImages.length > 0 ? (
      <div style={{ marginBottom: "20px" }}>
        {/* Render images from the single set */}
        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
          {fetchedImages.map((financialfiles, imgIndex) => (
            <div key={`financialfiles-${imgIndex}`} style={{ position: "relative" }}>
              <img
                src={`http://localhost:8800/uploads/${financialfiles}`}
                alt={`Fetched Image ${imgIndex + 1}`}
                style={{
                  width: "200px",
                  margin: "10px 0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer", // Enable clicking
                }}
                onClick={() => handleImageClick(`http://localhost:8800/uploads/${financialfiles}`)}
              />
            </div>
          ))}
        </div>
      </div>
    ) : (
      <p>No Attachments</p>
    )}
 {/* Image Preview Modal */}
 {selectedImage && (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.8)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1000,
        }}
        onClick={handleClosePreview} // Close when clicking outside the image
      >
         <img
          src={selectedImage}
          alt="Full Preview"
          style={{
            maxWidth: "95vw", // Increased width for larger display
            maxHeight: "95vh", // Increased height for better visibility
            borderRadius: "10px",
            boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
            transform: "scale(1.35)", // Subtle zoom-in effect
            transition: "transform 0.2s ease-in-out", // Smooth scaling
          }}
        />
      </div>
    )}
    

 
      </div>
<br></br>
<br></br>
<br></br>
      <label for="title" className='sourcefundlabel'>Remaning Balance:</label>
          <input type="text" id="orgidfaci" name="reqdep" className= "title" value={remaining} 
                            onChange={e => setRemaining(e.target.value)}
       ></input>


          </div>


       </div>



            </div>
        </div>
  
          </div>
        </div>
      </div>

      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="foot1">09561301775 | 09071566898</div>
            <div className="foot1">J. Hernandez Ave, Naga City 4400</div>
            <div className="foot1">info@unc.edu.ph</div>
          </div>
          <div className="footer-column2">
            <img src="/osa_logo.png" alt="Logo" className="logo-img2" />
            <div>
              <div className="unc1">UNIVERSITY OF NUEVA CACERES</div>
              <div className="unc2">STUDENT AFFAIRS</div>
            </div>
          </div>
          <div className="footer-column footer-column-follow">
            <div className="followtext">Follow Us</div>
            <div>
              <img src="/fb.png" alt="Facebook" />
              <img src="/email.png" alt="Email" />
            </div>
          </div>
        </div>
        <div className="footer-row thin">
          <div>Copyright © 2023. University of Nueva Caceres. All Rights Reserved</div>
          <div>Privacy Policy</div>
        </div>
      </div>
    </div>
  );
}



export default ApproveFinancialForm;