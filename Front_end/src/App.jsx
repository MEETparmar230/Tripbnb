import React from 'react'
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



export default function App() {
  return (
    

      <BrowserRouter>
        <div className='flex flex-col min-h-screen max-w-screen'>

          <Navbar />
          <main className='flex-grow bg-gray-100 '>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/listings/new" element={<New />} />
              <Route path="/listings/:id/edit" element={<Edit />} />
              <Route path="/listings/:id" element={<Show />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/login" element={<Login />} />
              <Route path="/search" element={<Search />} />

            </Routes>
        </main>
        <Footer />
        
      </div>
    </BrowserRouter>
    
   
  )
}

