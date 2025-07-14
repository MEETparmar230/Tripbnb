import Review from '../models/review.js'
import Listing from '../models/listing.js'

export const createReview = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    console.log("➡️ Incoming review:", req.body.review);
    console.log("➡️ Logged in user:", req.user);

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    await newReview.populate('author', 'username');

    listing.reviews.push(newReview);
    await listing.save();

    res.status(201).json({
      message: "New Review Saved",
      review: {
        _id: newReview._id,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt,
        author: {
          _id: newReview.author._id,
          username: newReview.author.username
        }
      }
    });

  } catch (err) {
    console.error("🔥 Error in createReview:", err);
    res.status(500).json({ message: "Internal Server Error", error: err.message });
  }
};

export const deleteReview = async (req, res) => {
  const { id, reviewId } = req.params;

  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  await Review.findByIdAndDelete(reviewId);

  res.status(200).json({ message: "Review deleted successfully" });

}