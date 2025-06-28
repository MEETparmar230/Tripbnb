import React from 'react'
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";



export default function Search() {

    const [listings, setListings] = useState([]);
   const [country ,setCountry] = useState("")
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(() => {
    

    const params = new URLSearchParams(location.search)
    const country = params.get("country")

    
if (!country) return;
    axios
      .get(`http://localhost:8080/search?country=${country}`)
      .then((res) => {
        setListings(res.data.listings);
        
      })
      .catch((err) => {
        console.error("Search failed", err);
      });
  }, [country]);
  return (
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
  )
}
