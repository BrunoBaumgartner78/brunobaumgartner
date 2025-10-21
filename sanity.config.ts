// sanity.config.ts (Repo-Root)
import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'

// NEUER Pfad zu deinem Schema-Index
import { schema } from './src/app/sanity/lib/schema'

export default defineConfig({
  name: 'default',
  title: 'brainbloom',
  projectId: process.env.SANITY_PROJECT_ID!,
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema,
})
