import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotoDetails } from '../services';

// Just get necessary fields from the API response
interface PhotoDetails {
  id: string;
  urls: {
    full: string;
  };
  user: {
    name: string;
  };
  description: string;
  alt_description: string;
  width: number;
  height: number;
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // Fetch photo details from the API
  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const data = await getPhotoDetails(id!);
        setPhoto(data);
      }
      catch (err) {
        setError('Failed to load photo details');
      }
      finally {
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id]);

  // Resize the image to fit the screen
  useEffect(() => {
    const handleResize = () => {
      if (imgRef.current && photo) {
        const maxWidth = Math.min(window.innerWidth * 0.9, 1200); // 90% of window width, max 1200px
        const maxHeight = window.innerHeight * 0.7; // 70% of window height

        const aspectRatio = photo.width / photo.height;
        let width = maxWidth;
        let height = width / aspectRatio;

        if (height > maxHeight) {
          height = maxHeight;
          width = height * aspectRatio;
        }

        imgRef.current.style.width = `${width}px`;
        imgRef.current.style.height = `${height}px`;
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, [photo]);

  if (loading) return <div className="loader mx-auto my-6"></div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!photo) return <div className="text-center mt-8">No photo found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/photos" className="text-blue-500 hover:underline mb-4 inline-block">Back to Photos</Link>

      <img
        ref={imgRef}
        src={photo.urls.full}
        alt={photo.alt_description || 'Photo'}
        className="mx-auto object-contain"
      />

      <div className="w-full bg-white rounded-lg shadow-lg overflow-hidden p-6 mt-6">
        <h1 className="text-2xl font-bold mb-2">{photo.description || photo.alt_description || 'Untitled'}</h1>
        <p className="text-gray-600 mb-4">By {photo.user.name}</p>
        <p className="text-gray-800">{photo.description || 'No description available.'}</p>
      </div>
    </div>
  );
};

export default Detail;
