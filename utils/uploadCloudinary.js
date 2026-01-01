import Cloudinary from "../config/cloudinary.js";

const uploadToCloudinary = (buffer, options) => {
    return new Promise((resolve, reject) => {
        const uploadStream = Cloudinary.uploader.upload_stream(
            options,
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            }
        );
        uploadStream.end(buffer);
    });
};

export const uploadAudioToCloudinary = async (buffer, filename) => {
    const result = await uploadToCloudinary(buffer, {
        folder: 'education-app/recordings',
        resource_type: 'video',  // Cloudinary uses 'video' for audio
        public_id: `recording-${Date.now()}-${filename}`
    });

    return {
        url: result.secure_url,
        publicId: result.public_id,
        size: result.bytes,
        duration: result.duration || null
    };
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await Cloudinary.uploader.destroy(publicId, {
            resource_type: 'video'
        });
        return result;
    } catch (error) {
        console.error('Cloudinary delete error:', error);
        throw error;
    }
};