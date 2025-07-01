import Listing from '../models/listing.js'
import { v2 as cloudinary } from 'cloudinary'
import dotenv from 'dotenv'
dotenv.config()
import axios from 'axios'

export const index = async (req, res) => {
  const allListings = await Listing.find({});
  res.json({
    listings: allListings,
    isAuthenticated: req.isAuthenticated()
  });

}

export const singleIndex = async (req, res) => {
  const { id } = req.params;

  const listing = await Listing.findById(id)
    .populate({
      path: 'reviews',
      populate: {
        path: 'author',
        select: 'username'  
      }
    })
    .populate('owner', 'username'); 

  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  res.json({
    listing: listing,
    isAuthenticated: req.isAuthenticated(),
    currentUser: req.user?._id
  });
};

export const newForm = async (req, res) => {
  try {

    console.log("User:", req.user);
    console.log("File:", req.file);

    const url = req.file?.path;
    const filename = req.file?.filename;

    const { title, description, price, location, country } = req.body;

    const mapboxToken = process.env.MAPBOX_ACCESSTOKEN
const geoRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`,
      {
        params: {
          access_token: mapboxToken,
        }
      }
    )

    if (!geoRes.data.features || geoRes.data.features.length === 0) {
      return res.status(400).json({ message: "Invalid location, could not geocode." });
    }

    const [longitude, latitude] = geoRes.data.features[0].center;
    const newListing = new Listing({
      title,
      description,
      price,
      location,
      country,
      geometry: {
        type: "Point",
        coordinates: [longitude, latitude]
      },
      image: { url, filename },
      owner: req.user._id
    });

    await newListing.save();

    res.status(201).json({ message: "Listing created", listing: newListing });
  } catch (err) {
    console.error("Error in newForm controller:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};


export const updateForm = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const { title, description, price, location, country } = req.body;

    const updateData = {
      title,
      description,
      price,
      location,
      country
    };

    
    const mapboxToken = process.env.MAPBOX_ACCESSTOKEN;
    const geoRes = await axios.get(`https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(location)}.json`, {
      params: {
        access_token: mapboxToken,
      }
    });

    if (!geoRes.data.features || geoRes.data.features.length === 0) {
      return res.status(400).json({ message: "Invalid location, could not geocode." });
    }

    const [longitude, latitude] = geoRes.data.features[0].center;
    updateData.geometry = {
      type: "Point",
      coordinates: [longitude, latitude],
    };

    if (req.file) {
      if (listing.image?.filename) {
        try {
          await cloudinary.uploader.destroy(listing.image.filename);
        } catch (err) {
          console.log("Failed to delete old image from external server:", err.message);
        }
      }

      updateData.image = {
        url: req.file.path,
        filename: req.file.filename
      };
    }

    const updatedListing = await Listing.findByIdAndUpdate(id, updateData, { new: true });

    if (!updatedListing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ message: "Listing updated", listing: updatedListing });
  } catch (err) {
    console.error("Error in updateForm controller:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};




export const deleteOne = async (req, res) => {
  const { id } = req.params;
  const listing = await Listing.findById(id)
  if (!listing) {
    return res.status(404).json({ message: "Listing not found" });
  }

  if (listing.image && listing.image.filename) {
    try {
      await cloudinary.uploader.destroy(listing.image.filename, { invalidate: true })
    }
    catch (error) {
      console.error("Cloudinary image deletion failed:", error);
    }
  }

  const deletedListing = await Listing.findByIdAndDelete(id);
  if (!deletedListing) {
    return res.status(404).json({ message: "Listing not found" });
  }
  res.json({ message: "Listing deleted" });

}