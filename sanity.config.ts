import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schema } from './src/app/sanity/schema' // ← Pfad prüfen

export default defineConfig({
  name: 'default',
  title: 'BrunoBaumgartner',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  basePath: '/studio',
  plugins: [deskTool(), visionTool()],
  schema,
})
