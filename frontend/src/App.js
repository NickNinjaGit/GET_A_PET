import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

// components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import Container from './components/layout/Container';
import Message from './components/layout/Message';



import Home from './components/pages/Home';
// User Pages

import Login from './components/pages/Auth/Login';
import Register from './components/pages/Auth/Register';
import Profile from './components/pages/User/Profile';

// Pet pages
import AddPet from './components/pages/Pet/AddPet';
import EditPet from './components/pages/Pet/EditPet';
import MyPets from './components/pages/Pet/MyPets';
import MyAdoptions from './components/pages/Pet/MyAdoptions';
import PetDetails from './components/pages/Pet/PetDetails';


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
              <Route path="/user/profile" element={<Profile />} />
              <Route path="/pet/mypets" element={<MyPets />} />
              <Route path="/pet/add" element={<AddPet />} />
              <Route path="/pet/:id" element={<PetDetails />} />
              <Route path="/pet/edit/:id" element={<EditPet />} />
              <Route path="/pet/myadoptions" element={<MyAdoptions />} />
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
