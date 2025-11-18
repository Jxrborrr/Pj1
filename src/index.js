import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Login from './main/Login';
import HotelBooking from './main/HotelBooking';
import Register from './main/register';
import Profile from './components/Profile.js';
import Mybookings from './main/Mybookings';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import reportWebVitals from './reportWebVitals';


import AdminLayout from './pages/AdminLayout.js';
import AdminBookings from './pages/AdminBookings.js';
import AdminRooms from './pages/AdminRooms.js';
import AdminUsers from "./pages/AdminUsers";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<HotelBooking />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/HotelBooking" element={<HotelBooking />} />
      <Route path="/profile" element={<Profile />} />
      <Route path="/my-trips" element={<Mybookings />} />

      <Route path="/admin/*" element={<AdminLayout />}>
        <Route index element={<AdminBookings />} />
        <Route path="bookings" element={<AdminBookings />} />
        <Route path="rooms" element={<AdminRooms />} />
        <Route path="users" element={<AdminUsers/>} />
      </Route>
    </Routes>
  </BrowserRouter>
);

reportWebVitals();
