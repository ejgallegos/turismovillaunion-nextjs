import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	experimental: {
		serverActions: {
			// Files are validated against a 10MB limit inside the actions, so the
			// transport limit must leave room for the multipart envelope.
			bodySizeLimit: "20mb",
		},
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: 'lh3.googleusercontent.com',
			},
			{
				protocol: 'https',
				hostname: '*.googleusercontent.com',
			},
		],
	},
};

export default nextConfig;
