import Admin from "./admin/Admin";
import Login from "./Login"
import { BrowserRouter, Routes, Route, Link, Outlet } from 'react-router-dom';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login/>} />
          <Route path="/admin" element={<Admin/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
