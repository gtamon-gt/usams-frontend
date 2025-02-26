import './reportsview.css';
import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useParams } from "react-router-dom";
import logo from '/unc_logo.png';
import axios from 'axios';
import './faciformCSS.css';
import './FaciForm.css';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

const ApproveReportsForm = () => {
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState([]);
  const [imagee, setImagee] = useState([]);
  const [imageePreview, setImageePreview] = useState([]);

  const location = useLocation();
  const { userId, userInfo } = location.state || {};
  const [orgId, setOrgId] = useState(null);
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

  const [date, setDate] = useState('');
  const [remaining, setRemaining] = useState(0);
  const [total, setTotal] = useState(0);
  const [groupId, setGroupId] = useState("");
  const [fetchedData, setFetchedData] = useState([]);
  const [source, setSource] = useState('');

  const [financialfiles, setFinancialfiles] = useState([]);
  const [financialfilesPreview, setFinancialfilesPreview] = useState([]);

  const [fetchedImages, setFetchedImages] = useState([]);
  const { reps_id } = useParams();

  const [rows, setRows] = useState([
    { item: "", description: "", amount: "" },
  ]);

  const [director, setDirector] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [dirResponse] = await Promise.all([
          axios.get('http://localhost:8800/approvers')
        ]);

        const approversData = dirResponse.data;
        const directorData = approversData.find(
          (director) => director.employee_position === "OSA Director"
        );

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
      }
    };
    fetchData();
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
    setToggle(reps_id);
  }

  const handleChange = (e) => {
    const { value, checked } = e.target;
  };

  useEffect(() => {
    console.log("Fetching data for ID:", reps_id);

    axios
      .get(`http://localhost:8800/accomplishment/${reps_id}`)
      .then((res) => {
        console.log("Fetched Data:", res.data);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setTitle(toTitleCase(res.data[0].title));
          setReqdep(toTitleCase(res.data[0].reqdep));
          setTheme(toTitleCase(res.data[0].theme));
          setParticipants(toTitleCase(res.data[0].participants));
          setProponents(toTitleCase(res.data[0].proponents));
          setDuration(toTitleCase(res.data[0].duration));
          setPlanning(toTitleCase(res.data[0].planning));
          setDuring(toTitleCase(res.data[0].during));
          setAfter(toTitleCase(res.data[0].after));
          setResultseval(toTitleCase(res.data[0].resultseval));

          setSource(toTitleCase(res.data[0].source));
          setTotal(res.data[0].total);
          setRemaining(res.data[0].remaining);

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

  useEffect(() => {
    if (!reps_id) return;

    console.log("Fetching data for ID:", reps_id);

    axios
      .get(`http://localhost:8800/financial_records/fetch/${reps_id}`)
      .then((res) => {
        console.log("Fetched Data:", res.data);

        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          setFetchedData(res.data);
        } else {
          console.warn("No data found for the given reps_id");
          setFetchedData([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
      });
  }, [reps_id]);

  const [selectedImage, setSelectedImage] = useState(null);
  const handleImageClick = (src) => {
    setSelectedImage(src);
  };
  const handleClosePreview = () => {
    setSelectedImage(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClosePreview();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [selectedImage1, setSelectedImage1] = useState(null);
  const handleImageClick1 = (src) => {
    setSelectedImage1(src);
  };
  const handleClosePreview1 = () => {
    setSelectedImage1(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClosePreview1();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const [selectedImage2, setSelectedImage2] = useState(null);
  const handleImageClick2 = (src) => {
    setSelectedImage2(src);
  };
  const handleClosePreview2 = () => {
    setSelectedImage2(null);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        handleClosePreview2();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const generatePDF = () => {
    const input = document.getElementById('proposal-preview');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;

        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }
        pdf.save('In-Campus Activity Form.pdf');
      });
    }
  };

  const toTitleCase = (str) => {
    return str.replace(/\w\S*/g, (txt) => {
      return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
  };

  return (
    <div className="main-wrapper">
      <div className="header-container">
        <div className="logo-section">
          <div className="logo-text-section">
            <img src={logo} alt="Logo" className="logo-img" />
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
            <a href="/home" className="navbar-link">Home</a>
            <a href="/activities-tab" className="navbar-link">Activities</a>
            <a href="/organizations-tab" className="navbar-link">Organizations</a>
            <a href="#" className="navbar-link">Accreditation</a>
            <a href="#" className="navbar-link">OSA Services</a>
          </div>
        </div>
      </div>

      <div className="spacer"></div>

      <div id="proposal-preview" className="previewmain">
        <div className="incampus-content preview">
          <table className="previewheader">
            <tr>
              <td><img src="/unc_logo.png" alt="Logo" className="logo-img" /></td>
              <td>
                <h4 className="unc-title">UNIVERSITY OF NUEVA CACERES</h4>
                <h1 className="incampus-title">Accomplishment Report</h1>
                <h5 className="osa-title"> Office of Student Affairs </h5>
                <h5 className="doc"> Document Control No.: UNC-FM-SA-24 </h5>
              </td>
              <td>
                <img src="/osa_logo.png" alt="Logo" className="logo-img_osa" />
              </td>
            </tr>
          </table>
        </div>
        <br></br>

        <div className="details-container">
          <div>
            <div className="subtext1reports1">I. &nbsp;&nbsp;&nbsp; Details Of The Activity:</div>

            <div className="detailsform1">
              <p> <span style={{ fontWeight: '500' }}> Title: </span> {title} </p>
              <p> <span style={{ fontWeight: '500' }}> Affiliation: </span> {reqdep} </p>
              <p> <span style={{ fontWeight: '500' }}> Venue: </span> {theme} </p>
              <p> <span style={{ fontWeight: '500' }}> Proponents: </span> {proponents} </p>
              <p> <span style={{ fontWeight: '500' }}> Date: </span> {duration} </p>
              <p> <span style={{ fontWeight: '500' }}> Participants: </span> {participants} </p>
            </div>

            <div className="subtext1reports">II. &nbsp;&nbsp;&nbsp; Narrative Report:</div>

            <div className="detailsform1">
              <label className='narrativelabel1'>Planning And Preparation: </label>
              <div> {planning}</div>
              <br></br>
              <label className='narrativelabel1'>During The Event: </label>
              <div> {during}</div>
              <br></br>
              <label className='narrativelabel1'>After The Event: </label>
              <div>{after}</div>
            </div>

            <div className="subtext1reports">III. &nbsp;&nbsp;&nbsp; Financial Report:</div>

            <div className="detailsform1">
              <div className='col1details'>
                <p> <span style={{ fontWeight: '500' }}> Source Of Fund: </span> {source} </p>
                <p> <span style={{ fontWeight: '500' }}> Total Fund: </span> {total} </p>
                <p> <span style={{ fontWeight: '500' }}> Remaining Balance: </span> {remaining} </p>
                <br></br>

                <div className='financialdocstext1'>Liquidation Of Expenses: </div>

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
                          <td>{row.amount}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan="3">No Data Found</td>
                      </tr>
                    )}
                  </tbody>
                </table>

                <br></br>
                <br></br>
                <div className='financialdocstext1'>Uploaded Attachments: </div>
                <div className="draganddropfile">
                  {fetchedImages.length > 0 ? (
                    fetchedImages.map((imgSet, index) => (
                      <div key={index} style={{ marginBottom: "20px" }}>
                        <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                          {imgSet.financialfiles1 &&
                            imgSet.financialfiles1.map((financialfiles1, imgIndex) => (
                              <div key={`financialfiles-${index}-${imgIndex}`}>
                                <img
                                  src={`http://127.0.0.1/uploads/${financialfiles1}`}
                                  alt={`Fetched Image ${imgIndex + 1}`}
                                  style={{
                                    width: "200px",
                                    margin: "10px 0",
                                    borderRadius: "8px",
                                    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                  }}
                                  onClick={() => handleImageClick2(`http://127.0.0.1/uploads/${financialfiles1}`)}
                                />
                              </div>
                            ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p>No Attachments</p>
                  )}

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
                      onClick={handleClosePreview2}
                    >
                      <img
                        src={selectedImage2}
                        alt="Full Preview"
                        style={{
                          maxWidth: "95vw",
                          maxHeight: "95vh",
                          borderRadius: "10px",
                          boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
                          transform: "scale(1.35)",
                          transition: "transform 0.2s ease-in-out",
                        }}
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="subtext1reports">IV. &nbsp;&nbsp;&nbsp; Summary Of Evaluation:</div>

            <div className="detailsform1">
              <div className='col1details'>
                <label className='liquidationlabel1'>Results Of Evaluation Form: </label><br></br>
                <div> {resultseval}</div>
                <br></br>
                <br></br>
                <div className='financialdocstext1'>Uploaded Attachments: </div>
                <div className="draganddropfile">
                  <div>
                    {fetchedImages.length > 0 ? (
                      fetchedImages.map((imgSet, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {imgSet.evalfiles1 &&
                              imgSet.evalfiles1.map((evalfiles, imgIndex) => (
                                <div key={`evalfiles-${index}-${imgIndex}`}>
                                  <img
                                    src={`http://127.0.0.1/uploads/${evalfiles}`}
                                    alt={`Fetched Image ${imgIndex + 1}`}
                                    style={{
                                      width: "200px",
                                      margin: "10px 0",
                                      borderRadius: "8px",
                                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                    onClick={() => handleImageClick(`http://127.0.0.1/uploads/${evalfiles}`)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No Attachments</p>
                    )}

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
                        onClick={handleClosePreview}
                      >
                        <img
                          src={selectedImage}
                          alt="Full Preview"
                          style={{
                            maxWidth: "95vw",
                            maxHeight: "95vh",
                            borderRadius: "10px",
                            boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
                            transform: "scale(1.35)",
                            transition: "transform 0.2s ease-in-out",
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="subtext1reports">V. &nbsp;&nbsp;&nbsp; Documentation:</div>

            <div className="detailsform1">
              <div className='col1details'>
                <div className='financialdocstext1'>Uploaded Attachments: </div>
                <div className="draganddropfile">
                  <div>
                    {fetchedImages.length > 0 ? (
                      fetchedImages.map((imgSet, index) => (
                        <div key={index} style={{ marginBottom: "20px" }}>
                          <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                            {imgSet.documentations &&
                              imgSet.documentations.map((documentations, imgIndex) => (
                                <div key={`documentations-${index}-${imgIndex}`}>
                                  <img
                                    src={`http://127.0.0.1/uploads/${documentations}`}
                                    alt={`Fetched Image ${imgIndex + 1}`}
                                    style={{
                                      width: "200px",
                                      margin: "10px 0",
                                      borderRadius: "8px",
                                      boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
                                    }}
                                    onClick={() => handleImageClick1(`http://127.0.0.1/uploads/${documentations}`)}
                                  />
                                </div>
                              ))}
                          </div>
                        </div>
                      ))
                    ) : (
                      <p>No Images Found</p>
                    )}

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
                        onClick={handleClosePreview1}
                      >
                        <img
                          src={selectedImage1}
                          alt="Full Preview"
                          style={{
                            maxWidth: "95vw",
                            maxHeight: "95vh",
                            borderRadius: "10px",
                            boxShadow: "0 8px 16px rgba(255, 255, 255, 0.2)",
                            transform: "scale(1.35)",
                            transition: "transform 0.2s ease-in-out",
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

      <div className="forPDF">
        <button onClick={generatePDF}>Download PDF</button>
      </div>

      <div className="footer-container">
        <div className="footer-row">
          <div className="footer-column">
            <div className="foot1"> 09561301775 | 09071566898</div>
            <div className="foot1">J. Hernandez Ave, Naga City 4400</div>
            <div className="foot1">info@unc.edu.ph</div>
          </div>
          <div className="footer-column2">
            <img src="/osa_logo.png" alt="Logo" className="logo-img2" />
            <div>
              <div className="unc1"> UNIVERSITY OF NUEVA CACERES </div>
              <div className="unc2"> STUDENT AFFAIRS</div>
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

export default ApproveReportsForm;
