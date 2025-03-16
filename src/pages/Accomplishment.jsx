import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import './reports.css';
import './faciformCSS.css';
import './FaciForm.css';
import './Accomplishment.css';

const Accomplishment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo } = location.state || {};

  const [org_id, setOrg_id] = useState(null);
  const [orgName, setOrgName] = useState('');
  const [adviser, setAdviser] = useState('');
  const [reqdep, setReqdep] = useState('');

  const [title, setTitle] = useState('');
  const [participants, setParticipants] = useState('');
  const [proponents, setProponents] = useState('');
  const [theme, setTheme] = useState('');
  const [duration, setDuration] = useState('');
  const [planning, setPlanning] = useState('');
  const [during, setDuring] = useState('');
  const [after, setAfter] = useState('');
  const [resultseval, setResultseval] = useState('');
  const [evalfiles, setEvalfiles] = useState([]);
  const [evalfilesPreview, setEvalfilesPreview] = useState([]);
  const [documentation, setDocumentation] = useState([]);
  const [documentationPreview, setDocumentationPreview] = useState([]);
  const [financialfiles, setFinancialfiles] = useState([]);
  const [financialfilesPreview, setFinancialfilesPreview] = useState([]);
 
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [groupId, setGroupId] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [source, setSource] = useState('');
  const [reps_id, setReps_id] = useState('');

  const [rows, setRows] = useState([{ item: "", description: "", amount: "" }]);
  const [toggle, setToggle] = useState(1);
  const [dragging, setDragging] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImage1, setSelectedImage1] = useState(null);
  const [selectedImage2, setSelectedImage2] = useState(null);

  const [rows2, setRows2] = useState([{ date: "", reference: "", recipient: "" , amount2: "" }]);

  const{pros_key} = useParams();

  useEffect(() => {
    const fetchActivity = async () => {
      try {
        const response = await axios.get("http://localhost:8800/selected/activities/"+pros_key);
        const activities = response.data;
        const matchedOrg = activities.find(act => act.org_id === userId);
        if (matchedOrg) {
          setTitle(matchedOrg.pros_title);
          setParticipants(matchedOrg.pros_participants);
          setProponents(matchedOrg.pros_proponent);
          setDuration(new Date(matchedOrg.pros_date).toLocaleString());
          setTheme(matchedOrg.pros_venue);
        }
      } catch (error) {
        console.error('Error fetching organizations:', error);
      }
    };

    if (userId) {
      fetchActivity();
    }
  }, [userId]);

  useEffect(() => {
    if (rows.length > 0) {
      const totalAmount = rows.reduce((sum, row) => sum + (parseFloat(row.amount) || 0), 0);
      setRemaining(total - totalAmount);
    }
  }, [rows, total]);

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

          const advisersResponse = await axios.get('http://localhost:8800/advisers/');
          const advisers = advisersResponse.data;
          const matchedAdviser = advisers.find(adviser => adviser.adv_id === matchedOrg.adv_id);
          if (matchedAdviser) {
            setAdviser(matchedAdviser.adv_name);
          }
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

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setEvalfiles((prev) => [...prev, ...files]);
    setEvalfilesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleFileChange2 = (e) => {
    const files = Array.from(e.target.files);
    setDocumentation((prev) => [...prev, ...files]);
    setDocumentationPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleFileChange3 = (e) => {
    const files = Array.from(e.target.files);
    setFinancialfiles((prev) => [...prev, ...files]);
    setFinancialfilesPreview((prev) => [...prev, ...files.map((file) => URL.createObjectURL(file))]);
  };

  const handleUpload = () => {
    if (evalfiles.length === 0 || documentation.length === 0) {
      console.log("Please select files for both inputs before uploading.");
      return;
    }

    const formData = new FormData();
    evalfiles.forEach((file) => formData.append("evalfiles", file));
    documentation.forEach((file) => formData.append("documentation", file));
    financialfiles.forEach((file) => formData.append("financialfiles", file));

    formData.append("org_id", org_id);
    formData.append("reqdep", reqdep);
    formData.append("title", title);
    formData.append("participants", participants);
    formData.append("proponents", proponents);
    formData.append("theme", theme);
    formData.append("duration", duration);
    formData.append("planning", planning);
    formData.append("during", during);
    formData.append("after", after);
    formData.append("resultseval", resultseval);
    formData.append("source", source);
    formData.append("total", total);
    formData.append("remaining", remaining);
    formData.append("records", JSON.stringify(rows));
    formData.append("records2", JSON.stringify(rows2));

    axios
      .post("http://localhost:8800/accomplishment/add", formData)
      .then((res) => {
        console.log("Upload successful:", res.data);
        alert("Form Submission Successful!");
        navigate(`/activities-tab`, { state: { userId } });
      })
      .catch((err) => {
        console.error("Upload failed:", err.response?.data || err.message);
        alert("Form submission failed. Check the console for details.");
      });
  };

  const updateToggle = (id) => {
    setToggle(id);
  };
//table1
  const handleDelete = (index) => {
    const newRows = rows.filter((_, rowIndex) => rowIndex !== index);
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { item: "", description: "", amount: "" }]);
  };

  const handleChangeRow = (index, field, value) => {
    const newRows = [...rows];
    newRows[index][field] = value;
    setRows(newRows);
  };
//table 2
const handleDelete2 = (index) => {
  const newRows2 = rows2.filter((_, rowIndex) => rowIndex !== index);
  setRows2(newRows2);
};

const addRow2 = () => {
  setRows2([...rows2, { date: "", reference: "", recipient: "" , amount2: "" }]);
};

const handleChangeRow2 = (index, field, value) => {
  const newRows2 = [...rows2];
  newRows2[index][field] = value;
  setRows2(newRows2);
};

  const handleImageClick = (src) => {
    setSelectedImage(src);
  };

  const handleImageClick1 = (src) => {
    setSelectedImage1(src);
  };

  const handleImageClick2 = (src) => {
    setSelectedImage2(src);
  };

  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  const handleClosePreview1 = () => {
    setSelectedImage1(null);
  };

  const handleClosePreview2 = () => {
    setSelectedImage2(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClosePreview();
        handleClosePreview1();
        handleClosePreview2();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleRemoveImage = (indexToRemove) => {
    setEvalfilesPreview((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveImage1 = (indexToRemove) => {
    setDocumentationPreview((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const handleRemoveImage2 = (indexToRemove) => {
    setFinancialfilesPreview((prevImages) => prevImages.filter((_, index) => index !== indexToRemove));
  };

  const getTabTitle = (toggle) => {
    switch (toggle) {
      case 1:
        return "I. Details";
      case 2:
        return "II. Narrative Report";
      case 3:
        return "III. Financial Report";
      case 4:
        return "IV. Evaluation";
      case 5:
        return "V. Documentation";
      default:
        return "";
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
              <div className="profile-text">
                <div className="user-name">{reqdep}</div>
                <button className="sign-out-button" onClick={handleSignOut}>SIGN OUT</button>
              </div>
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
      <div className="spacer"></div>

      <div className="accomplishment-content">
        <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres</h4>
            <h1 className="incampus-title">Accomplishment Report Form</h1>
          </div>
          <div className="incampus-buttons">
            <button className="incampus-button-cancel" onClick={handleBack}>Back</button>
            <button className="incampus-button-proceed" onClick={handleUpload}>Submit</button>
          </div>
        </div>
        <hr className="title-custom-line" />

        <div className='accomplishment-tabsreports'>
          <div className='accomplishment-tabreport' onClick={() => updateToggle(1)}>I. Details</div>
          <div className='accomplishment-tabreport' onClick={() => updateToggle(2)}>II. Narrative Report</div>
          <div className='accomplishment-tabreport' onClick={() => updateToggle(3)}>III. Financial Report</div>
          <div className='accomplishment-tabreport' onClick={() => updateToggle(4)}>IV. Evaluation</div>
          <div className='accomplishment-tabreport' onClick={() => updateToggle(5)}>V. Documentation</div>
        </div>
        <div className="accomplishment-main-containerreports">
          <div className="accomplishment-guidelineform">
            {toggle === 1 && (
              <div className="accomplishment-show-content">
                <div className="accomplishment-subtext1reports">
                  <div className="tab-title">{getTabTitle(toggle)}</div>
                  <div className="button-group">
                    {toggle > 1 && <a className="accomplishment-reportbackbutton" onClick={() => updateToggle(toggle - 1)}>Previous</a>}
                    {toggle < 5 && <a className="accomplishment-reportnextbutton" onClick={() => updateToggle(toggle + 1)}>Next</a>}
                  </div>
                </div>
                <div className="accomplishment-detailsform">
                  <div className='accomplishment-col1details'>
                    <label htmlFor="title" className='accomplishment-titlelabel'>Title:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={title} onChange={e => setTitle(e.target.value)} />
                    <label htmlFor="title" className='accomplishment-participantslabel1'>Participants:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={participants} onChange={e => setParticipants(e.target.value)} />
                  </div>
                  <div className='accomplishment-col1details'>
                    <label htmlFor="title" className='accomplishment-durationlabel'>Date:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={duration} onChange={e => setDuration(e.target.value)} />
                    <label htmlFor="title" className='accomplishment-themelabel'>Venue:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={theme} onChange={e => setTheme(e.target.value)} />
                  </div>
                  <div className='accomplishment-col1details'>
                    <label htmlFor="title" className='accomplishment-proponentslabel'>Proponents:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={proponents} onChange={e => setProponents(e.target.value)} />
                  </div>
                </div>
              </div>
            )}
            {toggle === 2 && (
              <div className="accomplishment-show-content">
                <div className="accomplishment-subtext1reports">
                  <div className="tab-title">{getTabTitle(toggle)}</div>
                  <div className="button-group">
                    {toggle > 1 && <a className="accomplishment-reportbackbutton" onClick={() => updateToggle(toggle - 1)}>Previous</a>}
                    {toggle < 5 && <a className="accomplishment-reportnextbutton" onClick={() => updateToggle(toggle + 1)}>Next</a>}
                  </div>
                </div>
                <div className="accomplishment-detailsform">
                  <label htmlFor="areafinancial" className='accomplishment-narrativelabel'>Planning and Preparation:</label>
                  <textarea className="accomplishment-areafinancial" name="financial" value={planning} onChange={e => setPlanning(e.target.value)}></textarea>
                  <label htmlFor="areafinancial" className='accomplishment-narrativelabel'>During the Event:</label>
                  <textarea className="accomplishment-areafinancial" name="financial" value={during} onChange={e => setDuring(e.target.value)}></textarea>
                  <label htmlFor="areafinancial" className='accomplishment-narrativelabel'>After the Event:</label>
                  <textarea className="accomplishment-areafinancial" name="financial" value={after} onChange={e => setAfter(e.target.value)}></textarea>
                </div>
              </div>
            )}
            {toggle === 3 && (
              <div className="accomplishment-show-content">
                <div className="accomplishment-subtext1reports">
                  <div className="tab-title">{getTabTitle(toggle)}</div>
                  <div className="button-group">
                    {toggle > 1 && <a className="accomplishment-reportbackbutton" onClick={() => updateToggle(toggle - 1)}>Previous</a>}
                    {toggle < 5 && <a className="accomplishment-reportnextbutton" onClick={() => updateToggle(toggle + 1)}>Next</a>}
                  </div>
                </div>
                <div className="accomplishment-detailsform">
                  <div className='accomplishment-col1details'>
                    <label htmlFor="title" className='accomplishment-sourcefundlabel'>Source of Fund:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={source} onChange={e => setSource(e.target.value)} />
                    <label htmlFor="title" className='accomplishment-totalfundlabel'>Total Fund:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={total} onChange={e => setTotal(e.target.value)} />
                    <br />
                    <div className='accomplishment-financialdocstext'>Less: Expenses</div>
                    <table className="accomplishment-financial-table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th>Quantity</th>
                          <th>Amount</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, index) => (
                          <tr key={index}>
                            <td><input type="text" value={row.item} onChange={(e) => handleChangeRow(index, "item", e.target.value)} /></td>
                            <td><input type="text" value={row.description} onChange={(e) => handleChangeRow(index, "description", e.target.value)} /></td>
                            <td><input type="number" value={row.amount} onChange={(e) => handleChangeRow(index, "amount", e.target.value)} /></td>
                            <td><button onClick={() => handleDelete(index)} style={{ backgroundColor: "#A93644", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br />
                    <button onClick={addRow} style={{ color: "white", backgroundColor: "#2A2E3A", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}>Add a Row</button>
                    <br />
                    <label htmlFor="title" className='accomplishment-sourcefundlabel'>Remaining Balance:</label>
                    <input type="text" id="orgidfaci" name="reqdep" className="accomplishment-title" value={remaining} onChange={e => setRemaining(e.target.value)} />
                    <br></br>
                    <div className='accomplishment-financialdocstext'>Financial Statements: </div>
                    <table className="accomplishment-financial-table">
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
                        {rows2.map((row2, index) => (
                          <tr key={index}>
                            <td><input type="date" value={row2.date} onChange={(e) => handleChangeRow2(index, "date", e.target.value)} /></td>
                            <td><input type="text" value={row2.reference} onChange={(e) => handleChangeRow2(index, "reference", e.target.value)} /></td>
                            <td><input type="text" value={row2.recipient} onChange={(e) => handleChangeRow2(index, "recipient", e.target.value)} /></td>
                            <td><input type="number" value={row2.amount2} onChange={(e) => handleChangeRow2(index, "amount2", e.target.value)} /></td>
                            <td><button onClick={() => handleDelete2(index)} style={{ backgroundColor: "#A93644", color: "white", border: "none", padding: "5px 10px", cursor: "pointer", borderRadius: "4px" }}>Delete</button></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                    <br />
                    <button onClick={addRow2} style={{ color: "white", backgroundColor: "#2A2E3A", padding: "8px 12px", border: "none", borderRadius: "4px", cursor: "pointer", marginRight: "10px" }}>Add a Row</button>
                    <br></br>
                    <div className='accomplishment-financialdocstext'>Attach Supporting Documents Here:</div>
                    <div className="accomplishment-draganddropfile" style={{ border: dragging ? '2px dashed #4CAF50' : '2px dashed #787276', borderRadius: '5px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginLeft: '2px' }}>
                      <input type="file" name="evaluationfile" id="evaluationfile" onChange={handleFileChange3} accept="image/*" multiple style={{ marginTop: '20px', marginBottom: '20px' }} />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                        {financialfilesPreview.map((src, index) => (
                          <div key={index} style={{ position: "relative" }}>
                            <img src={src} alt={`Preview ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} onClick={() => handleImageClick2(src)} />
                            <button onClick={() => handleRemoveImage2(index)} style={{ position: "absolute", top: "1px", right: "5px", background: "none", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "14px", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                      {selectedImage2 && (
                        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={handleClosePreview}>
                          <img src={selectedImage2} alt="Full Preview" style={{ maxWidth: "120%", maxHeight: "90%", borderRadius: "8px", boxShadow: "0 4px 10px rgba(255, 255, 255, 0.3)" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {toggle === 4 && (
              <div className="accomplishment-show-content">
                <div className="accomplishment-subtext1reports">
                  <div className="tab-title">{getTabTitle(toggle)}</div>
                  <div className="button-group">
                    {toggle > 1 && <a className="accomplishment-reportbackbutton" onClick={() => updateToggle(toggle - 1)}>Previous</a>}
                    {toggle < 5 && <a className="accomplishment-reportnextbutton" onClick={() => updateToggle(toggle + 1)}>Next</a>}
                  </div>
                </div>
                <div className="accomplishment-detailsform">
                  <div className='accomplishment-col1details'>
                    <label htmlFor="areafinancial" className='accomplishment-liquidationlabel'>Results of Evaluation Form:</label>
                    <textarea className="accomplishment-areafinancial" name="financial" value={resultseval} onChange={e => setResultseval(e.target.value)}></textarea>
                    <br />
                    <div className='accomplishment-financialdocstext'>Attach Necessary Documents Here:</div>
                    <div className="accomplishment-draganddropfile" style={{ border: dragging ? '2px dashed #4CAF50' : '2px dashed #787276', borderRadius: '5px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginLeft: '2px' }}>
                      <input type="file" name="evaluationfile" id="evaluationfile" onChange={handleFileChange} accept="image/*" multiple style={{ marginTop: '20px', marginBottom: '20px' }} />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                        {evalfilesPreview.map((src, index) => (
                          <div key={index} style={{ position: "relative" }}>
                            <img src={src} alt={`Preview ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} onClick={() => handleImageClick1(src)} />
                            <button onClick={() => handleRemoveImage(index)} style={{ position: "absolute", top: "1px", right: "5px", background: "none", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "14px", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                      {selectedImage1 && (
                        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={handleClosePreview1}>
                          <img src={selectedImage1} alt="Full Preview" style={{ maxWidth: "95vw", maxHeight: "95vh", borderRadius: "8px", boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
            {toggle === 5 && (
              <div className="accomplishment-show-content">
                <div className="accomplishment-subtext1reports">
                  <div className="tab-title">{getTabTitle(toggle)}</div>
                  <div className="button-group">
                    {toggle > 1 && <a className="accomplishment-reportbackbutton" onClick={() => updateToggle(toggle - 1)}>Previous</a>}
                  </div>
                </div>
                <div className="accomplishment-detailsform">
                  <div className='accomplishment-col1details'>
                    <div className='accomplishment-financialdocstext'>Attach Activity Documentations Here:</div>
                    <div className="accomplishment-draganddropfile" style={{ border: dragging ? '2px dashed #4CAF50' : '2px dashed #787276', borderRadius: '5px', padding: '20px', textAlign: 'center', cursor: 'pointer', marginLeft: '2px' }}>
                      <input type="file" name="documentation" id="documentation" onChange={handleFileChange2} accept="image/*" multiple style={{ marginTop: '20px', marginBottom: '20px' }} />
                      <div style={{ display: "flex", gap: "10px", marginTop: "10px", flexWrap: "wrap" }}>
                        {documentationPreview.map((src, index) => (
                          <div key={index} style={{ position: "relative" }}>
                            <img src={src} alt={`Preview ${index + 1}`} style={{ width: "100px", height: "100px", objectFit: "cover", borderRadius: "8px", cursor: "pointer" }} onClick={() => handleImageClick(src)} />
                            <button onClick={() => handleRemoveImage1(index)} style={{ position: "absolute", top: "1px", right: "5px", background: "none", color: "white", border: "none", borderRadius: "50%", width: "20px", height: "20px", fontSize: "14px", cursor: "pointer" }}>✕</button>
                          </div>
                        ))}
                      </div>
                      {selectedImage && (
                        <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", background: "rgba(0,0,0,0.8)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000 }} onClick={handleClosePreview}>
                          <img src={selectedImage} alt="Full Preview" style={{ maxWidth: "95vw", maxHeight: "95vh", borderRadius: "8px", boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)" }} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="spacer"></div>
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

export default Accomplishment;