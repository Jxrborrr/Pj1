import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Button from '@mui/material/Button';

import HotelBookingTemplate from "./main/HotelBooking"; 
import Mybookings from "./main/Mybookings";
import SignIn from "./login/SignIn"; 
import Register from "./register/Register";
import AdminBookings from "./main/AdminBookings"; 

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HotelBookingTemplate />} />
        <Route path="/login" element={<SignIn />} />
        <Route path="/register" element={<Register />} />
        <Route path="/my-trips" element={<Mybookings />} />
        <Route path="/hotelbooking" element={<HotelBookingTemplate />} />
      </Routes>
    </Router>
  );
}

export default App;
