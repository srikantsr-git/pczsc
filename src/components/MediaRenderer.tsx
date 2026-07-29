import React, { useState, useEffect } from 'react';
import { isVideoUrl } from '../utils/fileUpload';
import { getMediaFromIDB } from '../utils/mediaDB';

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
  const [resolvedSrc, setResolvedSrc] = useState<string>(src || '');

  useEffect(() => {
    let isMounted = true;
    async function resolveMedia() {
      if (!src) {
        setResolvedSrc('');
        return;
      }
      if (src.startsWith('idb:')) {
        const mediaKey = src.replace('idb:', '');
        const dataUrl = await getMediaFromIDB(mediaKey);
        if (isMounted) {
          setResolvedSrc(dataUrl || 'https://images.unsplash.com/photo-1517649763962-0c623266010b?auto=format&fit=crop&w=2000&q=80');
        }
      } else {
        if (isMounted) {
          setResolvedSrc(src);
        }
      }
    }
    resolveMedia();
    return () => {
      isMounted = false;
    };
  }, [src]);

  if (!resolvedSrc) return null;

  const isVideo = isVideoUrl(resolvedSrc);

  if (isVideo) {
    return (
      <video
        src={resolvedSrc}
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
      src={resolvedSrc}
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
