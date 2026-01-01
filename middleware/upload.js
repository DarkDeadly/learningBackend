// middleware/upload.js

import multer from "multer";

const storage = multer.memoryStorage();

// Only audio upload now
export const uploadAudio = multer({
    storage: storage,
    limits: {
        fileSize: 50 * 1024 * 1024  // 50MB max
    },
    fileFilter: (req, file, cb) => {
        const allowedTypes = [
            'audio/mpeg',      // mp3
            'audio/wav',       // wav
            'audio/mp4',       // m4a
            'audio/webm',      // webm
            'audio/ogg'        // ogg
        ];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Only audio files allowed'), false);
        }
    }
});