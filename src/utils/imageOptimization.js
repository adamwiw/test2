// Image optimization utilities for responsive images and lazy loading

// Generate responsive image srcset
export const generateSrcSet = (baseUrl, widths = [320, 640, 768, 1024, 1280, 1536]) => {
  return widths.map(width => `${baseUrl}?w=${width} ${width}w`).join(', ');
};

// Generate picture element sources for WebP/AVIF fallback
export const generatePictureSources = (baseUrl, widths = [320, 640, 768, 1024, 1280]) => {
  const formats = [
    { type: 'image/avif', quality: 80 },
    { type: 'image/webp', quality: 85 }
  ];

  return formats.map(format => (
    <source
      key={format.type}
      type={format.type}
      srcSet={widths.map(width => `${baseUrl}?w=${width}&format=${format.type.split('/')[1]}&q=${format.quality} ${width}w`).join(', ')}
      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
    />
  ));
};

// Optimized image component with blur placeholder
export const OptimizedImage = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  quality = 85,
  ...props
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(false);

  // Generate low-quality placeholder (LQIP) - 20px wide blur
  const lqipUrl = src.includes('?') 
    ? `${src}&q=10&blur=10` 
    : `${src}?q=10&blur=10`;

  // Optimized URL with parameters
  const optimizedUrl = src.includes('unsplash.com')
    ? `${src}&q=${quality}&auto=format&fit=crop`
    : src;

  return (
    <div 
      className={`relative overflow-hidden ${className}`}
      style={{ 
        aspectRatio: width && height ? `${width}/${height}` : 'auto',
        backgroundColor: '#1a1a1a'
      }}
    >
      {/* LQIP placeholder */}
      {isLoading && (
        <img
          src={lqipUrl}
          alt=""
          className="absolute inset-0 w-full h-full object-cover filter blur-lg scale-110 transition-opacity duration-300"
          aria-hidden="true"
        />
      )}
      
      {/* Main image */}
      {!error && (
        <img
          src={optimizedUrl}
          alt={alt}
          width={width}
          height={height}
          className={`w-full h-full object-cover transition-opacity duration-500 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoading(false)}
          onError={() => setError(true)}
          {...props}
        />
      )}
      
      {/* Error fallback */}
      {error && (
        <div className="flex items-center justify-center w-full h-full bg-gray-800 text-gray-400">
          <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </div>
      )}
    </div>
  );
};

// Preload critical images
export const preloadImage = (src) => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = resolve;
    img.onerror = reject;
    img.src = src;
  });
};

// Preload multiple images
export const preloadImages = (sources) => {
  return Promise.all(
    sources.map(src => preloadImage(src).catch(() => {}))
  );
};

// Detect if WebP is supported
export const checkWebPSupport = async () => {
  if (!window.createImageBitmap) return false;
  
  const webpData = 'data:image/webp;base64,UklGRiIAAABXRUJQVlA4TAYAAAAvAAAAAAfQ//73v/+BiOh/AAA=';
  const blob = await fetch(webpData).then(r => r.blob());
  
  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
};

// Detect if AVIF is supported
export const checkAVIFSupport = async () => {
  if (!window.createImageBitmap) return false;
  
  const avifData = 'data:image/avif;base64,AAAAIGZ0eXBhdmlmAAAAAGF2aWZtaWYxbW47j8g7PwAAAPVJREFUeJ7N0DEBAAAAwqD1T20JT6AAAH4AAAAAAABJcHcQAAAAAElFTkSuQmCC';
  const blob = await fetch(avifData).then(r => r.blob());
  
  return createImageBitmap(blob).then(
    () => true,
    () => false
  );
};

// Get optimal image format based on browser support
export const getOptimalFormat = async () => {
  const [webp, avif] = await Promise.all([
    checkWebPSupport(),
    checkAVIFSupport()
  ]);
  
  if (avif) return 'avif';
  if (webp) return 'webp';
  return 'jpeg';
};

// Calculate responsive sizes
export const calculateSizes = (containerWidth, columns = 1) => {
  const sizes = [];
  
  if (containerWidth >= 1536) {
    sizes.push(`(max-width: 1536px) ${Math.floor(containerWidth / columns)}px`);
  }
  if (containerWidth >= 1024) {
    sizes.push(`(max-width: 1024px) ${Math.floor(containerWidth / (columns * 0.66))}px`);
  }
  if (containerWidth >= 640) {
    sizes.push(`(max-width: 640px) ${Math.floor(containerWidth / (columns * 0.5))}px`);
  }
  sizes.push('100vw');
  
  return sizes.join(', ');
};

export default OptimizedImage;
