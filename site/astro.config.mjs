import {defineConfig} from 'astro/config'

// Static output, deployed to Netlify. No server runtime, no adapter needed.
export default defineConfig({
  output: 'static',
  site: 'https://example.com',
})
