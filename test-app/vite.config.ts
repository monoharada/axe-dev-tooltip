import { defineConfig } from "vite";
import {InsertAxeScript} from "vite-plugin-axe";




export default defineConfig({
  plugins: [InsertAxeScript('ja')],
});
