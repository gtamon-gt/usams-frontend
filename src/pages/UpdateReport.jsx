import './reports.css';
//import './reportsview.css';

import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import logo from '/unc_logo.png';
import axios from 'axios'
import './faciformCSS.css';
import './FaciForm.css';

const UpdateReport = () => {
const [image, setImage] = useState([]); // First set of files
  const [imagePreview, setImagePreview] = useState([]); // Previews for the first input
  const [imagee, setImagee] = useState([]); // Second set of files
  const [imageePreview, setImageePreview] = useState([]); // Previews for the second input

   const location = useLocation();
 //   const navigate = useNavigate();
    const { userId, userInfo } = location.state || {};
    const [org_id, setOrg_id] = useState(null);
    
    const [orgName, setOrgName] = useState(''); 
    const [adviser, setAdviser] = useState(''); 
    const [reqdep, setReqdep] = useState('');

  const [title, setTitle] = useState('') ;
  const [participants, setParticipants] = useState('') ;
  const [proponents, setProponents] = useState('') ;
  const [theme, setTheme] = useState('') ;
  const [duration, setDuration] = useState('') ;
  const [planning, setPlanning] = useState('') ;
  const [during, setDuring] = useState('') ;
  const [after, setAfter] = useState('') ;
  const [resultseval, setResultseval] = useState('') ;
  const [evalfiles, setEvalfiles] = useState([]) ;
  const [evalfilesPreview, setEvalfilesPreview] = useState([]) ;
  const [documentation, setDocumentation] = useState([]) ;
  const [documentationPreview, setDocumentationPreview] = useState([]) ;

  const{fr_id} = useParams();

   const [financialfiles, setFinancialfiles] = useState([]) ;
          const [financialfilesPreview, setFinancialfilesPreview] = useState([]) ;

  const [fetchedImages, setFetchedImages] = useState([]); // Array to store multiple images
  const { reps_id } = useParams();

  const [date, setDate] = useState('') ;
      const [remaining, setRemaining] = useState(0); // Define state at top level
          const [total, setTotal] = useState(0); // Define state at top level
      const [groupId, setGroupId] = useState("");
          const [fetchedData, setFetchedData] = useState([]);
          const [source, setSource] = useState('') ;
       //   const [reps_id, setReps_id] = useState('') ;

       const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  
        const [rows, setRows] = useState([
                       { item: "", description: "", amount: "" },
                     ]);

                     const [fetchedData2, setFetchedData2] = useState([]);
                     const [rows2, setRows2] = useState([
                      { date: "", reference: "", recipient: "", amount2: "" },
                    ]);


  const [director, setDirector]= useState(null);

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

  
  const handleFileChange = (e) => {
    
    const files = Array.from(e.target.files);

    // Append new files and previews
    setEvalfiles((prev) => [...prev, ...files]);
    setEvalfilesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
   

  };

  const handleFileChange2 = (e) => {
   
    const files = Array.from(e.target.files);

    // Append new files and previews
    setDocumentation((prev) => [...prev, ...files]);
    setDocumentationPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    

  };

  const handleFileChange3 = (e) => {
   
    const files = Array.from(e.target.files);

    // Append new files and previews
    setFinancialfiles((prev) => [...prev, ...files]);
    setFinancialfilesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
    

  };

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
    navigate(`/guidelines/${orgId}`, { state: { userId, userInfo } });
  };

     const [dragging, setDragging] = useState(false);

  const navigate = useNavigate();

   const [toggle, setToggle] = useState(1);
  
      function updateToggle(reps_id) {
          setToggle(reps_id)
      }

      const handleChange = (e) => {
   
        const{value, checked} = e.target
      
      };

      //fetch financial records
      useEffect(() => {
        if (!reps_id) return;
    
        console.log("Fetching data for ID:", reps_id);
      
        axios.get(`http://localhost:8800/financial_records/fetch/${reps_id}`)
            .then((res) => {
                console.log("Fetched Data:", res.data);
                if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                    setRows(res.data); // ✅ Set rows correctly
                } else {
                    setRows([]); // Reset if no data is found
                }
            })
            .catch((err) => console.error("Error fetching data:", err));
    }, [reps_id]);

    //fetch financial statements
    useEffect(() => {
      if (!reps_id) return;
  
      console.log("Fetching data for ID:", reps_id);
    
      axios.get(`http://localhost:8800/financial_statements/fetch/${reps_id}`)
          .then((res) => {
              console.log("Fetched Data:", res.data);
              if (res.data && Array.isArray(res.data) && res.data.length > 0) {
                  setRows2(res.data); // ✅ Set rows correctly
              } else {
                  setRows2([]); // Reset if no data is found
              }
          })
          .catch((err) => console.error("Error fetching data:", err));
  }, [reps_id]);


      //fetch the data from accomplishment table
      useEffect(() => {
        console.log("Fetching data for ID:", reps_id);
      
        axios
          .get(`http://localhost:8800/accomplishment/${reps_id}`)
          .then((res) => {
            console.log("Fetched Data:", res.data);
      
            // Validate response data structure
            if (res.data && Array.isArray(res.data) && res.data.length > 0) {
              setTitle(res.data[0].title);
              setTheme(res.data[0].theme);
              setParticipants(res.data[0].participants);
              setProponents(res.data[0].proponents);
              setDuration(res.data[0].duration);
              setPlanning(res.data[0].planning);
              setDuring(res.data[0].during);
              setAfter(res.data[0].after);
              setResultseval(res.data[0].resultseval);

              setSource(res.data[0].source);
              setTotal(res.data[0].total);
              setRemaining(res.data[0].remaining);
      
              // Parse evalfiles and documentations
              const parsedImages = res.data.map((imageObj) => {
                const evalfiles1 = imageObj.evalfiles
                  ?.replace(/[\[\]"]/g, "")
                  .split(",")
                  .map((img) => img.trim());
      
                const documentations = imageObj.documentation
                  ?.replace(/[\[\]"]/g, "")
                  .split(",")
                  .map((img) => img.trim());

                  const financialfiles1 = imageObj.financialfiles
                  ?.replace(/[\[\]"]/g, "")
                  .split(",")
                  .map((img) => img.trim());
      
                return { evalfiles1, documentations, financialfiles1 };
              });
      
              setFetchedImages(parsedImages);
            } else {
              console.warn("Unexpected response format or empty data:", res.data);
            }
          })
          .catch((err) => {
            console.error("Error fetching data:", err);
          });
      }, [reps_id]);

      //submit updated records
      // Handle form submission
const handleUpload = () => {
  if (!title || !theme || !participants || !duration) {
      alert("Please fill in all required fields.");
      return;
  }

  const formData = new FormData();
  const fields = { org_id, reqdep, title, participants, proponents, theme, duration, planning, during, after, resultseval, source, total, remaining };
  
  Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
          formData.append(key, value);
      }
  });

  formData.append("records", JSON.stringify(rows));
  formData.append("records2", JSON.stringify(rows2));

  (evalfiles ?? []).forEach((file) => formData.append("evalfiles", file));
  (documentation ?? []).forEach((file) => formData.append("documentation", file));
  (financialfiles ?? []).forEach((file) => formData.append("financialfiles", file));

  axios.post(`http://localhost:8800/accomplishment/update/${reps_id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
  })
  .then((res) => {
      alert("Form Update Successful!");
  })
  .catch((err) => {
      console.error("Update failed:", err.response?.data?.error || err.message);
      alert("Form update failed. Check the console for details.");
  });
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
    
          const [selectedImage1, setSelectedImage1] = useState(null); // Track selected image
          
          // Function to open image preview
          const handleImageClick1 = (src) => {
            setSelectedImage1(src);
          };
          
          // Function to close the preview
          const handleClosePreview1 = () => {
            setSelectedImage1(null);
          };
          
          // Close preview when pressing the Escape key
          useEffect(() => {
            const handleKeyDown = (event) => {
              if (event.key === "Escape") {
                handleClosePreview1();
              }
            };
            
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
          }, []);

          const [selectedImage2, setSelectedImage2] = useState(null); // Track selected image
          
          // Function to open image preview
          const handleImageClick2 = (src) => {
            setSelectedImage2(src);
          };
          
          // Function to close the preview
          const handleClosePreview2 = () => {
            setSelectedImage2(null);
          };
          
          // Close preview when pressing the Escape key
          useEffect(() => {
            const handleKeyDown = (event) => {
              if (event.key === "Escape") {
                handleClosePreview2();
              }
            };
            
            window.addEventListener("keydown", handleKeyDown);
            return () => window.removeEventListener("keydown", handleKeyDown);
          }, []);


          //delete fetched image
          const handleDeleteImage = async (imgIndex, imageName) => {
            try {
                if (!reps_id) {
                    console.error("reps_id is missing or invalid.");
                    alert("Error: Missing reps_id.");
                    return;
                }
        
                const response = await axios.delete(`http://localhost:8800/deleteimage2/${reps_id}/${imageName}`);
        
                if (response.status === 200) {
                    console.log("Image deleted successfully:", response.data);
        
                    // Remove the image from fetchedImages state
                    setFetchedImages(prevImages =>
                        prevImages.map(imgSet => ({
                            ...imgSet,
                            evalfiles1: imgSet.evalfiles1.filter(file => file !== imageName)
                        }))
                    );
                }
            } catch (error) {
                console.error("Error deleting image:", error.response?.data || error.message);
                alert("Failed to delete image.");
            }
        };

        //delete fetched image documentation
        const handleDeleteImage2 = async (imgIndex, imageName) => {
          try {
              if (!reps_id) {
                  console.error("reps_id is missing or invalid.");
                  alert("Error: Missing reps_id.");
                  return;
              }
      
              const response = await axios.delete(`http://localhost:8800/deleteimage3/${reps_id}/${imageName}`);
      
              if (response.status === 200) {
                  console.log("Image deleted successfully:", response.data);
      
                  // Remove the image from fetchedImages state
                  setFetchedImages(prevImages =>
                      prevImages.map(imgSet => ({
                          ...imgSet,
                          documentations: imgSet.documentations.filter(file => file !== imageName) // ✅ Fixed the incorrect reference
                      }))
                  );
              }
          } catch (error) {
              console.error("Error deleting image:", error.response?.data || error.message);
              alert("Failed to delete image.");
          }
      };

       //delete fetched image financialfiles
       const handleDeleteImage3 = async (imgIndex, imageName) => {
        try {
            if (!reps_id) {
                console.error("reps_id is missing or invalid.");
                alert("Error: Missing reps_id.");
                return;
            }
    
            const response = await axios.delete(`http://localhost:8800/deleteimage4/${reps_id}/${imageName}`);
    
            if (response.status === 200) {
                console.log("Image deleted successfully:", response.data);
    
                // Remove the image from fetchedImages state
                setFetchedImages(prevImages =>
                    prevImages.map(imgSet => ({
                        ...imgSet,
                        financialfiles1: imgSet.financialfiles1.filter(file => file !== imageName) // ✅ Fixed the incorrect reference
                    }))
                );
            }
        } catch (error) {
            console.error("Error deleting image:", error.response?.data || error.message);
            alert("Failed to delete image.");
        }
    };

       
      // Handle row deletion
      const handleDelete = async (indexToRemove) => {
        try {
          const recordToDelete = rows[indexToRemove]; // Get the specific record
          if (!recordToDelete || !recordToDelete.fr_id) {
            console.error("Error: Record ID is missing.");
            return;
          }
      
          await axios.delete(`http://localhost:8800/financial_records/${recordToDelete.fr_id}`);
      
          // Only update state after successful deletion
          setRows((prevData) => prevData.filter((_, index) => index !== indexToRemove));
      
        } catch (error) {
          console.error("Error deleting financial record:", error);
        }
      };

      // Handle row deletion
      const handleDelete2 = async (indexToRemove) => {
        try {
          const recordToDelete = rows2[indexToRemove]; // Get the specific record
          if (!recordToDelete || !recordToDelete.fs_id) {
            console.error("Error: Record ID is missing.");
            return;
          }
      
          await axios.delete(`http://localhost:8800/financial_statements/${recordToDelete.fs_id}`);
      
          // Only update state after successful deletion
          setRows2((prevData) => prevData.filter((_, index) => index !== indexToRemove));
      
        } catch (error) {
          console.error("Error deleting financial record:", error);
        }
      };
      
    

// Sync rows with fetched data after changes
useEffect(() => {
    setRows(fetchedData);
}, [fetchedData]);

       // Function to update remaining when rows change
              useEffect(() => {
                if (rows.length > 0) {
                  const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
                   setRemaining(total - totalAmount);
                }
              }, [rows, total]); // Runs when `rows` or `total` changes

      
    
      // Add a new row
      const addRow = () => {
        setRows([...rows, { item: "", description: "", amount: "" }]);
    };
    // Function to update an existing row
const updateRow = (index, updatedData) => {
  setRows((prevRows) => prevRows.map((row, i) => (i === index ? updatedData : row)));
};

// Handle editing a row
const handleEdit = (index) => {
  setSelectedRowIndex(index);
  setFormData(rows[index]);
};

    
      // Handle input changes
      // Handle input changes
      const handleChangeRow = (index, field, value) => {
        setRows((prevRows) => {
            return prevRows.map((row, i) =>
                i === index ? { ...row, [field]: field === "amount" ? parseFloat(value) || 0 : value } : row
            );
        });
    };

    //FOR FETCH FINANCIAL STATEMENTS

    // Sync rows with fetched data after changes
useEffect(() => {
  setRows2(fetchedData2);
}, [fetchedData2]);
  
    // Add a new row
    const addRow2 = () => {
      setRows2([...rows2, { date: "", reference: "", recipient: "", amount2: "" }]);
  };
  // Function to update an existing row
const updateRow2 = (index, updatedData) => {
setRows2((prevRows2) => prevRows2.map((row2, i) => (i === index ? updatedData : row2)));
};

// Handle editing a row
const handleEdit2 = (index) => {
setSelectedRowIndex(index);
setFormData(rows[index]);
};

// Handle input changes
const handleChangeRow2 = (index, field, value) => {
  setRows2((prevRows2) => {
      return prevRows2.map((row2, i) =>
          i === index ? { ...row2, [field]: field === "amount" ? parseFloat(value) || 0 : value } : row2
      );
  });
};
  
    

      const handleRemaining = () => {
        try {
          // Ensure rows is an array before calculating total amount
          if (!Array.isArray(fetchedData)) {
            console.error("Rows is not an array.");
            return;
          }
      
          // Sum all amounts in the rows array
          const totalAmount = fetchedData.reduce((sum, row) => sum + (row.amount || 0), 0);
      
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
                    {userInfo.org_name}
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
        <h1 className="text1reports">ACCOMPLISHMENT REPORTS <a  className="submitreportbtn1" onClick={handleUpload}>Submit Reports </a></h1>
       
        <hr className="hr1reports"></hr>

<br></br>
        <div className='tabsreports'>

<div className='tabreport' onClick={() => updateToggle(1)}>I. Details </div>

<div className='tabreport' onClick={() => updateToggle(2)}>II. Narrative Report  </div>

<div className='tabreport' onClick={() => updateToggle(3)}>III. Financial Report </div>

<div className='tabreport' onClick={() => updateToggle(4)}>IV. Evaluation </div>

<div className='tabreport' onClick={() => updateToggle(5)}>V.  Documentation </div>


</div>

        <div className="main-containerreports">
          <div className="guidelineform">

           
          <div >
           

            <div>

                <div className={toggle === 1 ? "show-content" : "content"}>

                

                    <div className="subtext1reports">I. &nbsp;&nbsp;&nbsp;  DETAILS OF THE ACTIVITY:
                    <a className="reportnextbutton1"  onClick={() => updateToggle(2)}  >  Next  </a>
                    </div>

                    <div className="detailsform">
                        <div className='col1details'>

                            <label for="title" className='titlelabel'>TITLE:</label>
                            <input type="text" id="orgidfaci" name="reqdep" className="title"
                            value={title} 
                            onChange={e => setTitle(e.target.value)} readOnly></input>

<label for="title" className='durationlabel'>DATE:</label>
                            <input type="text" id="orgidfaci" name="reqdep" className="title"
                            value={duration} 
                            onChange={e => setDuration(e.target.value)} readOnly></input>
                            



                        </div>

                        <div className='col1details'>

                            <label for="title" className='participantslabel1'>PARTICIPANTS:</label>
                            <input type="text" id="orgidfaci" name="reqdep" className="title"
                           value={participants} 
                           onChange={e => setParticipants(e.target.value)} readOnly></input>


<label for="title" className='themelabel'>VENUE:</label>
                            <input type="text" id="orgidfaci" name="reqdep" className="title"
                            value={theme} 
                            onChange={e => setTheme(e.target.value)} readOnly></input>


                        </div>

                        <div className='col1details'>

                            <label for="title" className='proponentslabel'>PROPONENTS:</label>
                            <input type="text" id="orgidfaci" name="reqdep" className="title"
                            value={proponents} 
                            onChange={e => setProponents(e.target.value)} readOnly></input>



                        </div>

                        

                    </div>

                    

                </div>

                

                <div className={toggle === 2 ? "show-content" : "content"}>

              

                <div className="subtext1reports">II. &nbsp;&nbsp;&nbsp; NARRATIVE REPORT:
                <a className="reportbackbutton"  onClick={() => updateToggle(1)}  >  Previous  </a>
                <a className="reportnextbutton"  onClick={() => updateToggle(3)}  >  Next  </a>
        </div>

        <div className="detailsform">
          
        <label for="areafinancial" className='narrativelabel'>Planning and Preparation: </label><br></br>
        <textarea  className= "areafinancial" name="financial" value={planning} 
         onChange={e => setPlanning(e.target.value)}></textarea>
<br></br>
<br></br>
        <label for="areafinancial" className='narrativelabel'>During the Event: </label><br></br>
        <textarea  className= "areafinancial" name="financial" value={during} 
         onChange={e => setDuring(e.target.value)}></textarea>
        <br></br>
<br></br>
        <label for="areafinancial" className='narrativelabel'>After the Event: </label><br></br>
        <textarea  className= "areafinancial" name="financial" value={after} 
         onChange={e => setAfter(e.target.value)}></textarea>

          
       </div>

       

                </div>

                <div className={toggle === 3 ? "show-content" : "content"}>

                
                    
                <div className="subtext1reports">III. &nbsp;&nbsp;&nbsp; FINANCIAL REPORT:
                <a className="reportbackbutton"  onClick={() => updateToggle(2)}  >  Previous  </a>
                <a className="reportnextbutton"  onClick={() => updateToggle(4)}  >  Next  </a>
        </div>

        <div className="detailsform">
          <div className='col1details'>

          <label for="title" className='sourcefundlabel'>Source of Fund:</label>
          <input type="text" id="orgidfaci" name="reqdep" className= "title"  value={source} 
                            onChange={e => setSource(e.target.value)}  
       ></input>
<label for="title" className='totalfundlabel'>Total Fund:</label> 
          <input type="text" id="orgidfaci" name="reqdep" className= "title"  value={total} 
                            onChange={e => setTotal(e.target.value)} 
       ></input>
    <br></br>
    <br></br>
    <br></br>
    <div className='financialdocstext'>Less: Expenses </div>
   
      <table className="financial-table">
  <thead>
    <tr>
      <th>Item</th>
      <th>Quantity</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {rows.length > 0 ? (
      rows.map((row, index) => (
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
              onChange={(e) => handleChangeRow(index, "description", e.target.value)}
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
      ))
    ) : (
      <tr>
        <td colSpan="4">No data found</td>
      </tr>
    )}
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

    <br/>
    <br/>
<label for="title" className='sourcefundlabel'>Remaning Balance:</label>
          <input type="text" id="orgidfaci" name="reqdep" className= "title"  value={remaining} 
                            onChange={e => setRemaining(e.target.value)} 
       ></input>
        <br></br>
        <br></br>
        <div className='financialdocstext'>Financial Statements: </div>
      
        <table className="financial-table">
  <thead>
    <tr>
      <th>Date</th>
      <th>Reference No.</th>
      <th>Recipient</th>
      <th>Amount</th>
      <th>Actions</th>
    </tr>
  </thead>
  <tbody>
    {rows2.length > 0 ? (
      rows2.map((row2, index) => (
        <tr key={index}>
          <td>
            <input
              type="date"
              value={row2.date}
              onChange={(e) => handleChangeRow2(index, "date", e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={row2.reference}
              onChange={(e) => handleChangeRow2(index, "reference", e.target.value)}
            />
          </td>
          <td>
            <input
              type="text"
              value={row2.recipient}
              onChange={(e) => handleChangeRow2(index, "recipient", e.target.value)}
            />
          </td>
          <td>
            <input
              type="number"
              value={row2.amount2}
              onChange={(e) => handleChangeRow2(index, "amount2", e.target.value)}
            />
          </td>
          <td>
            <button
              onClick={() => handleDelete2(index)}
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
      ))
    ) : (
      <tr>
        <td colSpan="4">No data found</td>
      </tr>
    )}
  </tbody>
</table>

    <br />
    <button
      onClick={addRow2}
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

        <br></br>
        <br></br>
<div className='financialdocstext'>Attach Supporting Documents Here: </div>
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
          onChange={handleFileChange3}
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
            onClick={() => handleImageClick2(src)} // Show full-size image when clicked
          />
      
        </div>
      ))}
    </div>

    {fetchedImages.length > 0 ? (
  fetchedImages.map((imgSet, index) => (
    <div key={index} style={{ marginBottom: "20px" }}>
      {/* Render images from the "images" array */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {imgSet.financialfiles1 &&
          imgSet.financialfiles1.map((financialfiles1, imgIndex) => (
            <div
              key={`financialfiles-${index}-${imgIndex}`}
              style={{ position: "relative", display: "inline-block" }} // ✅ FIXED
            >
              <img
                src={`http://localhost:8800/uploads/${financialfiles1}`}
                alt={`Fetched Image ${imgIndex + 1}`}
                style={{
                  width: "200px",
                  margin: "10px 0",
                  borderRadius: "8px",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                  cursor: "pointer",
                }}
                onClick={() =>
                  handleImageClick2(`http://localhost:8800/uploads/${financialfiles1}`)
                }
              />
              {/* Delete Button */}
              <button
                onClick={() => handleDeleteImage3(imgIndex, financialfiles1)} // ✅ FIXED PARAMETER
                style={{
                  position: "absolute",
                  top: "5px", // ✅ ADJUSTED
                  right: "5px", // ✅ ADJUSTED
                  background: "red",
                  color: "white",
                  border: "none",
                  borderRadius: "50%",
                  width: "25px", // ✅ ADJUSTED FOR VISIBILITY
                  height: "25px", // ✅ ADJUSTED FOR VISIBILITY
                  fontSize: "16px", // ✅ ADJUSTED
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                ✕
              </button>
            </div>
          ))}
      </div>
    </div>
  ))
) : (
  <p>No Attachments</p>
)}

{/* Image Preview Modal */}
{selectedImage2 && (
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
        onClick={handleClosePreview2} // Close when clicking outside the image
      >
         <img
          src={selectedImage2}
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

      


          </div>


       </div>


                </div>

                <div className={toggle === 4 ? "show-content" : "content"}>
              
                <div className="subtext1reports">IV. &nbsp;&nbsp;&nbsp; SUMMARY OF EVALUATION:
                <a className="reportbackbutton4"  onClick={() => updateToggle(3)}  >  Previous  </a>
                <a className="reportnextbutton"  onClick={() => updateToggle(5)}  >  Next  </a>
        </div>
        
        <div className="detailsform">
          <div className='col1details'>

         
        <label for="areafinancial" className='liquidationlabel'>Results of Evaluation Form: </label><br></br>
        <textarea  className= "areafinancial" name="financial" value={resultseval} 
         onChange={e => setResultseval(e.target.value)}></textarea>

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
        {evalfilesPreview.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onClick={() => handleImageClick2(`http://localhost:8800/uploads/${evalfiles}`)}
            />
          </div>
        ))}

{selectedImage2 && (
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
        onClick={handleClosePreview2} // Close when clicking outside the image
      >
         <img
          src={selectedImage2}
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

<div>
    
{fetchedImages.length > 0 ? (
  fetchedImages.map((imgSet, index) => (
    <div key={index} style={{ marginBottom: "20px" }}>
      {/* Render images from the "evalfiles1" array */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {imgSet.evalfiles1?.map((evalfiles, imgIndex) => (
          <div key={`evalfiles-${index}-${imgIndex}`} style={{ position: "relative" }}>
            <img
              src={`http://localhost:8800/uploads/${evalfiles}`}
              alt={`Fetched Image ${imgIndex + 1}`}
              style={{
                width: "200px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick(`http://localhost:8800/uploads/${evalfiles}`)}
            />
            <button
              onClick={() => handleDeleteImage(imgIndex, evalfiles)} // ✅ FIXED
              style={{
                position: "absolute",
                top: "8px",
                right: "5px",
                background: "red",
                color: "white", // ✅ FIXED VISIBILITY
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        )) ?? []}
      </div>
    </div>
  ))
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
 
      </div>

          </div>
    
       </div>

                </div>

                <div className={toggle === 5 ? "show-content" : "content"}>
                
                <div className="subtext1reports">V. &nbsp;&nbsp;&nbsp; DOCUMENTATION:
                &nbsp;&nbsp;&nbsp; &nbsp;&nbsp;&nbsp;
                
                <a className="reportbackbutton"  onClick={() => updateToggle(4)}  >  Previous  </a>
                <a className="reportnextbutton"  onClick={() => updateToggle(6)}  >  Next  </a>
        </div>

        <div className="detailsform">
          <div className='col1details'>

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

<input
          type="file"
          name="documentation"
            id="documentation"
       //   onInput={handleChange}
          onChange={handleFileChange2}
          accept="image/*"
          multiple
          style={{  marginTop: '20px', marginBottom: '20px' }} 
        
        />
    
    <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
        {documentationPreview.map((src, index) => (
          <div key={index}>
            <img
              src={src}
              alt={`Preview ${index + 1}`}
              style={{
                width: "100px",
                height: "100px",
                objectFit: "cover",
                borderRadius: "8px",
              }}
              onClick={() => handleImageClick1(`http://localhost:8800/uploads/${documentations}`)}
            />
          </div>
        ))}
      </div>

        <div>
    
        {fetchedImages.length > 0 ? (
  fetchedImages.map((imgSet, index) => (
    <div key={index} style={{ marginBottom: "20px" }}>
      {/* Render images from the "documentations" array */}
      <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
        {imgSet.documentations?.map((documentation, imgIndex) => (
          <div key={`documentations-${index}-${imgIndex}`} style={{ position: "relative" }}>
            <img
              src={`http://localhost:8800/uploads/${documentation}`}
              alt={`Fetched Image ${imgIndex + 1}`}
              style={{
                width: "200px",
                margin: "10px 0",
                borderRadius: "8px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                cursor: "pointer",
              }}
              onClick={() => handleImageClick1(`http://localhost:8800/uploads/${documentation}`)}
            />
            <button
              onClick={() => handleDeleteImage2(imgIndex, documentation)} // ✅ Fixed the argument list
              style={{
                position: "absolute",
                top: "8px",
                right: "5px",
                background: "red",
                color: "white", // ✅ Ensures visibility
                border: "none",
                borderRadius: "50%",
                width: "20px",
                height: "20px",
                fontSize: "14px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              ✕
            </button>
          </div>
        )) ?? []}
      </div>
    </div>
  ))
) : (
  <p>No images found</p>
)}

    {/* Image Preview Modal */}
{selectedImage1 && (
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
        onClick={handleClosePreview1} // Close when clicking outside the image
      >
         <img
          src={selectedImage1}
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
    
    
      </div>

          </div>

         
    
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



export default UpdateReport;