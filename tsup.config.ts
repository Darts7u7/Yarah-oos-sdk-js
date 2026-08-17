import { defineConfig } from 'tsup';

export default defineConfig({
  entry: {
    index: 'src/index.ts',
    ssr: 'src/ssr.ts',
    'ssr/middleware': 'src/ssr/middleware.ts',
  },
  format: ['cjs', 'esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  minify: false,
  external: ['@yarahdev/shared-schemas', 'socket.io-client'],
});
