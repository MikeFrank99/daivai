// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  // Aggiornato con il tuo nuovo dominio personalizzato
  site: 'https://dai-vai.com',
  
  // Rimosso '/daivai' perché Cloudflare serve il sito dalla root del dominio
  base: '/', 
  
  integrations: [react()],
  output: 'static',
  build: {
    format: 'directory'
  }
});
