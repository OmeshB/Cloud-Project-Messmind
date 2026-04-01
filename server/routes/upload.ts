import express from "express";
import multer from "multer";
import { uploadToBlob } from "../services/blobService";

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
});

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file as Express.Multer.File; // ✅ fix

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const imageUrl = await uploadToBlob(
      file.buffer,
      file.originalname,
      file.mimetype
    );

    res.status(200).json({
      message: "Upload successful",
      imageUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;