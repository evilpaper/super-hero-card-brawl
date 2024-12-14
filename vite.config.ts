import { defineConfig } from "vite";

export default defineConfig({
  /**
   * Vite by default assumes that our project will be served from the root (/) of the server.
   * Since we serve it from a subdirectory (e.g., ourdomain.com/superherocardbrawl),
   * the paths to assets like images, CSS, and JavaScript files may break if we don't specify the exact base.
   * */
  base: "/superherocardbrawl/", // Replace with subdirectory if any
});
