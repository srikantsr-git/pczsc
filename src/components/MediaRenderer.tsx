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
        // Fallback for broken image links
        (e.target as HTMLElement).style.display = 'none';
      }}
    />
  );
};
