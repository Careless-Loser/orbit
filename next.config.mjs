/** @type {import('next').NextConfig} */
const nextConfig = {
  reactCompiler: true,
  // This fix is required for Next.js 16 + Prisma on Vercel
  outputFileTracingIncludes: {
    '/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;