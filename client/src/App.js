import './App.css';
import Navbar from './components/Navbar';
import your_account from './components/your_account';
import your_account from './components/your_account';
import your_account from './components/your_account';
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/your_account1" element={<your_account />} />
          <Route path="/your_account2" element={<your_account />} />
          <Route path="/your_account" element={<your_account />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
