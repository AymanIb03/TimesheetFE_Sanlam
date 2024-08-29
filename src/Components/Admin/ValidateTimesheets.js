// src/Components/Admin/ValidateTimesheets.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function ValidateTimesheets() {
  const [timesheets, setTimesheets] = useState([]);

  useEffect(() => {
    // Fetch timesheets data from the API
    axios.get('https://localhost:44396/api/Admin/GetTimesheets')
      .then(response => {
        setTimesheets(response.data);
      })
      .catch(error => {
        console.error('Error fetching timesheets:', error);
      });
  }, []);

  return (
    <div className="container mt-4">
      <h1>Gestion Timesheets</h1>
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Date</th>
            <th>Heures travaillées</th>
            <th>Utilisateur</th>
            <th>Projet</th>
            <th>Statut</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {timesheets.map(timesheet => (
            <tr key={timesheet.id}>
              <td>{timesheet.date}</td>
              <td>{timesheet.hoursWorked}</td>
              <td>{timesheet.userName}</td>
              <td>{timesheet.projectName}</td>
              <td>{timesheet.isValidated ? 'Validé' : 'En attente'}</td>
              <td>
                {/* Add buttons for validating/rejecting timesheets here */}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ValidateTimesheets;
