import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Error from '../components/Error';
const API = import.meta.env.VITE_BACKEND_URL;



export default function Edit({ serverError, setServerError} ) {

  const navigate = useNavigate()
  const [loading,setLoading] = useState()
  const [editing, setEditing] = useState()

  const { id } = useParams();


  const [formData, setFormData] = useState(
    {
      title: '',
      description: '',
      image: {
        url: '',
        filename: ''
      },
      price: '',
      location: '',
      country: ''

    }
  );

  useEffect(() => {
    setLoading(true)
    setServerError('');
    axios.get(`${API}/listings/${id}`, {withCredentials: true })
      .then(res => {
        const listing = res.data.listing || res.data;
        const message = res.message;
        setFormData({
          title: listing.title ?? '',
          description: listing.description ?? '',
          price: listing.price ?? '',
          location: listing.location ?? '',
          country: listing.country ?? '',
          image: {
            url: listing.image?.url ?? '',
            filename: listing.image?.filename ?? ''
          }
        });
      })
      .catch(err => {
        if (err.response?.data?.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      })
      .finally(()=>setLoading(false))
  }, [id]);


  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const [error, setError] = useState({})

  const validate = () => {
    const newError = {}
    if (formData.title.trim() === '') newError.title = 'Title is required'
    if (formData.description.trim() === '') newError.description = 'Description is required'
    if (formData.price === '') newError.price = 'Price is required'
    if (formData.price < 0) newError.price = "Price should be Positive number"
    if (formData.location.trim() === '') newError.location = 'Location is required'
    if (formData.country.trim() === '') newError.country = 'Country is required'
    return newError
  }


  const handleSubmit = (e) => {
    e.preventDefault()

    const validationErrors = validate()
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors)
      return
    }
    setError({})
    

    const formDataToSend = new FormData();
    formDataToSend.append('title', formData.title);
    formDataToSend.append('description', formData.description);
    formDataToSend.append('price', formData.price);
    formDataToSend.append('location', formData.location);
    formDataToSend.append('country', formData.country);

    if (formData.newImage) {
      formDataToSend.append('image', formData.newImage);
    }
    setServerError('');
setEditing(true)

    axios.put(`${API}/listings/${id}`, formDataToSend, {

      withCredentials: true,
      headers: { "Content-Type": "multipart/form-data" }
    })

      .then(res => {
        console.log("updated", res.data)
        const message = res.data.message;
        if (message === 'Listing updated') {
          navigate(`/listings/${id}`)
        }
        else {
          setServerError(message)
        }
      })
      .catch(err => {
        if (err.response?.data?.message) {
          setServerError(err.response.data.message);
        } else {
          setServerError("Something went wrong. Please try again.");
        }
      })
      .finally(()=>setEditing(false))
  }
  const lowResUrl = formData.image.url.replace("/upload", "/upload/w_250")
  return (
    <>
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
      <div className='flex items-center justify-center'>

        <div className=' bg-gray-100 sm:py-5  md:py-5 lg:py-5 py-10 px-5'>
          <div className=' bg-white max-w-130 mx-auto py-5 rounded-xl px-10'>


            <div className='max-w-130 mx-auto '>
              <form className=' grid grid-cols-1' onSubmit={handleSubmit} noValidate >

                <label className='font-semibold ' htmlFor="title">Title : </label>
                <input className='border rounded-md  p-1' type="text" name="title" value={formData.title} onChange={handleChange} />
                {error.title && <p className='text-red-500 text-sm '>{error.title}</p>}

                <label className='font-semibold  mt-5 ' htmlFor="description">Description : </label>
                <textarea className='border rounded-md p-1' name="description" value={formData.description} onChange={handleChange} />
                {error.description && <p className='text-red-500 text-sm '>{error.description}</p>}

                {formData.image?.url ? (<img src={lowResUrl} alt="Current" className="mt-5 h-32 object-cover mb-2 rounded-md" />) : (<p>Image doesn't Exists</p>)}
                <input className='border rounded-md p-1' type="file" name="image" onChange={(e) => setFormData({ ...formData, newImage: e.target.files[0] })} />



                <div className='inline md:flex sm:flex lg:flex justiify-center gap-10'>


                  <div className='grid grid-cols-1'>

                    <label className='font-semibold  mt-5 ' htmlFor="location">Location : </label>
                    <input className='border rounded-md  md:w-50 lg:w-50 w-full p-1 h-9' type="text" name="location" value={formData.location} onChange={handleChange} />
                    {error.location && <p className='text-red-500 text-sm '>{error.location}</p>}
                  </div>
                  <div className='grid grid-cols-1'>
                    <label className='font-semibold mt-5  ' htmlFor="country">Country : </label>
                    <input className='border rounded-md  md:w-50 lg:w-50 w-full p-1 h-9 ' type="text" name="country" value={formData.country} onChange={handleChange} />
                    {error.country && <p className='text-red-500 text-sm '>{error.country}</p>}
                  </div>
                </div>

                <label className='font-semibold  mt-5 ' htmlFor="price">Price : </label>
                <input className='border rounded-md   md:w-50 lg:w-50 w-full p-1' type="number" name="price" value={formData.price} onChange={handleChange} />
                {error.price && <p className='text-red-500 text-sm '>{error.price}</p>}



                <button className='bg-blue-500 px-3 py-1 rounded-lg py-2 my-2 text-white' type="submit">
                  {editing ? (
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
              Updating...
            </div>
          ) : 'Edit'}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
}
    </>
  )
}
