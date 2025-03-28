import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import OrgList from './pages/OrgList';
import OrgDetails from './pages/OrgDetails';
import EventDetails from './pages/EventDetails';
import OptionOrganization from './pages/OptionOrganization';
import UpdateOrg from './pages/UpdateOrg';
import OptionActivities from './pages/OptionActivities';
import InCampus from './pages/InCampus';
import PreviewInCampus from './pages/PreviewInCampus';
import ViewSubmittedProposals from './pages/ViewSubmittedProposals';
import Home from './pages/Home';
import OptionProjectProsals from './pages/OptionProjectProsals';
import OutCampusA from './pages/OutCampusA';
import OutCampusB from './pages/OutCampusB';
import PreviewOutCampusA from './pages/PreviewOutCampusA';
import Login from './pages/Login';
import UpdateInCampus from './pages/UpdateInCampus';
import UpdateOutCampusA from './pages/UpdateOutCampusA';
import UpdateOutCampusB from './pages/UpdateOutCampusB';
import PreviewOutCampusB from './pages/PreviewOutCampusB';
import AdviserApproval from './pages/ProposalAdviserApproval';
import DirectorApproval from './pages/DirectorApproval';
import DeanApproval from './pages/DeanApproval';
import Guidelines from './pages/Guidelines';
import FaciForm from './pages/FaciForm';
import Updatefaci from './pages/Updatefaci';
import ViewRequests from './pages/ViewRequests';
import ViewRequestForm from './pages/ViewRequestForm';
import ViewRequestsAdviser from './pages/ViewRequestsAdviser';
import ApproveList from './pages/ApproveList';
import OptionFaciRequests from './pages/OptionFaciRequests';
import DSAApproval from './pages/DSAApproval';
import OptionAccreditation from './pages/OptionAccreditation';
import OptionOSAServices from './pages/OptionServices';
import UniformExemption from './pages/UniformExemption';
import StudentActivitiesTab from './pages/StudentActivitiesTab';
import DashboardAdviser from './pages/DashboardAdviser';
import UpdateOrgProfile from './pages/UpdateOrgProfile';
import UpdateOrgMembers from './pages/UpdateOrgMembers';
import ApplicationForm from './pages/ApplicationForm';
import ManageApplication from './pages/ManageApplication';
import UpdateApplication from './pages/UpdateApplication';
import PreviewApplication from './pages/PreviewApplication';
import DashboardDSA from './pages/DashboardDSA';
import DSAApplicationApproval from './pages/DSAApplicationApproval';
import ViewApplicationPass from './pages/ViewApplicationPass';
import ViewRequestsGbm from './pages/ViewRequestsGbm';
import Accomplishment from './pages/Accomplishment';
import PreviewFaci from './pages/PreviewFaci';
import ApproveReportsForm from './pages/ApproveReportsForm';
import ApproveFinancialForm from './pages/ApproveFinancialForm';
import ApproveReports from './pages/ApproveReports';
import ApproveFinancial from './pages/ApproveFinancial';
import ViewReports from './pages/ViewReports';
import ViewFinancial from './pages/ViewFinancial';
import ViewFacility from './pages/ViewFacility';
import UpdateReport from './pages/UpdateReport';
import UpdateFinancial from './pages/UpdateFinancial';
import Financial from './pages/Financial';
import ViewRequestFormGbm from './pages/ViewRequestFormGbm';
import AccreditationForm from './pages/accreditation/AccreditationForm';
import ManageAccreditationApplication from './pages/ManageAccreditationApplication';
import UpdateAccreditationForm from './pages/UpdateAccreditationForm';
import AccreditationList from './pages/accreditation/AccreditationList';
import ViewAccreditationForm from './pages/ViewAccreditationForm';
import ReaccreditationForm from './pages/reaccreditation/ReaccreditationForm';
import ManageReaccreditationApplication from './pages/ManageReaccreditationApplication';
import UpdateReaccreditationForm from './pages/UpdateReaccreditationForm';
import ReaccreditationList from './pages/reaccreditation/ReaccreditationList';
import ViewReaccreditationForm from './pages/ViewReaccreditationForm';
import ViewConductedActivities from './pages/ViewConductedActivities';
import DashboardGbm from './pages/DashboardGbm';
import ProposalsList from './pages/ProposalsList';
import UserManagement from './pages/UserManagement';
import OrgListDSA from './pages/OrgListDSA';
import OrgDetailsDSA from './pages/OrgDetailsDSA';
import ViewFacilityAdviser from './pages/ViewFacilityAdviser';
import UeplistSecurity from './pages/UeplistSecurity';
import ViewApplicationPassOsa from './pages/ViewApplicationPassOsa';
import Ueplist from './pages/Ueplist';


const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        {/* Main> */}
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />

        {/* Menu Tabs > */}
        <Route path="/organizations-tab" element={<OptionOrganization />} />
        <Route path="/activities-tab" element={<OptionActivities />} />
        <Route path="/proposals-options/:org_id" element={<OptionProjectProsals />} />
        <Route path="/accreditation-tab" element={<OptionAccreditation />} />
        <Route path="/osa-services-tab" element={<OptionOSAServices />} />
        <Route path="/uniform-exemption/:stud_id" element={<UniformExemption />} />
        <Route path="/dashboard-adviser" element={<DashboardAdviser />} />
        <Route path="/dashboard-dsa" element={<DashboardDSA />} />

        {/* !! Dani's Module !! */}
        <Route path="/guidelines/:org_id" element={<Guidelines />} />
        <Route path="/faciform/:org_id" element={<FaciForm />} />
        <Route path="/updatefaci/:org_id/:faci_id" element={<Updatefaci />} />
        <Route path="/viewrequestform/:faci_id" element={<ViewRequestForm />} />
        <Route path="/viewrequestformgbm/:faci_id" element={<ViewRequestFormGbm />} />
        <Route path="/facirequests/:org_id" element={<ViewRequests />} />
        <Route path="/viewrequestsadviser" element={<ViewRequestsAdviser />} />
        <Route path="/viewrequestsgbm/" element={<ViewRequestsGbm />} />
        <Route path="/accomplishment/:org_id" element={<Accomplishment />} />
        <Route path="/previewfaci/:org_id/:id" element={<PreviewFaci />} />
        <Route path="/approvereportsform/:reps_id" element={<ApproveReportsForm />} />
        <Route path="/approvefinancialform/:group_id" element={<ApproveFinancialForm/>} />
        <Route path="/approvereports" element={<ApproveReports />} />
        <Route path="/approvefinancial" element={<ApproveFinancial />} />
        <Route path="/viewreports/:org_id" element={<ViewReports />} />
        <Route path="/viewfinancial/:org_id" element={<ViewFinancial />} />
        <Route path="/viewfacility/:org_id" element={<ViewFacility />} />
        <Route path="/updatereport/:org_id/:reps_id" element={<UpdateReport/>} />
        <Route path="/updatefinancial/:org_id/:group_id" element={<UpdateFinancial />} />
        <Route path="/financial/:org_id" element={<Financial />} />
        <Route path="/viewfacilityadviser" element={<ViewFacilityAdviser />} />
        <Route path="/dashboard-gbm" element={<DashboardGbm />} />

        {/* !! Dan's Module !! */}
        <Route path="/appform" element={<ApplicationForm/>}/>
        <Route path="/manage-applications" element={<ManageApplication/>}/>
        <Route path="/update-application/:control_no" element={<UpdateApplication/>}/>
        <Route path="/view-application/:control_no" element={<PreviewApplication/>}/>
        <Route path="/view-application-approval/" element={<DSAApplicationApproval/>}/>
        <Route path="/view-application-pass/:control_no" element={<ViewApplicationPass/>}/>

        {/* !! Renans's Module !! */}
        <Route path="/accreditation/:stud_id" element={<AccreditationForm/>}/>
        <Route path="/manage-accreditation-application/:stud_id" element={<ManageAccreditationApplication/>}/>
        <Route path="/update-accreditation/:acc_id" element={<UpdateAccreditationForm/>}/>
        <Route path="/approveaccreditation" element={<AccreditationList/>}/>
        <Route path="/viewaccreditationform/:acc_id" element={<ViewAccreditationForm/>}/>
        <Route path="/re-accreditation/:org_id" element={<ReaccreditationForm/>}/>
        <Route path="/manage-reaccreditation-application/:org_id" element={<ManageReaccreditationApplication/>}/>
        <Route path="/update-reaccreditation/:acc_id" element={<UpdateReaccreditationForm/>}/>
        <Route path="/approvereaccreditation" element={<ReaccreditationList/>}/>
        <Route path="/viewreaccreditationform/:acc_id" element={<ViewReaccreditationForm/>}/>

        {/* !! Viewing Submitted Proposals of an organization !! */}
        <Route path="/view-activities/:org_id" element={<ViewConductedActivities />} />
        <Route path="/accomplishment/:org_id/:pros_key" element={<Accomplishment />} />

        {/* !! Viewing Submitted Proposals of all organization !! */}
        <Route path="/proposals-list" element={<ProposalsList />} />
        
        {/* Proposal Forms > */}
        <Route path="/in-campus/:org_id" element={<InCampus />} />
        <Route path="/out-campus-a/:org_id" element={<OutCampusA />} />
        <Route path="/out-campus-b/:org_id" element={<OutCampusB />} />

        {/* Previewing Proposals > */}
        <Route path="/preview/:pros_key" element={<PreviewInCampus />} />
        <Route path="/preview/out-campus-a/:pros_key" element={<PreviewOutCampusA />} />
        <Route path="/preview/out-campus-b/:pros_key" element={<PreviewOutCampusB />} />

        {/* Updating Proposals > */}
        <Route path="/update/in-campus/:org_id/:pros_key" element={<UpdateInCampus />} />
        <Route path="/update/out-campus-a/:org_id/:pros_key" element={<UpdateOutCampusA />} />
        <Route path="/update/out-campus-b/:org_id/:pros_key" element={<UpdateOutCampusB />} />

        {/* Proposal Approvals > */}
        <Route path="/adviser-approval" element={<AdviserApproval />} />
        <Route path="/director-approval" element={<DirectorApproval />} />
        <Route path="/dean-approval" element={<DeanApproval />} />
        <Route path="/dsaa-approval" element={<DSAApproval />} />

        {/* Viewing Submitted Proposals of an organization > */}
        <Route path="/view-proposals/:org_id" element={<ViewSubmittedProposals />} />

        {/* Viewing Organization List > */}
        <Route path="/organizationlist" element={<OrgList />} />

        {/* Viewing Student Activity List > */}
        <Route path="/student-activities-tab" element={<StudentActivitiesTab />} />

        {/* Updating Org Info > */}
        <Route path="/update-organization-profile/:org_id" element={<UpdateOrgProfile />} />
        <Route path="/update-organization-members/:org_id" element={<UpdateOrgMembers />} />

        {/* Viewing Org Info > */}
        <Route path="/organization/:org_id" element={<OrgDetails />} />

        {/* Viewing Student Activity Info > */}
        <Route path="/event/:event_key" element={<EventDetails />} />

        {/* User Management > */}
        <Route path="/user-management" element={<UserManagement />} />

        <Route path="/org-list-dsa" element={<OrgListDSA />} />
        <Route path="/org-details-dsa/:org_id" element={<OrgDetailsDSA />} />

        <Route path="/ueplist" element={<Ueplist />} />
        <Route path="/ueplist-security" element={<UeplistSecurity />} />
        <Route path="/view-application-pass-osa/:control_no" element={<ViewApplicationPassOsa />} />

      </Routes>
    </Router>
  );
}

export default App;