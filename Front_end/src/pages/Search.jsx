import React from 'react'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
const API = import.meta.env.VITE_BACKEND_URL;



export default function Search({ serverError, setServerError}) {

  const [listings, setListings] = useState([]);
  const [country, setCountry] = useState("")
  const location = useLocation()
  const navigate = useNavigate()
  const [serching, setSeaching] = useState(false)

  useEffect(() => {


    const params = new URLSearchParams(location.search)
    const country = params.get("country")


    if (!country) return;
    setSeaching(true)
    axios
      .get(`${API}/search?country=${country}`)
      .then((res) => {
        setListings(res.data.listings);
        setServerError('');

      })
      .catch((err) => {
        setServerError(err.response?.data?.message || "Something went wrong.");
        console.error("Search failed", err);
      })
      .finally(() => setSeaching(false))
  }, [location.search]);
  return (
    <>

      {serching ? (
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
          Searching...
        </div>
      ) :

        <div className="py-3">


          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 justify-center gap-2 mx-3">
            {listings.map((listing) => (
              <div
                key={listing._id}
                className="mx-auto  bg-white border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700 h-auto w-full md:h-64 "
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
        }
    </>
  )
}
