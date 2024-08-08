const express = require("express");
const { setTokenCookie, requireAuth } = require("../../utils/auth");
const { Spot, SpotImage, User } = require("../../db/models");
const { handleValidationErrors } = require("../../utils/validation");
const router = express.Router();

// Delete a Spot Image
router.delete("/:imageId", requireAuth, async (req, res) => {
  const image = await SpotImage.findByPk(req.params.imageId, {
    include: { 
      model: Spot, 
      attributes: ["ownerId"] 
    },
  });
  
  if (!image) {
    return res.status(404).json({
      message: "Spot Image couldn't be found",
    });
  }

  if (image.Spot.ownerId !== req.user.id) {
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