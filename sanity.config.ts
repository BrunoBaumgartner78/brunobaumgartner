'use client'

import { defineConfig } from 'sanity'
import { deskTool } from 'sanity/desk'
import { visionTool } from '@sanity/vision'
import { schemaTypes } from './schemas'   // liegt neben sanity.config.ts

export default defineConfig({
  name: 'default',
  title: 'Brainbloom Studio',
  projectId: process.env.SANITY_PROJECT_ID || 'iv7qlw2l',
  dataset: process.env.SANITY_DATASET || 'production',
  plugins: [deskTool(), visionTool()],
  schema: { types: schemaTypes },
})
