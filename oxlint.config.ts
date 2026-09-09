import { defineConfig, GLOB_SRC, nextjs, react, tailwindcss } from '@nelsonlaidev/oxlint-config'

export default defineConfig({
  settings: {
    'better-tailwindcss': {
      entryPoint: 'src/styles/globals.css',
    },
  },
  overrides: [
    react(),
    nextjs(),
    tailwindcss(),
    {
      files: [GLOB_SRC],
      rules: {
        'no-await-in-loop': 'off',
      },
    },
  ],
})
