/** @type {import('next').NextConfig} */
const nextConfig = {
    webpack: (config, { isServer }) => {
        // 添加对 .mjs 文件的处理
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });

        // 如果你使用了 PDF.js，可能还需要添加以下配置
        config.resolve.alias['pdfjs-dist'] = 'pdfjs-dist/legacy/build/pdf';

        return config;
    },
    // 如果你的项目中使用了实验性功能，可以在这里启用它们
    // 例如：
    // experimental: {
    //   esmExternals: true,
    // },
};

export default nextConfig;