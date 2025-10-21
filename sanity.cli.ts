// sanity.cli.ts
import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_PROJECT_ID || 'iv7qlw2l',
    dataset: process.env.SANITY_DATASET || 'production',
  },
  // Hostname muss mit Buchstaben beginnen – frei wählbar:
  studioHost: process.env.SANITY_STUDIO_HOST || 'brainbloom',
})
