import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import Login from './Components/Login';
import UserDashboard from './Components/UserDashboard'; 
import UserList from './Components/Admin/UserList';
import ProjectList from './Components/Admin/ProjectList';
import Logout from './Components/Logout';
import ForgotPassword from './Components/ForgotPassword';
import ResetPassword from './Components/ResetPassword';
import PrivateRoute from './Components/PrivateRoute';
import Navbar from './Components/Navbar';
import Timesheets from './Components/Timesheets'; 
import AccountInfo from './Components/AccountInfo'; 
import EditTimesheet from './Components/EditTimesheet';
import EditUser from './Components/Admin/EditUser';
import UserDetails from './Components/Admin/UserDetails';
import EditProject from './Components/Admin/EditProject';
import CreateProject from './Components/Admin/CreateProject';
import ProjectDetails from './Components/Admin/ProjectDetails'; 
import { ToastContainer } from 'react-toastify'; 
import AdminNavbar from './Components/Admin/AdminNavbar';
import CreateUser from './Components/Admin/CreateUser';
import TimesheetList from './Components/Admin/TimesheetList';
import CreateAssignment from './Components/Admin/CreateAssignment'; 
import AssignmentsList from './Components/Admin/AssignementsList';
import AdminAccountInfo from './Components/Admin/AdminAccountInfo';
import AdminTimesheetDownload from './Components/Admin/TimesheetDownload';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <ToastContainer />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/resetpassword" element={<ResetPassword />} />
        
        <Route
          path="/user-dashboard"
          element={
            <>
              <Navbar />
              <PrivateRoute element={<UserDashboard />} />
            </>
          }
        />
        
         <Route
          path="/admin/validate-timesheets"  
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={< TimesheetList />} />
            </>
          }
        />
        <Route
          path="/timesheets"
          element={
            <>
              <Navbar />
              <PrivateRoute element={<Timesheets />} />
            </>
          }
        />
        <Route
          path="/account-info"
          element={
            <>
              <Navbar />
              <PrivateRoute element={<AccountInfo />} />
            </>
          }
        />
        <Route
          path="/edit-timesheet/:id"
          element={
            <>
              <Navbar />
              <PrivateRoute element={<EditTimesheet />} />
            </>
          }
        />
        <Route
          path="/admin/users"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<UserList />} />
            </>
          }
        />
        <Route
          path="/admin/projects"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<ProjectList />} />
            </>
          }
        />
        <Route
          path="/admin/edit-user/:userId"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<EditUser />} />
            </>
          }
        />
        <Route
          path="/admin/user-details/:userId"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<UserDetails />} />
            </>
          }
        />
        <Route
          path="/admin/create-user"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<CreateUser />} />
            </>
          }
        />
        <Route
          path="/admin/edit-project/:projectId"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<EditProject />} />
            </>
          }
        />
        <Route
          path="/admin/create-project"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<CreateProject />} />
            </>
          }
        />
        <Route
          path="/admin/project-details/:projectId"
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<ProjectDetails />} />
            </>
          }
        />
        <Route
          path="/admin/assignments" 
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<AssignmentsList />} />
            </>
          }
        />
        <Route
          path="/admin/create-assignment"  
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<CreateAssignment />} />
            </>
          }
        />
         <Route
          path="/admin/account-info" 
          element={
            <>
              <AdminNavbar />
              <PrivateRoute element={<AdminAccountInfo />} />
            </>
          }
        />
        <Route
  path="/admin/download-timesheets"
  element={
    <>
      <AdminNavbar />
      <PrivateRoute element={<AdminTimesheetDownload />} />
    </>
  }
/>

        <Route path="/logout" element={<Logout />} />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
