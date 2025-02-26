import './faciformCSS.css';
import './FaciForm.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

const Updatefaci = () => {
   const location = useLocation();
        const navigate = useNavigate();
        const { userId, userInfo } = location.state || {};
        const [org_id, setOrg_id] = useState(null);
         const [orgName, setOrgName] = useState(''); 
       const [reqdep, setReqdep] = useState('');
  //    const [books, setBooks] = useState([]);
  //    const [showComments, setShowComments] = useState({});
  //    const [comments, setComments] = useState({});
 //  const [feedback, setFeedback] = useState('');
     const [adviser, setAdviser] = useState(''); 


  const [participants, setParticipants] = useState('');
  const [facility, setFacility] = useState([]);
  const [actname, setActname] = useState('');
  const [date, setDate] = useState('');
  const [timefaci, setTimefaci] = useState('');
  const [numberpart, setNumberpart] = useState('');
  const [invitedpers, setInvitedpers] = useState('');
  const [progdetails, setProgdetails] = useState('');
  
  const [office, setOffice] = useState('');
  const [suspension, setSuspension] = useState('');
  const [position, setPosition] = useState('');
  const [acttype, setActtype] = useState('');
  const [resources, setResources] = useState([]);
  const [amsco, setAmsco] = useState([]);
  const [services, setServices] = useState([]);
  const [timefaciend, setTimefaciend] = useState('');
  const [otherfacility, setOtherfacility] = useState('');
  const [acunits, setAcunits] = useState('');
  const [displayboardpcs, setDisplayboardpcs] = useState('');
  const [monoblocpcs, setMonoblocpcs] = useState('');
  const [pavtablepcs, setPavtablepcs] = useState('');
  const [otherresources, setOtherresources] = useState('');
  const [computerunits, setComputerunits] = useState('');
  const [projectorpcs, setProjectorpcs] = useState('');
  const [printerunits, setPrinterunits] = useState('');
  const [otheramsco, setOtheramsco] = useState('');

 // const navigate = useNavigate();
  const{faci_id} = useParams();

  useEffect(()=>{
    axios.get("http://localhost:8800/searchreturned/"+faci_id)
    .then(res=> {
    //  setRepname(res.data[0].repname);
      setParticipants(res.data[0].participants);
   //   setFacility(res.data[0].facility);
      setActname(res.data[0].actname);
      setProgdetails(res.data[0].progdetails);
      setDate(res.data[0].date);
      setTimefaci(res.data[0].timefaci);
      setTimefaciend(res.data[0].timefaciend);
      setNumberpart(res.data[0].numberpart);
      setInvitedpers(res.data[0].invitedpers);
  //    setReqdep(res.data[0].reqdep);
      setOffice(res.data[0].office);
    //  setDesignation(res.data[0].designation);
      setSuspension(res.data[0].suspension);
      setPosition(res.data[0].position);
      setActtype(res.data[0].acttype);
   //   setResources(res.data[0].resources);
      setAmsco(res.data[0].amsco);
      setServices(res.data[0].services);
   //   setAdviser(res.data[0].adviser);
   //   setFeedback(res.data[0].feedback);
   //   setGbm(res.data[0].gbm);
    //  setGbmposition(res.data[0].gbmposition);
      setOtherfacility(res.data[0].otherfacility);
      setAcunits(res.data[0].acunits);
      setDisplayboardpcs(res.data[0].displayboardpcs);
      setMonoblocpcs(res.data[0].monoblocpcs);
      setPavtablepcs(res.data[0].pavtablepcs);
      setOtherresources(res.data[0].otherresources);
      setComputerunits(res.data[0].computerunits);
      setProjectorpcs(res.data[0].projectorpcs);
      setPrinterunits(res.data[0].printerunits);
      setOtheramsco(res.data[0].otheramsco);


      const fetchedFacility = res.data[0].facility; // Assume facility is a comma-separated string
      const fetchedResources = res.data[0].resources; // Assume resources is a comma-separated string
      const fetchedAmsco = res.data[0].amsco;
      const fetchedServices = res.data[0].services;
      const fetchedActtype = res.data[0].acttype;

      setFacility(fetchedFacility.split(", ").map((item) => item.trim())); // Parse and set facilities
      setResources(fetchedResources.split(", ").map((item) => item.trim())); // Parse and set resources
      setAmsco(fetchedAmsco.split(", ").map((item) => item.trim()));
      setServices(fetchedServices.split(", ").map((item) => item.trim()));
      setActtype(fetchedActtype.split(", ").map((item) => item.trim()));

/*
      const fetchedValues = res.data[0].facility  // Assume `image` contains a comma-separated string
      const fetchedResources = res.data[0].resources 
      const parsedValues = [...fetchedValues.split(", ").map((item) => item.trim()),
         ...fetchedResources.split(", ").map((item) => item.trim()), ];
      setFacility(parsedValues);
      setResources(parsedValues);
      

      setSelectedValues(parsedValues); // Set the fetched values as selected */
      

   })

    .catch(err=>console.log(err))
  },[])   

  const handleChange = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setFacility((prev) => [...prev, value]);
    } else {
      setFacility((prev) => prev.filter(item => item !== value));
    }
  };

  

  const handleResources = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setResources((prev) => [...prev, value]);
    } else {
      setResources((prev) => prev.filter(item => item !== value));
    }
  };

  const handleActtype = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setActtype(value);
    } else {
        setActtype((prev) => prev.filter(item => item !== value));
      }
    
  };

  const handleAmsco = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setAmsco((prev) => [...prev, value]);
    } else {
      setAmsco((prev) => prev.filter(item => item !== value));
    }
  };

  const handleServices = (e) => {
    const { value, checked } = e.target;
    if (checked) {
      setServices((prev) => [...prev, value]);
    } else {
      setServices((prev) => prev.filter(item => item !== value));
    }
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

      const handleClick = async (e) => {
        e.preventDefault();
    
        // Ensure required fields are not empty
        if (!faci_id) {
            alert("Facility ID is missing.");
            return;
        }
        if (!org_id || !actname || !date || !timefaci || !timefaciend) {
            alert("Please fill in all required fields.");
            return;
        }
    
        try {
            // Ensure all array fields are properly handled
            const combinedFacility = Array.isArray(facility) ? facility.join(", ") : "";
            const combinedResources = Array.isArray(resources) ? resources.join(", ") : "";
            const combinedAmsco = Array.isArray(amsco) ? amsco.join(", ") : "";
            const combinedServices = Array.isArray(services) ? services.join(", ") : "";
    
            const response = await axios.put(`http://localhost:8800/updatefaci/${faci_id}`, {
                org_id,
                facility: combinedFacility,
                participants,
                actname,
                progdetails,
                date,
                timefaci,
                timefaciend,
                numberpart,
                invitedpers,
                reqdep,
                office,
                suspension,
                position,
                adviser,
                resources: combinedResources,
                amsco: combinedAmsco,
                services: combinedServices,
                acttype,
                otherfacility,
                acunits,
                displayboardpcs,
                monoblocpcs,
                pavtablepcs,
                otherresources,
                computerunits,
                projectorpcs,
                printerunits,
                otheramsco
            });
    
            if (response.data.success) {
                // Reset arrays after successful update
                setFacility([]);
                setResources([]);
                setAmsco([]);
                setServices([]);
                alert("Form Successfully Updated!");
            } else {
                alert("Form Submission Failed: " + (response.data.message || "Unknown error"));
            }
    
            // navigate("/Pending"); // Uncomment if navigation is needed
        } catch (err) {
            console.error("Error updating facility:", err.response?.data || err.message || "Unknown error occurred");
            alert("An error occurred while updating. Please try again.");
        }
    };
    

  const handleBack = () => {
    navigate(`/facirequests/${org_id}`, { state: { userId, userInfo } });
  };

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
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

      <div className="spacer"></div>

      <div className="faciform-content">
      <div className="incampus-content">
          <div className="incampus-header">
            <h4 className="unc-title">University of Nueva Caceres</h4>
            <h1 className="incampus-title">Facility Reservation Draft Form</h1>
          </div>
          <div className="incampus-buttons">
            <button className="incampus-button-cancel" onClick={handleBack}>
              Back
            </button>
            <button className="incampus-button-proceed" onClick={handleClick}>
              Submit
            </button>
          </div>
        </div>
        <hr className="title-custom-line" />

        <div className="main-containerfaciform">
        <div className="acttype-container">
          <div className="acttype-section">
            <div className="acttype-text">Activity Type:</div>
            <div className="acttype-choices">
              <div className="student-sponsored">
                <input type="checkbox" value='Student Sponsored' name='acttype' onChange={handleActtype} checked={acttype.includes("Student Sponsored")} />
                Student Sponsored
              </div>
              <div className="university-sponsored">
                <input type="checkbox" value='University Sponsored' name='acttype' onChange={handleActtype} checked={acttype.includes("University Sponsored")} />
                University Sponsored
              </div>
            </div>
          </div>
          <div className="title-act-section">
            <label htmlFor="orgname" className="title-act-label">Title of Activity:</label>
            <input type="text" id="orgname" name="actname" className='actname-guide' value={actname} onChange={e => setActname(e.target.value)} />
          </div>
        </div>

          <hr className="section-divider" />

          <div className="additional-info">
            <label htmlFor="additional-info-textarea" className="additional-info-label">Program Details:</label>
            <textarea id="additional-info-textarea" className="additional-info-textarea" value={progdetails} onChange={e => setProgdetails(e.target.value)}></textarea>
          </div>

          <div className="progdetails-form">
            <div className="progdetails-row">
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='dateform-label'>Inclusive Date(s)</label>
                <input type="text" id="orgidfaci" name="date" className="dateform-label1" value={date} 
                onChange={e => setDate(e.target.value)}/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='time-label'>Start Time</label>
                <input type="time" id="orgidfaci" className="time-field" value={timefaci} onChange={e => setTimefaci(e.target.value)} />
              </div>
              <div className="progdetails-group">
                <label htmlFor="endtime" className='time-label'>End Time</label>
                <input type="time" id="endtime" className="time-field" value={timefaciend} onChange={e => setTimefaciend(e.target.value)} />
              </div>
              <div className="progdetails-group">
                <label htmlFor="suspensionfield" className='suspension-label'>Request for Suspension of Classes</label>
                <select id="dateformlabel1" required className='suspension-field'
                 value={suspension} 
                 onChange={e => setSuspension(e.target.value)} >
                  <option>Select</option>
                  <option value="No">No</option>
                  <option value="Yes">Yes</option>
                </select>
              </div>
            </div>
            <div className="progdetails-row">
            <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='invpers-form'>Invited Persons not from UNC</label>
                <input type="text" id="orgidfaci" name="invitedpers" className="dateform-label1" value={invitedpers} onChange={e => setInvitedpers(e.target.value)} />
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='office-label'>Office/Institution</label>
                <input type="text" id="orgidfaci" name="office" className="dateform-label1" value={office} onChange={e => setOffice(e.target.value)} />
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='position-label'>Position/Designation</label>
                <input type="text" id="orgidfaci" name="position" className="dateform-label1" value={position} onChange={e => setPosition(e.target.value)} />
              </div>
            </div>
            <div className="progdetails-row">
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='reqdept-form'>Requesting Dept./Organization</label>
                <input type="text" id="orgidfaci" name="reqdep" className="dateform-label1" value={reqdep}  readOnly />
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='participants-label'>Participants/Audiences</label>
                <input type="text" id="orgidfaci" name="participants" className="dateform-label1" value={participants} onChange={e => setParticipants(e.target.value)} />
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='number-label'>Expected number of participants</label>
                <input type="text" id="orgidfaci" name="numberpart" className="dateform-label1" value={numberpart} onChange={e => setNumberpart(e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">Venue:</div>
          <div className="venue-form">
            <div className="venue-row">
              <div className="venue-group">
                <input type="checkbox" value='Sports Palace' name='facility' onChange={handleChange} 
                checked={facility.includes("Sports Palace")}/> Sports Palace
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Social Hall' name='facility' onChange={handleChange} 
                checked={facility.includes("Social Hall")}/> Social Hall
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Cov. Court A' name='facility' onChange={handleChange} 
                checked={facility.includes("Cov. Court A")}/> Cov. Court A
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Cov. Court B' name='facility' onChange={handleChange} 
                checked={facility.includes("Cov. Court B")}/> Cov. Court B
              </div>
            </div>
            <div className="venue-row">
              <div className="venue-group">
                <input type="checkbox" value='AVR E-Library' name='facility' onChange={handleChange} 
                checked={facility.includes("AVR E-Library")}/> AVR E-Library
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Student Pavilion' name='facility' onChange={handleChange} 
                checked={facility.includes("Student Pavilion")}/> Student Pavilion
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Chapel' name='facility' onChange={handleChange} 
                checked={facility.includes("Chapel")}/> Chapel
              </div>
              <div className="venue-group">
                <input type="checkbox" name='facility' value='Others:' onChange={handleChange} 
                checked={facility.includes("Others:")}/> Others:
                <input type="text" id="orgidfaci" name="facility" className="other-venue-label1" value={otherfacility} onChange={e => setOtherfacility(e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">Resources Needed:</div>
          <div className="venue-form">
            <div className="resources-row">
              <div className="resources-group">
                <input type="checkbox" value='Philippine Flag' name='resources' className='resources-check' onChange={handleResources} 
                checked={resources.includes("Philippine Flag")}/> Philippine Flag
              </div>
              <div className="resources-group">
                <input type="checkbox" value='UNC Flag' name='resources' className='resources-check' onChange={handleResources} 
                checked={resources.includes("UNC Flag")}/> UNC Flag
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Aircon' name='resources' className='resources-check' onChange={handleResources} 
                checked={resources.includes("Aircon")}/> Aircon
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Mako Fan' name='resources' onChange={handleResources} 
                checked={resources.includes("Mako Fan")}/> Mako Fan
              </div>
            </div>
            <div className="resources-row">
              <div className="resources-group">
                <input type="checkbox" value='Aeratron' name='resources' onChange={handleResources} 
                checked={resources.includes("Aeratron")}/> Aeratron
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Air Coolers' name='resources' onChange={handleResources} 
                checked={resources.includes("Air Coolers")}/> Air Coolers
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={acunits} onChange={e => setAcunits(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>units</label>
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Rostrum' name='resources' onChange={handleResources} 
                checked={resources.includes("Rostrum")}/> Rostrum
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Standby Generator' name='resources' onChange={handleResources} 
                checked={resources.includes("Standby Generator")}/> Standby Generator
              </div>
            </div>
            <div className="resources-row">
              <div className="resources-group">
                <input type="checkbox" value='Display Boards' name='resources' onChange={handleResources} 
                checked={resources.includes("Display Boards")}/> Display Boards
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={displayboardpcs} onChange={e => setDisplayboardpcs(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Monobloc Chairs' name='resources' onChange={handleResources} 
                checked={resources.includes("Monobloc Chairs")}/> Monobloc Chairs
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={monoblocpcs} onChange={e => setMonoblocpcs(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
              </div>
              <div className="resources-group">
                <input type="checkbox" value='Pavilion Table' name='resources' onChange={handleResources} 
                checked={resources.includes("Pavilion Table")}/> Pavilion Table
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={pavtablepcs} onChange={e => setPavtablepcs(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
              </div>
              <div className="resources-group">
                <input type="checkbox" name='resources' value='Others:' onChange={handleResources}
                checked={resources.includes("Others:")} /> Others:
                <input type="text" id="orgidfaci" name="resources" className="other-venue-label1" value={otherresources} onChange={e => setOtherresources(e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">AMSCO Resources:</div>
          <div className="venue-form">
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Documentation' name='amsco' className='amsco-check' onChange={handleAmsco}
                checked={amsco.includes("Documentation")} /> Documentation
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Video' name='amsco' className='amsco-check' onChange={handleAmsco} 
                checked={amsco.includes("Video")}/> Video
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Still Camera' name='amsco' className='amsco-check' onChange={handleAmsco} 
                checked={amsco.includes("Still Camera")}/> Still Camera
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">ICT Resources:</div>
          <div className="venue-form">
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Sound System' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Sound System")}/> Sound System
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Microphones' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Microphones")}/> Microphones
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Computers' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Computers")}/> Computer(s)
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={computerunits} onChange={e => setComputerunits(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>units</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Internet/Wifi' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Internet/Wifi")}/> Internet/Wifi
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Multi-Media Projector' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Multi-Media Projector")}/> Multi-Media Projector
              </div>
            </div>
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Projector Screen' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Projector Screen")}/> Projector Screen
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={projectorpcs} onChange={e => setProjectorpcs(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Printer' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Printer")}/> Printer(s)
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={printerunits} onChange={e => setPrinterunits(e.target.value)} />
                <label htmlFor="aircoolers-label" className='aircooler-label'>units</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Others:' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Ohters:")}/> Others:
                <input type="text" id="orgidfaci" name="orgid" className="other-venue-label1" value={otheramsco} onChange={e => setOtheramsco(e.target.value)} />
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">Personnel and Special Services:</div>
          <div className="venue-form">
            <div className="services-row">
              <div className="services-group">
                <input type="checkbox" value='Janitorial' name='services' className='services-check' onChange={handleServices} 
                checked={services.includes("Janitorial")}/> Janitorial
              </div>
              <div className="services-group">
                <input type="checkbox" value='Security' name='services' className='services-check' onChange={handleServices} 
                checked={services.includes("Security")}/> Security
              </div>
              <div className="services-group">
                <input type="checkbox" value='Driver' name='services' className='services-check' onChange={handleServices} 
                checked={services.includes("Driver")}/> Driver
              </div>
              <div className="services-group">
                <input type="checkbox" value='ICT Technician' name='services' className='services-check' onChange={handleServices} 
                checked={services.includes("ICT Technician")}/> ICT Technician
              </div>
            </div>
            <div className="services-row">
              <div className="services-group">
                <input type="checkbox" value='Electricians' name='services' onChange={handleServices} 
                checked={services.includes("Electricians")}/> Electricians
              </div>
              <div className="services-group">
                <input type="checkbox" value='Sound System Operators' name='services' onChange={handleServices} 
                checked={services.includes("Sound System Operators")}/> Sound System Operators
              </div>
              <div className="services-group">
                <input type="checkbox" value='Generator Set Operators' name='services' onChange={handleServices} 
                checked={services.includes("Generator Set Operators")}/> Generator Set Operators
              </div>
              <div className="services-group">
                <input type="checkbox" value='Glee Club' name='services' onChange={handleServices} 
                checked={services.includes("Glee Club")}/> Glee Club
              </div>
            </div>
            <div className="services-row">
              <div className="services-group">
                <input type="checkbox" value='College Band' name='services' onChange={handleServices} 
                checked={services.includes("College Band")}/> College Band
              </div>
              <div className="services-group">
                <input type="checkbox" value='H/S DXMC' name='services' onChange={handleServices} 
                checked={services.includes("H/S DXMC")}/> H/S DXMC
              </div>
              <div className="services-group">
                <input type="checkbox" value='College Majorettes' name='services' onChange={handleServices} 
                checked={services.includes("College Majorettes")}/> College Majorettes
              </div>
              <div className="services-group">
                <input type="checkbox" value='H/S Majorettes' name='services' onChange={handleServices} 
                checked={services.includes("H/S Majorettes")}/> H/S Majorettes
              </div>
            </div>
            <div className="services-row">
              <div className="services-group">
                <input type="checkbox" value='CAT/ROTC Colors' name='services' onChange={handleServices} 
                checked={services.includes("CAT/ROTC Colors")}/> CAT/ROTC Colors
              </div>
              <div className="services-group">
                <input type="checkbox" value='Van' name='services' onChange={handleServices} 
                checked={services.includes("Van")}/> Van (to be approved by VPAAS)
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetext">Organization Adviser:</div>
            <input
              type="text"
              name="adviser"
              value={adviser}
              className="adviser-input"
              onChange={e => setAdviser(e.target.value)}
              readOnly
            />

          <div className="submitfacibutton">
            <a className="submitfacibtn" onClick={handleClick}>Re-Submit Draft Form</a>
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

export default Updatefaci;