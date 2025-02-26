import './reports.css';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import logo from '/unc_logo.png';
import axios from 'axios'
import './faciformCSS.css';
import './FaciForm.css';

const Financial = () => {

   const location = useLocation();
 //   const navigate = useNavigate();
    const { userId, userInfo } = location.state || {};
    const [org_id, setOrg_id] = useState(null);
    const [orgName, setOrgName] = useState(''); 
    const [adviser, setAdviser] = useState(''); 
    const [reqdep, setReqdep] = useState('');
    const [title, setTitle] = useState('');

    //table
    const [rows, setRows] = useState([]); // Tracks financial data
    const [remaining, setRemaining] = useState(0); // Define state at top level
    const [total, setTotal] = useState(0); // Define state at top level

    
    //financial
    const [groupId, setGroupId] = useState("");
    const [fetchedData, setFetchedData] = useState([]);
    const [source, setSource] = useState('') ;

    const [date, setDate] = useState('') ;
  //  const [total, setTotal] = useState('') ;
   // const [remaining, setRemaining] = useState('') ;

    const [financialfiles, setFinancialfiles] = useState([]) ;
      const [financialfilesPreview, setFinancialfilesPreview] = useState([]) ;

      const [selectedImage, setSelectedImage] = useState(null); // Track the selected image


  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await axios.get('http://localhost:8800/organizations/');
        const organizations = response.data;
        const matchedOrg = organizations.find(org => org.user_id === userId);
        if (matchedOrg) {
          setOrg_id(matchedOrg.org_id);
          setOrgName(matchedOrg.org_name);
          setReqdep(matchedOrg.org_name); 
          console.log('Matched Organization:', matchedOrg);

          // fetch advisers and find the matching adviser
          const advisersResponse = await axios.get('http://localhost:8800/advisers/');
          const advisers = advisersResponse.data;
          const matchedAdviser = advisers.find(adviser => adviser.adv_id === matchedOrg.adv_id);
          if (matchedAdviser) {
            setAdviser(matchedAdviser.adv_name); // set the adviser's name
            console.log('Adviser found');
          } else {
            console.log('No matched adviser found');
          }
        } else {
          console.log('No matching organization found');
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    if (userId) {
      fetchOrganizations();
    }
  }, [userId]);

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };
  const handleBack = () => {
    navigate(`/guidelines/${org_id}`, { state: { userId, userInfo } });
  };

     const [dragging, setDragging] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    
    const files = Array.from(e.target.files);

    // Append new files and previews
    setFinancialfiles((prev) => [...prev, ...files]);
    setFinancialfilesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
   

  };

  //unselect selected images
  const handleRemoveImage = (indexToRemove) => {
    setFinancialfilesPreview((prevImages) =>
      prevImages.filter((_, index) => index !== indexToRemove)
    );
  };


       // Handle row deletion
  const handleDelete = (index) => {
    const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

      // Add a new row
      const addRow = () => {
        setRows([...rows, { item: "", description: "", amount: "" }]);
      };
    
      // Handle input changes
      const handleChangeRow = (index, field, value) => {
        const updatedRows = [...rows];
        updatedRows[index][field] = field === "amount" ? parseFloat(value) || 0 : value;
        setRows(updatedRows);
      };
// Function to update remaining when rows change
      useEffect(() => {
        if (rows.length > 0) {
          const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
          setRemaining(total - totalAmount);
        }
      }, [rows, total]); // Runs when `rows` or `total` changes

      const handleSubmit = async () => {
        // Ensure financialfiles is an array before iterating
        if (!financialfiles || financialfiles.length === 0) {
            alert("Please select financial files.");
            return;
        }
    
        if (!source) {
            alert("Please enter a source.");
            return;
        }
    
        if (!rows || rows.length === 0) {
            alert("No financial data to upload.");
            return;
        }
    
        try {
            // Create FormData object
            const formData = new FormData();
            financialfiles.forEach((file) => formData.append("financialfiles", file));
    
            // Append other data fields to formData
            formData.append("org_id", org_id);
            formData.append("reqdep", reqdep);
            formData.append("title", title);
            formData.append("source", source);
            formData.append("date", date);
            formData.append("total", total);
            formData.append("remaining", remaining);
            formData.append("data", JSON.stringify(rows)); // Convert `rows` array to JSON string
    
            // Send request with the correct content type
            const response = await axios.post("http://localhost:8800/uploadFinancialData", formData, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });
    
            if (response.status === 200) {
                alert("Data uploaded successfully!");
                console.log("Response:", response.data);
            }
        } catch (error) {
            console.error("Error uploading data:", error.response?.data || error.message);
            alert("Failed to upload data.");
        }
    };

    const handleImageClick = (src) => {
      setSelectedImage(src);
    };
    
    // Function to close the preview
    const handleClosePreview = () => {
      setSelectedImage(null);
    };
    
  
  const handleRemaining = () => {
    try {
      // Ensure rows is an array before calculating total amount
      if (!Array.isArray(rows)) {
        console.error("Rows is not an array.");
        return;
      }
  
      // Sum all amounts in the rows array
      const totalAmount = rows.reduce((sum, row) => sum + (row.amount || 0), 0);
  
      // Calculate remaining amount
      setRemaining(total - totalAmount);
  
    } catch (error) {
      console.error("Error calculating remaining amount:", error);
      alert("Failed to calculate remaining amount.");
    }
  };
       
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
            {userInfo && (
              <>
                <div className="profile-text">
                  <div className="user-name">
                    {reqdep}
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
    {/*
        <label for="areafinancial" className='liquidationlabel'>Liquidation of Expenses: </label><br></br>
        <textarea  className= "areafinancial" name="financial"></textarea> */}
<div className='financialdocstext'>Liquidation of Expenses: </div>
<table className="financial-table">
        <thead>
          <tr>
            <th>Item</th>
            <th>Description</th>
            <th>Amount</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, index) => (
            <tr key={index}>
              <td>
                <input
                  type="text"
                  value={row.item}
                  onChange={(e) => handleChangeRow(index, "item", e.target.value)}
                />
              </td>
              <td>
                <input
                  type="text"
                  value={row.description}
                  onChange={(e) =>
                    handleChangeRow(index, "description", e.target.value)
                  }
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.amount}
                  onChange={(e) => handleChangeRow(index, "amount", e.target.value)}
                />
     
                 
                  
              </td>
              <td>
              <button
                  onClick={() => handleDelete(index)}
                  style={{
                    backgroundColor: "#A93644",
                    color: "white",
                    border: "none",
                    padding: "5px 10px",
                    cursor: "pointer",
                    borderRadius: "4px",
                  }}
                >
                  Delete
                </button>


              </td>

            </tr>
            
          ))}
        </tbody>

      </table>
      
      <br />
      <button
        onClick={addRow}
        style={{
          color: "white",
          backgroundColor: "#2A2E3A",
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          marginRight: "10px",
        }}
      >
        Add a Row
      </button>
    
      <button
        onClick={handleRemaining}
        style={{
          color: "white",
          backgroundColor: "#A93644",
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Save
      </button>
    
      
        <br></br>
        <br></br>
        <br></br>
        <br></br>
<div className='financialdocstext'>Attach Necessary Documents Here: </div>
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
       
       <input
          type="file"
          name="evaluationfile"
            id="evaluationfile"
          onChange={handleFileChange}
          accept="image/*"
          multiple
          style={{ marginTop: '20px', marginBottom: '20px' }} 
        
        />
  <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
      {financialfilesPreview.map((src, index) => (
        <div key={index} style={{ position: "relative" }}>
          <img
            src={src}
            alt={`Preview ${index + 1}`}
            style={{
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "8px",
              cursor: "pointer",
            }}
            onClick={() => handleImageClick(src)} // Show full-size image when clicked
          />
          <button
            onClick={() => handleRemoveImage(index)}
            style={{
              position: "absolute",
              top: "1px",
              right: "5px",
              background: "none",
              color: "white",
              border: "none",
              borderRadius: "50%",
              width: "20px",
              height: "20px",
              fontSize: "14px",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>

    {/* Full Image Preview Modal */}
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
            maxWidth: "120%",
            maxHeight: "90%",
            borderRadius: "8px",
            boxShadow: "0 4px 10px rgba(255, 255, 255, 0.3)",
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
       &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
         <button
        onClick={handleSubmit}
        style={{
          color: "white",
          backgroundColor: "#A93644",
          padding: "8px 12px",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
      >
        Submit Data
      </button>
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



export default Financial;