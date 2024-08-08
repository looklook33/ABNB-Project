const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { ReviewImage, Review } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

//Delete a Review Image
router.delete("/:imageId", requireAuth, async (req, res) => {
    const image = await ReviewImage.findByPk(req.params.imageId, {
      include: {
         model: Review, 
         attributes: ["userId"] 
        },
    });
  
    if (!image) {
      return res.status(404).json({
        message: "Review Image couldn't be found",
      });
    }

    const review = await Review.findByPk(image.reviewId);

    if (review.userId !== req.user.id) {
      return res.status(403).json({
        message: "Forbidden",
      });
    } 

      await image.destroy();
      return res.status(200).json({
        message: "Successfully deleted",
      });
  });
module.exports = router;