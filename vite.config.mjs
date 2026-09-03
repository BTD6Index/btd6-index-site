import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import {yamlPlugin} from "vite-yaml-plugin";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), yamlPlugin()],
});