import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getPhotos } from '../services';
import Masonry from "react-responsive-masonry";
import PhotoItem from '../components/PhotoItem';

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
  const [gridMode, setGridMode] = useState<'normal' | 'masonry'>('normal');
  const [masonryColumnsCount, setMasonryColumnsCount] = useState(4);

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
      document.documentElement.offsetHeight - (gridMode === 'normal' ? 100 : 500) &&
      photos.length > 0 &&
      !loading &&
      hasMore
    ) {
      fetchPhotos();
    }
  }, [fetchPhotos, photos.length, loading, hasMore, gridMode]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  // Update masonry columns count based on the window width
  const updateMasonryColumnsCount = useCallback(() => {
    const width = window.innerWidth;
    if (width < 640) {
      setMasonryColumnsCount(1);
    } else if (width < 768) {
      setMasonryColumnsCount(2);
    } else if (width < 1024) {
      setMasonryColumnsCount(3);
    } else {
      setMasonryColumnsCount(4);
    }
  }, []);

  useEffect(() => {
    updateMasonryColumnsCount();
    window.addEventListener('resize', updateMasonryColumnsCount);
    return () => window.removeEventListener('resize', updateMasonryColumnsCount);
  }, [updateMasonryColumnsCount]);

  return (
    <div className="container mx-auto px-5 pb-10">
      <div className='flex justify-between items-baseline'>
        <h1 className="text-3xl font-bold my-8">Unsplash Photo Gallery</h1>

        <div className='flex'>
          <button
            className={`w-28 px-4 py-2 border-2 border-blue-500 rounded-l-full border-r-0 ${gridMode === 'normal' ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setGridMode('normal')}
          >
            Normal
          </button>
          <button
            className={`w-28 px-4 py-2 border-2 border-blue-500 rounded-r-full ${gridMode === 'masonry' ? 'bg-blue-500 text-white' : ''}`}
            onClick={() => setGridMode('masonry')}
          >
            Masonry
          </button>
        </div>
      </div>

      {gridMode === 'normal' ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {photos.map(photo => (
            <PhotoItem
              key={photo.id}
              id={photo.id}
              url={photo.urls.small}
              userName={photo.user.name}
              mode={gridMode}
            />
          ))}
        </div>
      ) : (
        <Masonry gutter="1rem" columnsCount={masonryColumnsCount}>
          {photos.map(photo => (
            <PhotoItem
              key={photo.id}
              id={photo.id}
              url={photo.urls.small}
              userName={photo.user.name}
              mode={gridMode}
            />
          ))}
        </Masonry>
      )}

      {loading && <div className="loader mx-auto my-6"></div>}
      {!hasMore && <p className="text-center my-6">No more photos to load</p>}
    </div>
  );
};

export default List;
