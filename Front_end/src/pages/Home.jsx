import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const API = import.meta.env.VITE_BACKEND_URL;

export default function Home() {
  const navigate = useNavigate();
  const [alllistings, setAllListings] = useState([]);
  

  
  const checkAuthAndListings = () => {
    axios
      .get(`${API}/listings`, { withCredentials: true })
      .then((res) => {
        setAllListings(res.data.listings);
        
      })
      .catch((err) => console.error('Error:', err));
  };

  
  

  
  useEffect(() => {
    checkAuthAndListings();
  }, []);

  return (
    <div className="py-3">
      

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-2 mx-3">
        {alllistings.map((listing) => (
          <div
            key={listing._id}
            className="mx-auto md:w-full bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-auto w-full md:h-64 "
            onClick={() => navigate(`/listings/${listing._id}`)}
          ><div>
            <img
              className="max-h-54  md:h-46 object-cover w-full rounded-t-lg"
              src={
                listing.image?.url ||
                'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60'
              }
              alt={listing.image?.filename || 'Listing image'}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src =
                  'https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60';
              }}
            />
            </div>
            <div className="flex items-center justify-center h-18 ">
              <p className="text-center px-2 text-2xl font-semibold tracking-tight text-gray-900 dark:text-white ">
                {listing.title}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
