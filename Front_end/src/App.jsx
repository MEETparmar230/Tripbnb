import React, { useState,  useEffect   } from 'react'
import Home from './pages/Home'
import New from './pages/New'
import Edit from './pages/Edit'
import Show from './pages/Show'
import SignUp from './pages/SignUp'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Login from './pages/Login'
import Navbar from '../src/components/Navbar'
import Footer from '../src/components/Footer'
import Search from './pages/Search'
import Error from './components/Error'
import { useLocation} from 'react-router-dom';
import NotFound from './pages/NotFound';


export default function App() {
  const [serverError, setServerError] = useState('');
  const location = useLocation();

  useEffect(() => {
    setServerError('');
  }, [location]);

  return (
    

    
        <div className='flex flex-col min-h-screen max-w-screen '>

          <Navbar />
          <Error serverError={serverError} />
          <main className='flex-grow bg-gray-100 '>
            <Routes>
              <Route path="/" element={<Home serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/listings/new" element={<New serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/listings/:id/edit" element={<Edit serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/listings/:id" element={<Show serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/signup" element={<SignUp serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/login" element={<Login serverError={serverError}  setServerError={setServerError} />} />
              <Route path="/search" element={<Search serverError={serverError}  setServerError={setServerError} />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
        </main>
        <Footer />
        
      </div>
 
    
   
  )
}

