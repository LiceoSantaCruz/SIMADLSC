import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: '94ysjp',
  e2e: {
    baseUrl: 'http://localhost:5173', // Ajusta al puerto de tu app
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
  },
})
