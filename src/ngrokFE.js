import fs from 'fs/promises';
import axios from 'axios';
import path from 'path';
import { log } from 'console';

async function updateEnv() {
  try {
    // Dapatkan JSON dari ngrok
    const response = await axios.get('http://localhost:4040/api/tunnels');

    // Periksa apakah status kode HTTP adalah 200
    if (response.status === 200) {
      const tunnels = response.data.tunnels;

      // Periksa apakah tunnels berisi URL untuk backend dan frontend
      const backendTunnel = tunnels.find(tunnel => tunnel.name === 'backend');
      const frontendTunnel = tunnels.find(tunnel => tunnel.name === 'frontend');

      // Jika tunnel ditemukan, gunakan URL publik, jika tidak, fallback ke localhost
      const backendUrl = backendTunnel ? backendTunnel.public_url : 'http://localhost:3000';
      const frontendUrl = frontendTunnel ? frontendTunnel.public_url : 'http://localhost:5173';
      log(`Frontend: ${frontendUrl}\nBackend: ${backendUrl}\n\n`);
      // Proses untuk file .env FE
      const envPath = path.join(process.cwd(), ".env");
      let data = await fs.readFile(envPath, "utf8");

      // Ubah nilai untuk frontend dan backend
      const updatedData = data
        .replace(/VITE_FRONTEND=.*/, `VITE_FRONTEND=${frontendUrl}`)
        .replace(/VITE_BACKEND=.*/, `VITE_BACKEND=${backendUrl}`);

      await fs.writeFile(envPath, updatedData, "utf8");
      console.log(`File .env berhasil diubah menjadi:\n\nFrontend: ${frontendUrl}\nBackend: ${backendUrl}\n\n`);

    } else {
      // Jika status bukan 200, log error dan throw
      // console.error(`Error: Status code ${response.status}`);
      throw new Error('Failed to fetch ngrok tunnels');
    }
  } catch (error) {
    // console.error('Error fetching ngrok tunnels:', error);
    // Jika ada kesalahan, set URL ke localhost sebagai fallback
    const envPath = path.join(process.cwd(), ".env");
    try {
      let data = await fs.readFile(envPath, "utf8");
      const updatedData = data
        .replace(/VITE_FRONTEND=.*/, 'VITE_FRONTEND_NGROK=http://localhost:5173')
        .replace(/VITE_BACKEND=.*/, 'VITE_BACKEND_NGROK=http://localhost:3000');
      await fs.writeFile(envPath, updatedData, "utf8");
      console.log(`Ngrok gagal, file .env diubah menjadi:\n\nFrontend: http://localhost:5173\nBackend: http://localhost:3000\n\n`);
    } catch (fileError) {
      console.error('Error updating .env file:', fileError);
    }
  }
}

updateEnv();
