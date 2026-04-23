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
import SetPassword from "./pages/SetPassword"
import ForgotPassword from "./pages/ForgotPassword"
import ResetPassword from "./pages/ResetPassword"
import CaregiverEarnings from "./features/caregiver/CaregiverEarnings"
import AdminCaregivers from "./features/admin/AdminCaregivers"
import AdminBookings from "./features/admin/AdminBookings"
import AdminUsers from "./features/admin/AdminUsers"
import Adopt from "./features/adoption/Adopt"
import HomeFeed from "./features/dashboard/HomeFeed"
import CreateListing from "./features/adoption/CreateListing"
import MyListings from "./features/adoption/MyListings"
import MyRequests from "./features/adoption/MyRequests"
import BlogListPage from "./features/blog/BlogListPage"
import BlogDetailPage from "./features/blog/BlogDetailPage"
import BlogPreview from "./components/BlogPreview"
import AdminAddBlog from "./features/admin/AdminAddBlog"
import AdminBlogs from "./features/admin/AdminBlogs"
import AdminEditBlog from "./features/admin/AdminEditBlog"
import AdminBreeds from "./features/admin/AdminBreeds"
import AdminCaregiversReport from "./features/admin/AdminCaregiversReport"
import AdminAnalytics from "./features/admin/AdminAnalytics"
function Home() {
  return (
    <>
      <Hero />
     <ServicesPreview />
      <BlogPreview /> 
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
  path="/blog"
  element={
    <>
      <Navbar />
      <BlogListPage />
      <Footer />
    </>
  }
/>

<Route
  path="/blog/:slug"
  element={
    <>
      <Navbar />
      <BlogDetailPage />
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
  path="/forgot-password"
  element={
    <>
      <Navbar />
      <ForgotPassword />
      <Footer />
    </>
  }
/>

<Route
  path="/reset-password/:token"
  element={
    <>
      <Navbar />
      <ResetPassword />
      <Footer />
    </>
  }
/>
<Route
  path="/set-password"
  element={
    <>
      <Navbar />
      <SetPassword />
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
<Route path="adopt" element={<Adopt />} />
<Route path="home" element={<HomeFeed />} />
<Route path="adopt/create" element={<CreateListing />} />
<Route path="adopt/my-listings" element={<MyListings />} />
<Route path="adopt/my-requests" element={<MyRequests />} />
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
<Route path="earnings" element={<CaregiverEarnings />} />
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
  <Route path="caregivers" element={<AdminCaregivers />} />
  <Route path="bookings" element={<AdminBookings />} />
  <Route path="users" element={<AdminUsers />} />
  <Route path="blogs" element={<AdminBlogs />} />
    <Route path="blogs/create" element={<AdminAddBlog />} />
<Route path="blogs/edit/:id" element={<AdminEditBlog />} />
<Route path="breeds" element={<AdminBreeds />} />
<Route path="caregiver-report" element={<AdminCaregiversReport />} />
<Route path="analytics" element={<AdminAnalytics />} />
</Route>
    </Routes>
  )
}

export default App