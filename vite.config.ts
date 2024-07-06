import { defineConfig } from "vite";
import { InsertScriptPlugin } from "./plugins/InsertScriptPlugin";




export default defineConfig({
  plugins: [InsertScriptPlugin('ja')],
});
