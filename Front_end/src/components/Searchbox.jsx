import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

export default function Searchbox() {
    const navigate = useNavigate()
    const [country, setCountry] = useState("");

    const handleSearch = (e) => {
        e.preventDefault();
        if (!country.trim()) return;
        navigate(`/search?country=${country}`);
        
    };

  return (
    <form className='flex gap-1 items-center justify-center mx-auto mt-7 '>
                    <input onChange={(e) => setCountry(e.target.value)} value={country} className='border border-gray-700 focus:border-gray-800 rounded-lg py-1 px-2' type="text" placeholder='Search Country'  /> <button onClick={handleSearch} className='bg-gray-700 text-white rounded-xl hover:bg-gray-800 py-1 px-3 cursor-pointer'>Search</button>
                </form>
  )
}
