import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import Message from './components/layout/Message';
// pages
import Home from './components/pages/Home';
import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';

// context
import { UserProvider } from './context/UserContext';

function App() {
  return (
    
    <Router>
      <UserProvider>
      <div className="App">
      <Navbar />
        <Container>
          <Message />
          <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/" element={<Home />} />
          </Routes> 
        </Container>
      </div>
      <Footer />
      </UserProvider>
    </Router>
  );
}

export default App;
