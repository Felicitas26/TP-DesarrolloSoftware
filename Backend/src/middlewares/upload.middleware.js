import multer from "multer";
import path from "path";
import fs from "fs";

const uploadsDir = path.resolve("uploads");

if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir);
    },
    filename: (req, file, cb) => {
        const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
        const safeName = file.originalname.replace(/\s+/g, "_").replace(/[^a-zA-Z0-9._-]/g, "");
        const ext = path.extname(safeName) || path.extname(file.originalname) || ".jpg";
        cb(null, `${unique}${ext}`);
    }
});

const fileFilter = (req, file, cb) => {
    const allowed = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowed.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error("Solo se permiten imágenes (JPG, PNG, WEBP, GIF)."), false);
    }
};

export const uploadSingleImage = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
}).single("image");