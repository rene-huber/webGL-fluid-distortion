/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
      // Configura el loader para archivos .frag
      config.module.rules.push({
        test: /\.(frag|vert)$/,
        use: 'raw-loader',
      });
  
      return config;
    },
  };
  
  export default nextConfig;
  