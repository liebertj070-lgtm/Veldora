import React, { useState } from 'react';

interface SafeImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  fallbackTitle?: string;
  priority?: boolean;
}

export const SafeImage = React.forwardRef<HTMLImageElement, SafeImageProps>(
  (
    {
      src,
      alt,
      className = '',
      fallbackTitle,
      priority = false,
      loading,
      decoding,
      ...rest
    },
    ref
  ) => {
    const [hasError, setHasError] = useState(false);

    if (hasError || !src) {
      return (
        <div
          className={`flex flex-col items-center justify-center bg-[#D9D5CC] text-[#171717]/60 p-6 text-center select-none ${className}`}
          role="img"
          aria-label={alt || fallbackTitle || 'VELORA Editorial Image'}
        >
          <span className="font-mono text-[10px] tracking-[0.2em] uppercase text-[#171717]/50">
            VELORA ARCHIVE
          </span>
          {(fallbackTitle || alt) && (
            <span className="font-display text-lg italic mt-1 text-[#171717]/75">
              {fallbackTitle || alt}
            </span>
          )}
        </div>
      );
    }

    return (
      <img
        ref={ref}
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={loading ?? (priority ? 'eager' : 'lazy')}
        decoding={decoding ?? 'async'}
        fetchPriority={priority ? 'high' : undefined}
        onError={() => setHasError(true)}
        className={className}
        {...rest}
      />
    );
  }
);

SafeImage.displayName = 'SafeImage';
