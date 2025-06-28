import axios from 'axios'
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'


export default function SignUp() {
  const navigate = useNavigate()
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

  try {
    const response = await axios.post(
      'http://localhost:8080/signup',
      formData,
      {
        headers: {
          'Content-Type': 'application/json'
        },
        withCredentials: true
      }
    );
    
    alert('User registered successfully!');
    navigate("/")

  } catch (error) {
    if (error.response) {
      alert(`Error: ${error.response.data.message}`);
    } else {
      alert('Something went wrong.');
    }
    console.error(error);
  }
};


  return (
    <div className="max-w-sm mx-auto mt-10 p-4 border rounded-xl">
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
        >
          Sign Up
        </button>
      </form>
    </div>
  )
}
