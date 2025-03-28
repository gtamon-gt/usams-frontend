import './faciformCSS.css';
import './FaciForm.css';
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import logo from '/unc_logo.png';
import './PreviewFacility.css';

const ViewRequestForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { userId, userInfo } = location.state || {};
  const [orgId, setOrgId] = useState(null);
  const [orgName, setOrgName] = useState(''); 
  const [adviser, setAdviser] = useState(''); 
  const [reqdep, setReqdep] = useState('');
  const [error, setError] = useState(null);

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
   //   setRepname(res.data[0].repname);
      setParticipants(res.data[0].participants);
   //   setFacility(res.data[0].facility);
      setActname(res.data[0].actname);
      setProgdetails(res.data[0].progdetails);
      setDate(res.data[0].date);
      setTimefaci(res.data[0].timefaci);
      setTimefaciend(res.data[0].timefaciend);
      setNumberpart(res.data[0].numberpart);
      setInvitedpers(res.data[0].invitedpers);
      setReqdep(res.data[0].reqdep);
      setOffice(res.data[0].office);
    //  setDesignation(res.data[0].designation);
      setSuspension(res.data[0].suspension);
      setPosition(res.data[0].position);
      setActtype(res.data[0].acttype);
   //   setResources(res.data[0].resources);
      setAmsco(res.data[0].amsco);
      setServices(res.data[0].services);
  //    setAdviser(res.data[0].adviser);
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
      

   })

    .catch(err=>console.log(err))
  },[])   

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [advisersResponse, organizationsResponse, proposalsResponse] = await Promise.all([
          axios.get('http://localhost:8800/advisers'),
          axios.get('http://localhost:8800/organizations'),
    //      axios.get('http://localhost:8800/proposals'),
        ]);

        const advisers = advisersResponse.data;
        const organizationsData = organizationsResponse.data;
    //    const proposalsData = proposalsResponse.data;

        // Find adviser based on userId
        const foundAdviser = advisers.find((adv) => adv.user_id === userId);
        if (!foundAdviser) {
          setError('Adviser not found.');
          setLoading(false);
          return;
        }
       

        setAdviser(foundAdviser);

        // Get organizations advised by the adviser
        const advisedOrganizations = organizationsData.filter(
          (org) => org.adv_id === foundAdviser.adv_id
        );
        setOrganizations(advisedOrganizations);
      //  console.log(advisedOrganizations);
        // Get proposals for the advised organizations
        const orgIds = advisedOrganizations.map((org) => org.org_id);
        const filteredProposals = proposalsData.filter(
          (proposal) =>
            orgIds.includes(proposal.org_id) &&
            proposal.step_at === 1 &&
            proposal.on_revision === 0
        );
        setProposals(filteredProposals);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data.');
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

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


  const handleBack = () => {
    navigate('/viewrequestsadviser', { state: { userId, userInfo } });
  };

  const handleSignOut = () => {
    navigate('/', { state: { userId: null } });
  };
  const handleNext = () => {
    if (orgId) {
      navigate(`/faciform/${orgId}`, { state: { userId, userInfo } });
    }
  };

  const generatePDF = () => {
    const input = document.getElementById('proposal-preview');
    if (input) {
      html2canvas(input).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        const imgWidth = 210; // A4 size width in mm
       // const pageHeight = 295; // A4 size height in mm
       const pageHeight = 315;
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
        pdf.save('FacilityForm.pdf');
      });
    }
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
           
            {adviser && (
              <>
                <div className="profile-text">
                  <div className="user-name">{adviser.adv_name}</div>
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
          <table className="previewheaderfaci">
            <tr>
              <td><img src="/unc_logo.png" alt="Logo" className="logo-img" /></td>
              <td>
                <h4 className="unc-title">UNIVERSITY OF NUEVA CACERES</h4>
                <h1 className="incampus-title">Facility/Activity Sheet</h1>
                <h5 className="osa-title"> Grounds and Buildings Management </h5>
             
              </td>
              <td>
              <h6 className="doc"> Document Control No.:<br></br>
              UNC-FM-GB-25 </h6>
              </td>
            </tr>
          </table>
        </div>
<br></br>
        <div className="details-container">
        <div className="acttype-containerprev">
          <div className="acttype-section">
            <div className="acttype-textprev">Activity Type:</div>
            <div className="acttype-choices">
              <div className="student-sponsoredprev">
                <input type="checkbox" value='Student Sponsored' name='acttype' 
                onChange={handleActtype} checked={acttype.includes("Student Sponsored")} disabled/>
                Student Sponsored
              </div>
              <div className="student-sponsoredprev">
                <input type="checkbox" value='University Sponsored' name='acttype' 
                onChange={handleActtype} checked={acttype.includes("University Sponsored")} disabled/>
                University Sponsored
              </div>
            </div>
          </div>
          <div className="title-act-section">
            <label htmlFor="orgname" className="acttype-textprev">Title of Activity:</label>
            <input type="text" id="orgname" name="actname" className='actname-guideprev' value={actname} 
            onChange={e => setActname(e.target.value)} readOnly/>
          </div>
        </div>

        <hr className="section-divider" />

<div className="additional-infoprev">
  <label htmlFor="additional-info-textarea" className="acttype-textprev">Program Details:</label>
  <textarea id="additional-info-textarea" className="additional-info-textarea" value={progdetails}
   onChange={e => setProgdetails(e.target.value)} readOnly></textarea>
</div>
<br></br>
<div className="progdetails-formprev">
            <div className="progdetails-row">
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='dateform-labelprev'>Inclusive Date(s)</label>
                <input type="text" id="orgidfaci" name="date" className="dateform-prev" value={date} 
                onChange={e => setDate(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='time-labelprev'>Start Time</label>
                <input type="text" id="orgidfaci" className="time-fieldprev" value={timefaci} 
                onChange={e => setTimefaci(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="endtime" className='time-labelprev'>End Time</label>
                <input type="text" id="endtime" className="time-fieldprev" value={timefaciend} 
                onChange={e => setTimefaciend(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="suspensionfield" className='suspension-labelprev'>Suspension of Classes</label>
                <input type="text" id="endtime" className="suspension-fieldprev"  value={suspension} 
                 onChange={e => setSuspension(e.target.value)} readOnly/>
               
              </div>
            </div>
            <div className="progdetails-row">
            <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='invpers-formprev'>Invited Persons not from UNC</label>
                <input type="text" id="orgidfaci" name="invitedpers" className="dateform-prev" value={invitedpers} 
                onChange={e => setInvitedpers(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='office-labelprev'>Office/Institution</label>
                <input type="text" id="orgidfaci" name="office" className="dateform-prev" value={office} 
                onChange={e => setOffice(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='position-labelprev'>Position/Designation</label>
                <input type="text" id="orgidfaci" name="position" className="dateform-prev" value={position} 
                onChange={e => setPosition(e.target.value)} readOnly/>
              </div>
            </div>
            <div className="progdetails-row">
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='reqdept-formprev'>Requesting Dept./Organization</label>
                <input type="text" id="orgidfaci" name="reqdep" className="dateform-prev" value={reqdep}  readOnly />
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='participants-labelprev'>Participants/Audiences</label>
                <input type="text" id="orgidfaci" name="participants" className="dateform-prev" value={participants} 
                onChange={e => setParticipants(e.target.value)} readOnly/>
              </div>
              <div className="progdetails-group">
                <label htmlFor="dateformlabel1" className='number-labelprev'>Expected number of participants</label>
                <input type="text" id="orgidfaci" name="numberpart" className="dateform-prev" value={numberpart}
                onChange={e => setNumberpart(e.target.value)} readOnly/>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetextprev">Venue:</div>
          <div className="venue-formprev">
            <div className="venue-row">
              <div className="venue-group">
                <input type="checkbox" value='Sports Palace' name='facility' onChange={handleChange} 
                checked={facility.includes("Sports Palace")} disabled/> Sports Palace
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Social Hall' name='facility' onChange={handleChange} 
                checked={facility.includes("Social Hall")}disabled /> Social Hall
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Cov. Court A' name='facility' onChange={handleChange} 
                checked={facility.includes("Cov. Court A")}disabled/> Cov. Court A
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Cov. Court B' name='facility' onChange={handleChange} 
                checked={facility.includes("Cov. Court B")}disabled/> Cov. Court B
              </div>
            </div>
            <div className="venue-row">
              <div className="venue-group">
                <input type="checkbox" value='AVR E-Library' name='facility' onChange={handleChange} 
                checked={facility.includes("AVR E-Library")}disabled/> AVR E-Library
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Student Pavilion' name='facility' onChange={handleChange} 
                checked={facility.includes("Student Pavilion")}disabled/> Student Pavilion
              </div>
              <div className="venue-group">
                <input type="checkbox" value='Chapel' name='facility' onChange={handleChange} 
                checked={facility.includes("Chapel")}disabled/> Chapel
              </div>
              <div className="venue-group">
                <input type="checkbox" name='facility' value='Others:' onChange={handleChange} 
                checked={facility.includes("Others:")}disabled/> Others:
                <input type="text" id="orgidfaci" name="facility" className="suspension-fieldprev" value={otherfacility} 
                onChange={e => setOtherfacility(e.target.value)} readOnly/>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

<div className="venuetextprev">Resources Needed:</div>
<div className="venue-formprev2">
  <div className="resources-row">
    <div className="resources-group">
      <input type="checkbox" value='Philippine Flag' name='resources' className='resources-check' onChange={handleResources} 
      checked={resources.includes("Philippine Flag")} disabled/> Philippine Flag
    </div>
    <div className="resources-group">
      <input type="checkbox" value='UNC Flag' name='resources' className='resources-check' onChange={handleResources} 
      checked={resources.includes("UNC Flag")} disabled/> UNC Flag
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Aircon' name='resources' className='resources-check' onChange={handleResources} 
      checked={resources.includes("Aircon")} disabled/> Aircon
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Mako Fan' name='resources' onChange={handleResources} 
      checked={resources.includes("Mako Fan")} disabled/> Mako Fan
    </div>
  </div>
  <div className="resources-row">
    <div className="resources-group">
      <input type="checkbox" value='Aeratron' name='resources' onChange={handleResources} 
      checked={resources.includes("Aeratron")} disabled/> Aeratron
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Air Coolers' name='resources' onChange={handleResources} 
      checked={resources.includes("Air Coolers")} disabled/> Air Coolers
      <input type="text" id="orgidfaci" name="orgid" className="aircoolers-labelprev" value={acunits}
       onChange={e => setAcunits(e.target.value)} readOnly/>
      <label htmlFor="aircoolers-label" className='aircooler-label'>units</label>
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Rostrum' name='resources' onChange={handleResources} 
      checked={resources.includes("Rostrum")} disabled/> Rostrum
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Standby Generator' name='resources' onChange={handleResources} 
      checked={resources.includes("Standby Generator")} disabled/> Standby Generator
    </div>
  </div>
  <div className="resources-row">
    <div className="resources-group">
      <input type="checkbox" value='Display Boards' name='resources' onChange={handleResources} 
      checked={resources.includes("Display Boards")} disabled/> Display Boards
      <input type="text" id="orgidfaci" name="orgid" className="aircoolers-labelprev" value={displayboardpcs} 
      onChange={e => setDisplayboardpcs(e.target.value)} readOnly/>
      <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Monobloc Chairs' name='resources' onChange={handleResources} 
      checked={resources.includes("Monobloc Chairs")} disabled/> Monobloc Chairs
      <input type="text" id="orgidfaci" name="orgid" className="aircoolers-labelprev" value={monoblocpcs} 
      onChange={e => setMonoblocpcs(e.target.value)} readOnly/>
      <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
    </div>
    <div className="resources-group">
      <input type="checkbox" value='Pavilion Table' name='resources' onChange={handleResources} 
      checked={resources.includes("Pavilion Table")} disabled/> Pavilion Table
      <input type="text" id="orgidfaci" name="orgid" className="aircoolers-labelprev" value={pavtablepcs} 
      onChange={e => setPavtablepcs(e.target.value)} readOnly/>
      <label htmlFor="aircoolers-label" className='aircooler-label'>pcs</label>
    </div>
    <div className="resources-group">
      <input type="checkbox" name='resources' value='Others:' onChange={handleResources}
      checked={resources.includes("Others:")} disabled/> Others:
      <input type="text" id="orgidfaci" name="resources" className="suspension-fieldprev" value={otherresources}
       onChange={e => setOtherresources(e.target.value)} readOnly/>
    </div>
  </div>
</div>

<hr className="section-divider" />

          <div className="venuetextprev">AMSCO Resources:</div>
          <div className="venue-formprev">
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Documentation' name='amsco' className='amsco-check' onChange={handleAmsco}
                checked={amsco.includes("Documentation")} disabled /> Documentation
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Video' name='amsco' className='amsco-check' onChange={handleAmsco} 
                checked={amsco.includes("Video")} disabled/> Video
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Still Camera' name='amsco' className='amsco-check' onChange={handleAmsco} 
                checked={amsco.includes("Still Camera")} disabled/> Still Camera
              </div>
            </div>
          </div>

          <hr className="section-divider" />

          <div className="venuetextprev">ICT Resources:</div>
          <div className="venue-formprev2">
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Sound System' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Sound System")} disabled/> Sound System
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Microphones' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Microphones")} disabled/> Microphones
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Computers' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Computers")} disabled/> Computer(s)
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-labelprev" value={computerunits} 
                onChange={e => setComputerunits(e.target.value)} readOnly/>
                <label htmlFor="aircoolers-label" className='aircooler-label'>units</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Internet/Wifi' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Internet/Wifi")} disabled/> Internet/Wifi
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Multi-Media Projector' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Multi-Media Projector")} disabled/> Multi-Media Projector
              </div>
            </div>
            <div className="amsco-row">
              <div className="amsco-group">
                <input type="checkbox" value='Projector Screen' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Projector Screen")} disabled/> Projector Screen
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={projectorpcs} 
                onChange={e => setProjectorpcs(e.target.value)} readOnly/>
                <label htmlFor="aircoolers-label" className='aircoolers-labelprev'>pcs</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Printer' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Printer")} disabled/> Printer(s)
                <input type="text" id="orgidfaci" name="orgid" className="aircoolers-label" value={printerunits} 
                onChange={e => setPrinterunits(e.target.value)} readOnly/>
                <label htmlFor="aircoolers-label" className='aircoolers-labelprev'>units</label>
              </div>
              <div className="amsco-group">
                <input type="checkbox" value='Others:' name='amsco' onChange={handleAmsco} 
                checked={amsco.includes("Ohters:")} disabled/> Others:
                <input type="text" id="orgidfaci" name="orgid" className="suspension-fieldprev" value={otheramsco} 
                onChange={e => setOtheramsco(e.target.value)} readOnly/>
              </div>
            </div>
          </div>

          <hr className="section-divider" />

<div className="venuetextprev">Personnel and Special Services:</div>
<div className="venue-formprev">
  <div className="services-row">
    <div className="services-group">
      <input type="checkbox" value='Janitorial' name='services' className='services-check' onChange={handleServices} 
      checked={services.includes("Janitorial")} disabled/> Janitorial
    </div>
    <div className="services-group">
      <input type="checkbox" value='Security' name='services' className='services-check' onChange={handleServices} 
      checked={services.includes("Security")} disabled/> Security
    </div>
    <div className="services-group">
      <input type="checkbox" value='Driver' name='services' className='services-check' onChange={handleServices} 
      checked={services.includes("Driver")} disabled/> Driver
    </div>
    <div className="services-group">
      <input type="checkbox" value='ICT Technician' name='services' className='services-check' onChange={handleServices} 
      checked={services.includes("ICT Technician")} disabled/> ICT Technician
    </div>
  </div>
  <div className="services-row">
    <div className="services-group">
      <input type="checkbox" value='Electricians' name='services' onChange={handleServices} 
      checked={services.includes("Electricians")} disabled/> Electricians
    </div>
    <div className="services-group">
      <input type="checkbox" value='Sound System Operators' name='services' onChange={handleServices} 
      checked={services.includes("Sound System Operators")} disabled/> Sound System Operators
    </div>
    <div className="services-group">
      <input type="checkbox" value='Generator Set Operators' name='services' onChange={handleServices} 
      checked={services.includes("Generator Set Operators")} disabled/> Generator Set Operators
    </div>
    <div className="services-group">
      <input type="checkbox" value='Glee Club' name='services' onChange={handleServices} 
      checked={services.includes("Glee Club")} disabled/> Glee Club
    </div>
  </div>
  <div className="services-row">
    <div className="services-group">
      <input type="checkbox" value='College Band' name='services' onChange={handleServices} 
      checked={services.includes("College Band")} disabled/> College Band
    </div>
    <div className="services-group">
      <input type="checkbox" value='H/S DXMC' name='services' onChange={handleServices} 
      checked={services.includes("H/S DXMC")} disabled/> H/S DXMC
    </div>
    <div className="services-group">
      <input type="checkbox" value='College Majorettes' name='services' onChange={handleServices} 
      checked={services.includes("College Majorettes")} disabled/> College Majorettes
    </div>
    <div className="services-group">
      <input type="checkbox" value='H/S Majorettes' name='services' onChange={handleServices} 
      checked={services.includes("H/S Majorettes")} disabled/> H/S Majorettes
    </div>
  </div>
  <div className="services-row">
    <div className="services-group">
      <input type="checkbox" value='CAT/ROTC Colors' name='services' onChange={handleServices} 
      checked={services.includes("CAT/ROTC Colors")} disabled/> CAT/ROTC Colors
    </div>
    <div className="services-group">
      <input type="checkbox" value='Van' name='services' onChange={handleServices} 
      checked={services.includes("Van")} disabled/> Van (to be approved by VPAAS)
    </div>
  </div>
</div>

<hr className="section-divider" />


<div className="input-row-faci">
  <div className="input-group-faci">
    <label className="venuetextprev-dean">Dean/Department Head:</label>
    <input
      type="text"
      name="dean"
      className="adviser-inputprev"
      onChange={e => setDean(e.target.value)}
      readOnly
    />
  </div>

  <div className="input-group-faci2">
    <label className="venuetextprev-officer">Engr. Christian R. Encila</label>
    <div className="engrlabel1">Grounds and Buildings Superintendent</div>
   
  </div>
</div>

<div className="input-row-faci">
  <div className="input-group-faci">
    <label className="venuetextprev-dean">Safety Officer:</label>
    <input
      type="text"
      name="dean"
      className="adviser-inputprev"
      onChange={e => setDean(e.target.value)}
      readOnly
    />
  </div>

  <div className="input-group-faci2">
    <label className="venuetextprev-officer">Engr. Leon B. Palmiano IV</label>
    <div className="engrlabel1">VP for Administration and Auxiliary Services</div>
   
  </div>
</div>



        </div>

        

      </div>

      <div id="proposal-preview" className="previewmain">
        
      <h3 className='guidelinestexth3'>General Guidelines for University Activities</h3>

      
          <div className="guidelineformprev">
            <div className="text1guide">
              1. Secure the Activity/Facility Form from the Grounds and Buildings Management Office and inquire if proposed activity has any conflict of schedule.
            </div>
            
            <div className="text2guide">
              2. Filing of Activity/Facility Form must be done at least five (5) days prior to the start of the activity.
            </div>
         
            <div className="text3guide">
              3. No activities sponsored by accredited student organizations must be scheduled ten (10) days before major examinations.
            </div>
          
            <div className="text4guide">
              4. In case of any change in the submitted form such as date, time or use of facilities, the requesting party must inform all signatories and concerned offices.
            </div>
          
            <div className="text5guide">
              5. At least two (2) days before the scheduled activity, approved copies of the Activity/Facilities Forms will be distributed as follows:
            </div>
            <div className="text5guide2">
              5.1 Office of the Vice President for Administration & Auxiliary Services <br />
              5.2 Office of the Vice President for Academic Affairs <br />
              5.3 Office of the Grounds and Buildings Management <br />
              5.4 AMSCO Office <br />
              5.5 Security Office <br />
              5.6 Generator Operator (If Necessary) <br />
              5.7 Requesting Party
            </div>
          
            <div className="text6guide">
              6. Only officers of accredited student organizations in the university are authorized to make requests for the use of University facilities.
            </div>
        
            <div className="text7guide">
              7. The use of the facilities for fund raising activities sponsored by the students or any other school and organization shall be charged accordingly.
            </div>
          
            <div className="text8guide">
              8. Activities sponsored jointly with outside groups are required to execute a contract indicating the facilities to be used, the date, the time and the amount of rental.
            </div>
          
            <div className="text9guide">
              9. In case there is a prescribed arrangement of the requested facilities such as tables, chairs, sound system, ornamental plants, lights, etc., the requesting party must attach a proposed <br />
              &nbsp;&nbsp;&nbsp;    layout of the arrangement in the Facility/Activity Form.
            </div>

           
  <textarea id="additional-info-textarea" className="additional-info-textarea" placeholder='Layout of Tables and Chairs...'
   onChange={e => setProgdetails(e.target.value)} readOnly></textarea>
         
            <div className="text10guide">
              10. The adviser should be present during the whole duration of the activity.
            </div>
         
            <div className="text11guide">
              11. During night, after class or holiday reservations, the requesting party, guests and participants are discouraged to loiter.
            </div>

            <div className="text12guide">
              I will be present during the activity and I recommend its approval
            </div>

            <br></br>
            <br></br>

            <table className='table-adviser'>
        <tr>
            <th>Adviser Name:</th>
            <th>Adviser Signature:</th>
            <th>Date:</th>
        </tr>
        <tr>
            <td>{adviser.adv_name}</td>
            <td></td>
            <td></td>
        </tr>
    </table>
<br></br>
<br></br>
<br></br>
    <table className='table-adviser'>
        <tr>
            <th>VPAAS</th>
            <th>GBM</th>
            <th>Security</th>
            <th>Generator</th>
            <th>File Copy</th>
        </tr>
      
        <tr>
            <td>Date: </td>
            <td>Date: </td>
            <td>Date: </td>
            <td>Date: </td>
            <td>Date: </td>
        </tr>
    </table>

          </div>
        </div>
      

      <div className="forPDF-faci" onClick={generatePDF}>
        <button >Download PDF</button>
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

export default ViewRequestForm;