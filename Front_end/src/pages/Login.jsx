import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const API = import.meta.env.VITE_BACKEND_URL;



export default function Login() {

  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    username: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await axios.post(`${API}/login`, formData, {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      })
      alert('log in successful!')
      navigate("/")
    }
    catch (error) {
      if (error.response && error.response.status === 401) {
        alert(`Error: ${error.response.data.message}`)
      } else {
        alert('Something went wrong.')
      }
      console.error(error)
    }
  }

  return (
    <div className='bg-gray-100 pt-10 pb-10 h-full'>
      <div className="max-w-sm mx-auto p-4 border rounded-xl">
        <form className='py-3' onSubmit={handleSubmit}>
          <label className="font-semibold block" htmlFor="username">User Name:</label>
          <input
            className="border rounded-md mb-5 p-1 w-full"
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />

          <label className="font-semibold block" htmlFor="password">Password:</label>
          <input
            className="border rounded-md mb-5 p-1 w-full"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />

          <button
            className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
            type="submit"
          >
            Login
          </button>
        </form>
      </div>
      
    </div>
  )
}
