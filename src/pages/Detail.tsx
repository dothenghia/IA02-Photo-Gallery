import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { getPhotoDetails } from '../services';

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
}

const Detail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [photo, setPhoto] = useState<PhotoDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPhotoDetails = async () => {
      try {
        const data = await getPhotoDetails(id!);
        setPhoto(data);
      } catch (err) {
        setError('Failed to load photo details');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotoDetails();
  }, [id]);

  if (loading) return <div className="text-center mt-8">Loading...</div>;
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>;
  if (!photo) return <div className="text-center mt-8">No photo found</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <Link to="/photos" className="text-blue-500 hover:underline mb-4 inline-block">&larr; Back to Photos</Link>
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <img src={photo.urls.full} alt={photo.alt_description || 'Photo'} className="w-full h-auto" />
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-2">{photo.description || photo.alt_description || 'Untitled'}</h1>
          <p className="text-gray-600 mb-4">By {photo.user.name}</p>
          <p className="text-gray-800">{photo.description || 'No description available.'}</p>
        </div>
      </div>
    </div>
  );
};

export default Detail;