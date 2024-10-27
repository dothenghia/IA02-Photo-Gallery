import React from 'react';
import { Link } from 'react-router-dom';

interface PhotoItemProps {
  id: string;
  url: string;
  userName: string;
  mode: 'normal' | 'masonry';
}

const PhotoItem: React.FC<PhotoItemProps> = ({ id, url, userName, mode }) => (
  <Link to={`/photos/${id}`} className="block w-full bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={url}
      alt={`Photo by ${userName}`}
      className={`w-full object-cover ${mode === 'normal' ? 'aspect-[8/5]' : 'h-auto'}`}
    />
    <div className="p-4">
      <p className="text-sm text-gray-600">By {userName}</p>
    </div>
  </Link>
);

export default PhotoItem;