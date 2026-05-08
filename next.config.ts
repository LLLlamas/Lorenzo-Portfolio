import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const basePath = isProd ? '/Lorenzo-Portfolio' : '';

const nextConfig: NextConfig = {
  output: 'export',
  basePath,
  images: { unoptimized: true },
  trailingSlash: true,
  // Expose basePath at runtime so withBasePath() can prepend it to image
  // srcs and other static-asset URLs. (Next.js' built-in basePath handling
  // misses next/image src when images.unoptimized is set.)
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
};

export default nextConfig;
