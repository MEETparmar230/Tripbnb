import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Error from '../components/Error';
const API = import.meta.env.VITE_BACKEND_URL;

export default function Home({ serverError, setServerError}) {
  const navigate = useNavigate();
  const [alllistings, setAllListings] = useState([]);
  const [loading , setLoading] = useState(false)

  const checkAuthAndListings = () => {
    setLoading(true)
    axios
      .get(`${API}/listings`, { withCredentials: true })
      .then((res) => {
        setAllListings(res.data.listings);
         setServerError('');
      })
      .catch((err) => {
        console.error('Error:', err);
        if (err.response?.data?.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Failed to load listings. Please try again.");
        }
      })
      .finally(()=>setLoading(false))
  };





  useEffect(() => {
    checkAuthAndListings();
  }, []);

  return (
    <div className="py-3">
      {loading ? (
        <div className="flex items-center justify-center mt-50 gap-2">
          <svg className="animate-spin h-5 w-5 text-blue-500" viewBox="0 0 24 24">
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
          Loading...
        </div>
      ) :


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
      </div>}
    </div>
  );
}
