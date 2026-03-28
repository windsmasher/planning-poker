import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

/**
 * GitHub Pages project site URL: https://<user>.github.io/<repo>/
 * Set VITE_REPO_NAME in GitHub Actions or .env.production if the repo name differs.
 */
const repoName = process.env.VITE_REPO_NAME ?? 'planning-poker'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  base: mode === 'production' ? `/${repoName}/` : '/',
}))
