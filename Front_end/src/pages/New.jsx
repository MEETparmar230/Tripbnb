import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const API = import.meta.env.VITE_BACKEND_URL;

export default function New({ serverError, setServerError }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    location: '',
    country: '',
    image: null,
  });

  const [error, setError] = useState({});
  const [isAuth, setIsAuth] = useState(false);
  const [authenticating, setAuthenticating] = useState(false);
  const [loading, setLoading] = useState(false);
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif'];

  useEffect(() => {
    setAuthenticating(true);
    axios
      .get(`${API}/check-auth`, { withCredentials: true })
      .then((res) => {
        setIsAuth(res.data.isAuthenticated);
        setServerError(res.data.message);
      })
      .catch((err) => {
        setServerError(err.response?.data?.err || "Authentication failed.");
      })
      .finally(() => setAuthenticating(false));
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newError = {};
    if (formData.title.trim() === '') newError.title = 'Title is required';
    if (formData.description.trim() === '') newError.description = 'Description is required';
    if (formData.price.trim() === '') newError.price = 'Price is required';
    if (formData.location.trim() === '') newError.location = 'Location is required';
    if (formData.country.trim() === '') newError.country = 'Country is required';
    if (!formData.image) newError.image = 'Image is required';

    return newError;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setError(validationErrors);
      return;
    }

    setError({});
    const formPayload = new FormData();
    formPayload.append('title', formData.title);
    formPayload.append('description', formData.description);
    formPayload.append('price', Number(formData.price));
    formPayload.append('location', formData.location);
    formPayload.append('country', formData.country);
    formPayload.append('image', formData.image);

    setServerError('');
    setLoading(true);
    axios
      .post(`${API}/listings`, formPayload, {
        withCredentials: true,
      })
      .then((res) => {
        const message = res.data.message;
        if (message === 'Listing created') {
          navigate('/');
        }
        else {
          setServerError(message);
        }
      })
      .catch((err) => {
        console.error('Submission failed:', err);
      })
      .finally(() => setLoading(false));
  };





  return (
    <>
      {authenticating ? (
        <div className=" flex items-center justify-center mt-50 gap-2">
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
          Authenticating...
        </div>
      ) : isAuth ? (
        <div className="bg-gray-100 py-6 px-5 mx-4">
          <div className="bg-white max-w-130 mx-auto py-5 px-5 rounded-xl">
            <h3 className="text-2xl font-semibold text-center mb-5">Create a New Listing</h3>

            <div className="max-w-130 mx-auto">
              <form
                className="grid grid-cols-1"
                onSubmit={handleSubmit}
                noValidate
                encType="multipart/form-data"
              >
                <label className="font-semibold" htmlFor="title">Title:</label>
                <input
                  className="border rounded-md mb-2 p-1"
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {error.title && <p className="text-red-500 text-sm mb-2">{error.title}</p>}

                <label className="font-semibold" htmlFor="description">Description:</label>
                <textarea
                  className="border rounded-md mb-2 p-1"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                />
                {error.description && <p className="text-red-500 text-sm mb-2">{error.description}</p>}

                <label className="font-semibold">Upload Image</label>
                <input
                  className="border rounded-md p-1"
                  type="file"
                  name="image"
                  accept=".jpg,.jpeg,.png,.avif"
                  onChange={(e) => {
                    const file = e.target.files[0];
                    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/avif'];

                    if (!file) return;

                    if (!allowedTypes.includes(file.type)) {
                      setServerError('Only JPG, PNG and AVIF files are allowed.');
                      setFormData({ ...formData, image: null });
                      return;
                    }

                    setFormData({ ...formData, image: file });
                    setServerError('');
                  }}
                />
                {error.image && <p className="text-red-500 text-sm mb-2">{error.image}</p>}

                <div className="inline md:flex sm:flex lg:flex justify-center gap-10">
                  <div className="grid grid-cols-1">
                    <label className="font-semibold" htmlFor="location">Location:</label>
                    <input
                      className="border rounded-md w-55 p-1 h-9"
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                    />
                    {error.location ? (
                      <p className="text-red-500 text-sm mb-2">{error.location}</p>
                    ) : (
                      <div className="h-6"></div>
                    )}
                  </div>
                  <div className="grid grid-cols-1">
                    <label className="font-semibold" htmlFor="country">Country:</label>
                    <input
                      className="border rounded-md w-55 p-1 h-9"
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                    />
                    {error.country ? (
                      <p className="text-red-500 text-sm mb-2">{error.country}</p>
                    ) : (
                      <div className="h-6"></div>
                    )}
                  </div>
                </div>

                <label className="font-semibold" htmlFor="price">Price:</label>
                <input
                  className="border rounded-md mb-2 px-2 w-50 p-1"
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                />
                {error.price && <p className="text-red-500 text-sm mb-2">{error.price}</p>}

                <button
                  className="bg-green-500 px-3 py-2 rounded-lg my-2 text-white hover:bg-green-600"
                  type="submit"
                  disabled={loading}
                >
                  {loading ? (
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
                      Creating...
                    </div>
                  ) : (
                    'Create'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className="my-22 flex items-center justify-center">
          <p className="text-red-400 border border-red-400 py-2 px-3 rounded-xl">
            You need to Log in for Becoming Host
          </p>
        </div>
      )}
    </>
  );
}
