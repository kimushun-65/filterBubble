import { register } from 'module';
import nextPWA from 'next-pwa';
const withPWA = require('next-pwa');


const nextConfig = withPWA({
  dest: 'public',
  register: true,
  skipWaiting: true,
})
export default nextConfig;
