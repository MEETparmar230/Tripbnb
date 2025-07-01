import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
const API = import.meta.env.VITE_BACKEND_URL;


export default function SignUp({ serverError, setServerError}) {
  const navigate = useNavigate()
  const [signing , setSigning] = useState(false)
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
  e.preventDefault();

  setSigning(true);
  setServerError(null);

  try {
    const response = await axios.post(
      `${API}/signup`,
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );

    if (response.data.message === 'User was registered') {
      navigate("/");
    } else {
      setServerError(response.data.message);
    }
  } catch (error) {
    setServerError(error.response?.data?.message || 'Something went wrong.');
    console.error(error);
  } finally {
    setSigning(false);
  }
};



  return (
    <div className='flex justify-center mx-4'>
    <div className="max-w-sm mt-10 p-4 border rounded-xl">
      <form onSubmit={handleSubmit}>
        <label className="font-semibold block" htmlFor="username">User Name:</label>
        <input
          className="border rounded-md mb-2 p-1 w-full"
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          required
        />

        <label className="font-semibold block" htmlFor="email">Email:</label>
        <input
          className="border rounded-md mb-2 p-1 w-full"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <label className="font-semibold block" htmlFor="password">Password:</label>
        <input
          className="border rounded-md mb-4 p-1 w-full"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button
          className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
          type="submit"
          disabled={signing}
        >{signing ? (
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
              Signing up...
            </div>
          ) : 'Sign up'}
        </button>
      </form>
    </div>
    </div>
  )
}
