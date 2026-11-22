import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const carpetaPublica = fileURLToPath(new URL("./public", import.meta.url));

// Google Drive crea archivos desktop.ini dentro de public/. Vite intenta
// copiarlos al build, pero Google Drive los bloquea y la compilación falla.
// Este complemento los retira justo antes de copiar la carpeta pública.
function quitarDesktopIni() {
  function limpiar(directorio) {
    let entradas;

    try {
      entradas = fs.readdirSync(directorio, { withFileTypes: true });
    } catch {
      return;
    }

    for (const entrada of entradas) {
      const ruta = path.join(directorio, entrada.name);

      if (entrada.isDirectory()) {
        limpiar(ruta);
      } else if (entrada.name.toLowerCase() === "desktop.ini") {
        try {
          fs.rmSync(ruta, { force: true });
        } catch {
          // Si Google Drive lo tiene bloqueado, se ignora: el archivo no
          // forma parte del entregable.
        }
      }
    }
  }

  return {
    name: "gastrolocal-quitar-desktop-ini",
    apply: "build",
    buildStart() {
      limpiar(carpetaPublica);
    },
  };
}

// El proyecto vive en una unidad de Google Drive. Ese sistema de archivos
// falla al crear la caché de dependencias dentro del proyecto y no entrega
// eventos de cambio confiables, así que la caché se escribe en la carpeta
// temporal del sistema y el watcher usa sondeo.
export default defineConfig({
  plugins: [react(), quitarDesktopIni()],
  cacheDir: path.join(os.tmpdir(), "gastrolocal-vite-cache"),
  server: {
    watch: {
      usePolling: true,
      interval: 300,
    },
  },
});
