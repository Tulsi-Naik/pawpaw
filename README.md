# PawCare – Pet Care Booking Platform

PawCare is a full-stack web application where pet owners can request pet care services and caregivers can accept and manage those bookings. It also includes an admin panel to handle caregiver applications.

---

## Features

### Pet Owner
- Add and manage pets  
- Create booking requests  
- Make payments (Razorpay – test mode)  
- View booking history  

### Caregiver
- Set up profile (skills, location, pricing, photo)  
- Receive booking requests  
- Accept or reject bookings  
- Track earnings  

### Admin
- View caregiver applications  
- Approve or reject applications  
- Manage caregivers  

---

## Key Features

- Location-based filtering (city and radius)  
- Razorpay payment integration (test mode)  
- Email notifications (SendGrid)  
- SMS notifications for important updates  
- JWT-based authentication  
- Booking and earnings tracking  

---

## Tech Stack

### Frontend
- React.js (Vite)  
- Tailwind CSS  
- Axios  
- React Hot Toast  

### Backend
- Node.js  
- Express.js  
- MongoDB (Mongoose)  

### Other
- Razorpay (Test Mode)  
- SendGrid (Email Notifications)  
- SMS Service Integration  
- Cloudinary (Image Uploads)  

---

## Project Structure

/backend  
  ├── config  
  ├── controllers  
  ├── middleware  
  ├── models  
  ├── routes  
  ├── utils  
  └── server.js  

/frontend  
  ├── src  
  │   ├── components  
  │   ├── features  
  │   ├── layouts  
  │   ├── pages  
  │   └── assets  
  └── main files (App.jsx, main.jsx, etc.)

---

## Setup Instructions

### 1. Clone the repository

git clone https://github.com/your-username/pawcare.git  
cd pawcare  

---

### 2. Backend setup

cd backend  
npm install  

Create a `.env` file:

PORT=5000  
MONGO_URI=your_mongodb_uri  
JWT_SECRET=your_secret  
RAZORPAY_KEY_ID=your_key  
RAZORPAY_SECRET=your_secret  
SENDGRID_API_KEY=your_key  
SMS_API_KEY=your_key  
CLOUDINARY_URL=your_cloudinary_url  

Run backend:

npm run dev  

---

### 3. Frontend setup

cd frontend  
npm install  
npm run dev  

---

## Future Improvements

- Data analytics dashboard (earnings, booking trends)  
- Ecommerce integration (pet products like collars, food, accessories)  
- Ratings and reviews for caregivers  
- Calendar-based booking system  

