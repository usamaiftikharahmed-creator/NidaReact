import './App.css'
import { Route, Routes } from 'react-router-dom';
import Login from './login';
import Signup from './signup';
import Home from './home';
import Admin from './Admin';
function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<Signup/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/home" element={<Home/>} />
        <Route path="/admin" element={<Admin />} />

      </Routes>
    </>
  )
}
export default App;