# VE - Request Credits

## Summary
* [Description](#description)
* [Components](#components)
* [Technologies](#technologies)
* [Environment](#environment)

## Description

This project is a web application that allows users to apply for credit and manage requests. It consists of two main components: 
* `Home` for submitting credit applications
* `Requests` for viewing and managing these applications.

## Components

### `Home`

This component allows users to submit a new credit application. It includes form inputs for personal information, document details, and address. Users can also upload a profile picture.

#### Features:

- **Form Submission**: Users can fill out a form with their personal details, contact information, and income.
- **File Upload**: Users can upload a document photo. The file is uploaded to AWS S3, and the URL is included in the form submission.
- **Validation**: The form fields are validated to ensure that all required information is entered correctly.
- **Responsive Design**: The layout adjusts for different screen sizes, ensuring a consistent user experience across devices.

### `Requests`

This component displays a list of all credit applications. Users can view detailed information about each request, including the applicant's name, contact details, and the uploaded document photo.

#### Features:

- **Data Fetching**: Retrieves a list of users/applications from the backend.
- **Pagination**: Supports pagination to view a subset of requests at a time.
- **Detailed View**: Users can select a request to view detailed information, including personal and contact details, income level, and the document photo.
- **Responsive Table**: The table adjusts for different screen sizes, ensuring a consistent user experience across devices.
- **S3 URL Encoding**: Encodes and reconstructs S3 URLs to handle special characters in file names.

## Technologies:

- **axios**: For making HTTP requests.
- **antd**: UI library for table, badge, and other UI components.
- **react-router-dom**: For navigation between different pages.
- **Custom Hooks**: `useGetUsers` for fetching the list of users/applications, and `useWindowSize` for responsive design.

## Environment

| Variable              |
|-----------------------|
| VITE_API_URL          |
| VITE_BUCKET           |