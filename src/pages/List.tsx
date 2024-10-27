import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getPhotos } from '../services';
import { Link } from 'react-router-dom';

// Just get necessary fields from the API response
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
  const [hasMore, setHasMore] = useState(true);
  const initialFetchDone = useRef(false);

  // Fetch photos from the API
  const fetchPhotos = useCallback(async () => {
    if (!hasMore || loading) return; // Avoid multiple requests

    setLoading(true);
    try {
      const newPhotos = await getPhotos(page);
      if (newPhotos.length === 0) {
        setHasMore(false);
      } else {
        setPhotos(prevPhotos => [...prevPhotos, ...newPhotos]);
        setPage(prevPage => prevPage + 1);
      }
    }
    catch (error) {
      console.error('Error fetching photos:', error);
    }
    finally {
      setLoading(false);
    }
  }, [page, hasMore, loading]);

  // Initial fetch
  useEffect(() => {
    if (!initialFetchDone.current) {
      fetchPhotos();
      initialFetchDone.current = true;
    }
  }, [fetchPhotos]);

  // Infinite scroll
  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop >=
      document.documentElement.offsetHeight - 100 &&
      photos.length > 0 &&
      !loading &&
      hasMore
    ) {
      fetchPhotos();
    }
  }, [fetchPhotos, photos.length, loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  return (
    <div className="flex-1 container mx-auto px-5 pb-10">
      <h1 className="text-3xl font-bold my-8">Unsplash Photo Gallery</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <Link to={`/photos/${photo.id}`} key={photo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={photo.urls.small}
              alt={`Photo by ${photo.user.name}`}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <p className="text-sm text-gray-600">By {photo.user.name}</p>
            </div>
          </Link>
        ))}
      </div>

      {loading && <div className="loader mx-auto my-6"></div>}
      {!hasMore && <p className="text-center my-6">No more photos to load</p>}
    </div>
  );
};

export default List;
