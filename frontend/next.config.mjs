/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: true,
    },
    experimental: {
        missingSuspenseWithCSRBailout: false,
    },
    output: 'standalone',
};

export default nextConfig;
