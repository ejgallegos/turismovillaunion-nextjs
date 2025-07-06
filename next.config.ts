import type {NextConfig} from 'next';

const nextConfig: NextConfig = {
	serverActions: {
		bodySizeLimit: "10mb",
	},
	typescript: {
		// !! WARN !!
		// Dangerously allow production builds to successfully complete even if
		// your project has type errors.
		// !! WARN !!
		ignoreBuildErrors: true,
	},
	output: "standalone",
};

export default nextConfig;
