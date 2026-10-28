import Admin from "./admin/Admin";
import Login from "./Login"
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import Shipper from "./shipper/Shipper";
import Customer from "./customer/Customer";
import ShipperProfile from "./shipper/ShipperProfile";
import ProtectedRoute from "./ProtectedRoute";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element= {<Login/>}/>
          <Route path="/login" element={<Login/>} />
          <Route element={<ProtectedRoute requiredRole="Admin" />}>
            <Route path="/admin" element={<Admin />} />

          </Route>
          <Route element={<ProtectedRoute requiredRole="Shipper" />}>
            <Route path="/shipper" element={<Shipper />} />
            <Route path="/shipper/profile" element={<ShipperProfile />} />
          </Route>
          <Route path="/customer" element={<Customer/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
