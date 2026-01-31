import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const API = import.meta.env.VITE_BACKEND_URL;



export default function Login({ serverError, setServerError}) {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    username: 'Guest',
    password: 'Guest@123'
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
    setServerError('');
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setServerError('');
      setLoading(true)
      const response = await axios.post(`${API}/login`, formData, {
        headers: { 'Content-Type': 'application/json' },
        withCredentials: true
      });


      console.log("Login response:", response.data);
      const message = response.data.message

      if (message === 'Welcome! You are logged in!') {
          setServerError('');
          navigate("/");
        }
      
      else {
        setServerError(message)
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setServerError(`Error: ${error.response.data.message}`);
      } else {
        setServerError('Something went wrong.');
      }
      console.error("Login error:", error);
    }
    finally {
      setLoading(false);
    }
  }


  return (
    <div className='bg-gray-100 pt-10 pb-10 h-full mx-4'>
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
            disabled={loading || !formData.username || !formData.password}
          >{loading ? (
            <div className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                  fill="none"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Logging in...
            </div>
          ) : 'Login'}
          </button>
        </form>
      </div>

    </div>
  )
}
