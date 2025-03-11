import { defineConfig, mergeConfig } from 'vitest/config'
import viteConfig from './vite.config.js';

export default mergeConfig(viteConfig, defineConfig({
    server: {
        port: 4200,
        host: 'localhost',
    },
    plugins: [
        {
            name: 'virtual-modules',
            resolveId(id) {
                if (id === '$app/forms') {
                    return 'virtual:$app/forms'
                }
            }

        }
    ],
    test: {
        environment: 'happy-dom'
    }
}))