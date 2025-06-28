import axios from 'axios';
import React, { useEffect, useState,useRef} from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import mapboxgl from 'mapbox-gl'
import 'mapbox-gl/dist/mapbox-gl.css';
import Rating from '@mui/material/Rating';
const API = import.meta.env.VITE_BACKEND_URL;


export default function Show() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [isAuth, setIsAuth] = useState(false);
  const [currentUser,setCurrentUser] = useState(null)
  const [listing, setListing] = useState({
    title: '',
    description: '',
    image: { url: '' },
    price: '',
    location: '',
    country: '',
    reviews: [],
    owner: { username: '' },
    geometry:{
      coordinates:[]
    }
  });

  const [review, setReview] = useState({
    rating: '3',
    comment: ''
  });

  const [reviewErr, setReviewErr] = useState({});

  useEffect(() => {
    fetchListing();
  }, [id]);

  const fetchListing = () => {
    axios.get(`${API}/listings/${id}`, { withCredentials: true })
      .then(res => {
        setListing(res.data.listing);
        setIsAuth(res.data.isAuthenticated);
        setCurrentUser(res.data.currentUser)
      })
      .catch(err => console.error("Failed to fetch listing:", err));
  };

  const handleDelete = () => {
    axios.delete(`${API}/listings/${id}`,{withCredentials:true})
      .then(res => {
        console.log("Listing deleted:", res.data.listing);
        navigate('/');
      })
      .catch(err => console.error("Delete failed:", err));
  };

  const handleReviewSubmit = () => {

    const errors = {};
    if (review.comment.trim() === '') {
      errors.comment = "Comment can't be empty";
    }

    if (Object.keys(errors).length > 0) {
      setReviewErr(errors);
      return;
    }
    const hasReviewed = listing.reviews.some(
  rv => rv.author?._id?.toString() === currentUser?.toString()
);

if (hasReviewed) {
  setReviewErr({ comment: "You already reviewed" });
  return;
}

    setReviewErr({});

    axios.post(`${API}/listings/${id}/reviews`, { review }, {
      headers: { 'Content-Type': 'application/json' },
      withCredentials: true
    }).then(res => {
      console.log("Review submitted:", res.data);
      setReview({ rating: '3', comment: '' });
      fetchListing();
    }).catch(err => console.error("Review submission failed:", err));
  };

  const handleReviewChange = (e) => {
    setReview({ ...review, [e.target.name]: e.target.value });
  };

  const handleReviewDelete = (reviewId) => {
    axios.delete(`${API}/listings/${id}/reviews/${reviewId}`,{withCredentials: true})
      .then(res => {
        console.log("Review deleted:", res.data);
        fetchListing();
      })
      .catch(err => {
        console.error("Error deleting review:", err);
      });

  };

  const mapRef = useRef()
  const mapContainerRef = useRef()

  useEffect(() => {
  mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESSTOKEN;
if (mapRef.current) {
  mapRef.current.remove();
  mapRef.current = null;
}

if (listing.geometry?.coordinates?.length === 2) {
  mapRef.current = new mapboxgl.Map({
    container: mapContainerRef.current,
    style: 'mapbox://styles/mapbox/streets-v11',
    center: listing.geometry.coordinates,
    zoom: 10.12,
  });

  new mapboxgl.Marker()
    .setLngLat(listing.geometry.coordinates)
    .addTo(mapRef.current);
}

  return () => {
    if (mapRef.current) {
      mapRef.current.remove();
      mapRef.current = null;
    }}

  ;
}, [listing.geometry.coordinates]);



  return (
    <div className='bg-gray-100 min-h-screen pb-5'>
      <div className='flex justify-center p-2'>
        <div className='w-200 bg-white rounded-b-xl my-3'>

          <img
            className='object-cover w-full h-100 rounded-t-xl'
            src={listing.image?.url || "https://images.unsplash.com/photo-1518684079-3c830dcef090?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=60"}
            alt="Listing"
          />

          <div className='mx-5'>
            <h1 className='text-2xl font-semibold p-1'>{listing.title}</h1>
            <p>Owned by <i className='font-medium'>@{listing.owner?.username}</i></p>
            <h4 className='text-xl p-1 opacity-75'>{listing.description}</h4>

            <div className='my-2'>
              <p className='text-xl p-1'>Price: ₹{Number(listing.price || 0).toLocaleString("en-IN")}</p>
              <p className='text-xl p-1'>Location: {listing.location}</p>
              <p className='text-xl p-1'>Country: {listing.country}</p>
            </div>
          </div>

          {isAuth && listing.owner && currentUser && listing.owner._id?.toString() === currentUser?.toString() && (

            <div className='flex justify-between mx-5 mb-4 mt-2'>
              <button
                onClick={() => navigate(`/listings/${id}/edit`)}
                className='text-white text-xl hover:bg-blue-600 bg-blue-500 cursor-pointer py-2 px-9 rounded-lg m-1'
              >
                Edit
              </button>

              <button
                onClick={handleDelete}
                className='text-white text-xl bg-red-500 hover:bg-red-600  cursor-pointer py-2 px-5 rounded-lg m-1'
              >
                Delete
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Review Form + Reviews */}
      {isAuth && (

        <div>
          {/* Review Form */}
          <div className='w-full'>
            <div className='mx-auto w-80 bg-white p-5 mt-5 mb-5 rounded-xl'>
              <div className='my-2'>
                <label className='block' htmlFor="rating">Rating:</label>
                <Rating
  value={Number(review.rating)}
  onChange={(e, newValue) => setReview({ ...review, rating: newValue })}
  size="large"
  precision={1}
  sx={{ color: "#f59e0b" }}
/>
              </div>

              <div>
                <label className='block' htmlFor="comment">Comments</label>
                <textarea
                  className='border border-dark rounded-lg block w-70 p-2'
                  id="comment"
                  name="comment"
                  value={review.comment}
                  onChange={handleReviewChange}
                ></textarea>
                {reviewErr?.comment && (
                  <p className="text-sm text-red-600 mt-1">{reviewErr.comment}</p>
                )}
              </div>

              <div className='mx-auto flex justify-center'>
                <button
                  className='my-4 bg-red-500 hover:bg-red-600  cursor-pointer text-white rounded-lg px-3 py-1'
                  onClick={handleReviewSubmit}
                >
                  Submit
                </button>
              </div>
            </div>
          </div>

          {/* Reviews List */}
          {listing.reviews && listing.reviews.length > 0 && (
            <div className="mx-2 md:mx-auto lg:mx-auto max-w-200 bg-white p-5 mb-5 rounded-xl">
              <h2 className="text-xl font-semibold mb-3">Reviews</h2>
              <div className='grid grid-cols-2 gap-10'>
                
                {listing.reviews.map((rv, index) => (
                  <div key={index} className="border border-gray-300 p-2 mb-2 rounded-xl">
                    <div><strong>Rating:</strong> 
                    <Rating name="read-only"  value={Number(rv.rating)} readOnly precision={1} />
<p><strong>By:</strong> @{rv.author?.username || 'Unknown'}</p>
                    
  
                    </div>
                    <p><strong>Comment:</strong> {rv.comment}</p>
                    <p className="text-sm text-gray-500">
  {new Date(rv.createdAt).toLocaleDateString()}
</p>

                    {isAuth && rv.author?._id?.toString() === currentUser?.toString() && 
                    <button
                      onClick={() => handleReviewDelete(rv._id)}
                      className='px-2 bg-red-500 hover:bg-red-600  cursor-pointer text-white rounded-lg'
                    >
                      Delete
                    </button>
}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      {listing.geometry?.coordinates && <div className='mx-5 lg:mx-auto md:mx-auto'><div id='map-container ' ref={mapContainerRef} className='h-80 w-full mx-auto max-w-4xl  rounded-xl mb-5'></div></div>}
    </div>
    
  );
}
