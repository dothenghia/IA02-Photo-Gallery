import React, { useState, useEffect } from 'react';
import { getPhotos } from '../services';

interface Photo {
  id: string;
  urls: {
    small: string;
  };
  user: {
    name: string;
  };
}

const List: React.FC = () => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchPhotos = async () => {
    setLoading(true);
    try {
      const newPhotos = await getPhotos(page);
      setPhotos((prevPhotos) => [...prevPhotos, ...newPhotos]);
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error('Error fetching photos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const handleScroll = () => {
    if (
      window.innerHeight + document.documentElement.scrollTop ===
      document.documentElement.offsetHeight
    ) {
      fetchPhotos();
    }
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-3xl font-bold my-8">Unsplash Photos</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={photo.urls.small}
              alt={`Photo by ${photo.user.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">By {photo.user.name}</p>
            </div>
          </div>
        ))}
      </div>
      {loading && <p className="text-center my-4">Loading...</p>}
    </div>
  );
};

export default List;