import Admin from "./admin/Admin";
import Login from "./Login"
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';
import Shipper from "./shipper/Shipper";
import Customer from "./customer/Customer";
import ShipperProfile from "./shipper/ShipperProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<Login/>}/>
          <Route path="/login" element={<Login/>} />
          <Route path="/admin" element={<Admin/>}/>
          <Route path="/shipper" element={<Shipper/>}/>
          <Route path="/shipper/profile" element={<ShipperProfile/>}/>
          <Route path="/customer" element={<Customer/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
