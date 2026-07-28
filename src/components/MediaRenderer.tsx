import React from 'react';
import { isVideoUrl } from '../utils/fileUpload';

interface MediaRendererProps {
  src?: string;
  alt?: string;
  className?: string;
  controls?: boolean;
  autoPlay?: boolean;
  loop?: boolean;
  muted?: boolean;
  onClick?: () => void;
}

export const MediaRenderer: React.FC<MediaRendererProps> = ({
  src,
  alt = 'Media content',
  className = '',
  controls = false,
  autoPlay = true,
  loop = true,
  muted = true,
  onClick
}) => {
  if (!src) return null;

  const isVideo = isVideoUrl(src);

  if (isVideo) {
    return (
      <video
        src={src}
        className={className}
        controls={controls}
        autoPlay={autoPlay}
        loop={loop}
        muted={muted}
        playsInline
        onClick={onClick}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onClick={onClick}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80';
      }}
    />
  );
};
