
Ular Tangga - Electron + React (Vite)

Catatan penting:
- Saya tidak bisa membangun file .exe di lingkungan ini.
- Tetapi di bawah ini ada langkah lengkap untuk membangun .exe di Windows 10/11.

Langkah singkat untuk membuat .exe (Windows):
1. Pastikan di komputer Windows terpasang Node.js (v16+), npm, dan Git.
2. Ekstrak folder proyek.
3. Buka terminal di folder proyek.
4. Jalankan:
   npm install
   npm run build
   (perintah 'build' akan menjalankan vite build dan kemudian electron-builder untuk membuat installer Windows)
5. Setelah selesai, file .exe atau installer NSIS akan berada di folder 'dist_electron' sesuai konfigurasi package.json.

Jika mengalami error di electron-builder, pastikan:
- Anda menjalankan di Windows untuk membuat installer Windows.
- Jika ingin membuat di Linux/Mac, gunakan cross-compilation atau gunakan GitHub Actions/CI.

Saya juga dapat bantu membuatkan GitHub Actions workflow untuk otomatis build jika kamu mau.
