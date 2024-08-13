/** @type {import('next').NextConfig} */

// 导入 Terser 插件
import TerserPlugin from 'terser-webpack-plugin';
const nextConfig = {
    webpack: (config, { isServer }) => {
        // 添加处理 .mjs 文件的规则
        config.module.rules.push({
            test: /\.mjs$/,
            include: /node_modules/,
            type: 'javascript/auto',
        });

        // 配置 Terser 插件，排除 .mjs 文件
        if (!isServer) {
            config.optimization.minimizer = [
                new TerserPlugin({
                    exclude: /\.mjs$/, // 排除 .mjs 文件
                    terserOptions: {
                        ecma: 2015,
                        module: true,  // 确保它是一个 ES 模块
                    },
                }),
            ];
        }

        return config;
    },
};

export default nextConfig;
