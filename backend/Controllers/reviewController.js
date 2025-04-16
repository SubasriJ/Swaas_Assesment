
const reviewService = require('../Services/reviewService');

const createReview = async (req, res) => {
  const { event_id, rating, reviews } = req.body;
  const email = req.user.email; // From JWT middleware

  // Validation
  if (!event_id || !Number.isInteger(event_id)) {
    return res.status(400).json({ error: 'Invalid or missing event_id' });
  }
  if (!rating || !Number.isInteger(rating) || rating < 1 || rating > 5) {
    return res.status(400).json({ error: 'Rating must be an integer between 1 and 5' });
  }
  if (reviews && (typeof reviews !== 'string' || reviews.length > 500)) {
    return res.status(400).json({ error: 'Reviews must be a string, max 500 characters' });
  }
  if (!email || typeof email !== 'string') {
    return res.status(401).json({ error: 'Invalid or missing email from authentication' });
  }

  try {
    const review = await reviewService.createReview(event_id, email, rating, reviews || null);
    res.status(201).json({
      message: 'Review created successfully',
      review: {
        id: review.id,
        event_id: review.event_id,
        email: review.email,
        rating: review.rating,
        reviews: review.reviews
      }
    });
  } catch (error) {
    console.error('[ReviewController] Error:', error.message);
    res.status(500).json({ error: 'Failed to create review' });
  }
};

module.exports = { createReview };
