import { Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import Hero from "./components/Hero"
import ServicesPreview from "./components/ServicesPreview"
import Stats from "./components/Stats"
import Testimonials from "./components/Testimonials"
import FinalCTA from "./components/FinalCTA"
import Footer from "./components/Footer"
import Booking from "./components/Booking"
import Register from "./pages/Register"
import Login from "./pages/Login"
import ProtectedRoute from "./components/ProtectedRoute"
import AppLayout from "./layouts/AppLayout"
import './App.css'
import AboutPage from "./pages/AboutPage"
import ServicesPage from "./pages/ServicesPage"
import ContactPage from "./pages/ContactPage"
import ProfilePage from "./features/profile/ProfilePage"
import DashboardPage from "./features/dashboard/DashboardPage"
import MyBookingsPage from "./features/bookings/MyBookingsPage"
import CaregiverDashboard from "./features/caregiver/CaregiverDashboard"
import CaregiverLayout from "./layouts/CaregiverLayout"
import CaregiverSchedule from "./features/caregiver/CaregiverSchedule"
import GroomingPage from "./features/grooming/GroomingPage"
import AdminLayout from "./layouts/AdminLayout"
import AdminDashboard from "./features/admin/AdminDashboard"
import BecomeCaregiver from "./components/BecomeCaregiver"
import ApplyCaregiver from "./features/caregiver/ApplyCaregiver"
import AdminApplications from "./features/admin/AdminApplications"
import CaregiverProfileSetup from "./features/caregiver/CaregiverProfileSetup"
import TrackWalkPage from "./features/bookings/TrackWalkPage"
import PetsPage from "./features/pets/PetsPage"
import PetProfilePage from "./features/pets/PetProfilePage"

function Home() {
  return (
    <>
      <Hero />
     <ServicesPreview />
      
      <Stats />
      <BecomeCaregiver />
      <Testimonials />
      <FinalCTA />
    </>
  )
}

function App() {
  return (
    <Routes>

      {/* PUBLIC PAGES */}
      <Route
        path="/"
        element={
          <>
            <Navbar />
            <Home />
            <Footer />
          </>
        }
      />
      <Route
  path="/about"
  element={
    <>
      <Navbar />
      <AboutPage />
      <Footer />
    </>
  }
/>
<Route
  path="/services"
  element={
    <>
      <Navbar />
      <ServicesPage />
      <Footer />
    </>
  }
/>
<Route
  path="/contact"
  element={
    <>
      <Navbar />
      <ContactPage />
      <Footer />
    </>
  }
/>
      <Route
        path="/login"
        element={
          <>
            <Navbar />
            <Login />
            <Footer />
          </>
        }
      />

      <Route
        path="/register"
        element={
          <>
            <Navbar />
            <Register />
            <Footer />
          </>
        }
      />
      <Route
  path="/apply-caregiver"
  element={
    <>
      <Navbar />
      <ApplyCaregiver />
      <Footer />
    </>
  }
/>

      {/* PROTECTED APP AREA */}
      <Route
        path="/app"
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
  
        <Route path="profile" element={<ProfilePage />} />
<Route path="dashboard" element={<DashboardPage />} />
<Route path="pets" element={<PetsPage />} />
<Route path="pets/:id" element={<PetProfilePage />} />
        <Route path="book" element={<Booking />} />
<Route path="my-bookings" element={<MyBookingsPage />} />
<Route path="track/:bookingId" element={<TrackWalkPage />} />
<Route path="grooming" element={<GroomingPage />} />
      </Route>
      {/* CAREGIVER AREA */}
<Route
  path="/caregiver"
  element={
    <ProtectedRoute>
      <CaregiverLayout />
    </ProtectedRoute>
  }
>
  <Route path="schedule" element={<CaregiverSchedule />} />
  <Route path="open-requests" element={<CaregiverDashboard />} />
  <Route path="profile-setup" element={<CaregiverProfileSetup />} />
</Route>

<Route
  path="/admin"
  element={
    <ProtectedRoute>
      <AdminLayout />
    </ProtectedRoute>
  }
>
  <Route path="dashboard" element={<AdminDashboard />} />
  <Route path="applications" element={<AdminApplications />} />
</Route>
    </Routes>
  )
}

export default App