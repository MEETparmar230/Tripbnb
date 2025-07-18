import React from 'react'

export default function Footer() {
  return (
    <div className='bg-gray-200 py-5'>
      <div className='flex justify-between  border-t mb-3  border-gray-200 lg:mx-10 mx-5'>
        <div className='ms-5 whitespace-nowrap'>
          &copy; 2025 Tripbnb
        </div>
        
        <div className='flex justify-center gap-5 me-5'>
          <a href=""><i className="fa-brands fa-instagram"></i></a>
          <a href=""><i className="fa-brands fa-facebook"></i></a>
          <a href=""><i className="fa-brands fa-x-twitter"></i></a>
        </div>


      </div>
      
    </div>
  )
}
