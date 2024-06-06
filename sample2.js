const express = require('express');
const { createObjectCsvWriter } = require('csv-writer');
const app = express();

// Dummy data
const dummyData = [
  {
    "id": 1,
    "first_name": "John",
    "last_name": "Doe",
    "email": "john.doe@example.com",
    "medications": [
      {
        "medicine_name": "Aspirin",
        "description": "Used to reduce pain, fever, or inflammation.",
        "medication_statuses": [
          {
            "status": 1,
            "notification_date": "2024-05-05T08:00:00.000Z"
          },
          {
            "status": 0,
            "notification_date": "2024-05-06T08:00:00.000Z"
          }
        ]
      },
      {
        "medicine_name": "Lisinopril",
        "description": "Used to treat high blood pressure.",
        "medication_statuses": [
          {
            "status": 1,
            "notification_date": "2024-05-03T08:00:00.000Z"
          },
          {
            "status": 1,
            "notification_date": "2024-05-04T08:00:00.000Z"
          }
        ]
      }
    ]
  },
  {
    "id": 2,
    "first_name": "Jane",
    "last_name": "Smith",
    "email": "jane.smith@example.com",
    "medications": [
      {
        "medicine_name": "Metformin",
        "description": "Used to treat type 2 diabetes.",
        "medication_statuses": [
          {
            "status": 1,
            "notification_date": "2024-05-02T08:00:00.000Z"
          },
          {
            "status": 0,
            "notification_date": "2024-05-05T08:00:00.000Z"
          }
        ]
      }
    ]
  }
];

// Define CSV writer
const csvWriter = createObjectCsvWriter({
  header: [
    { id: 'medicine_name', title: 'Medicine Name' },
    { id: 'description', title: 'Description' },
    { id: 'status', title: 'Status' },
    { id: 'notification_date', title: 'Notification Date' }
  ]
});

// Route to generate CSV report for each user
app.get('/generate-reports', (req, res) => {
  dummyData.forEach(user => {
    const records = [];
    user.medications.forEach(medication => {
      medication.medication_statuses.forEach(status => {
        records.push({
          medicine_name: medication.medicine_name,
          description: medication.description,
          status: status.status,
          notification_date: status.notification_date
        });
      });
    });

    const fileName = `${user.first_name}_${user.last_name}_report.csv`;
    csvWriter.writeRecords(records)
      .then(() => {
        console.log(`CSV report generated successfully for ${user.first_name} ${user.last_name}`);
      })
      .catch(error => {
        console.error(`Error generating CSV report for ${user.first_name} ${user.last_name}:`, error);
      });
  });

  res.send('CSV reports generated successfully');
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
