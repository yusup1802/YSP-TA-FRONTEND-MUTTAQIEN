# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

```
frontend
├─ .editorconfig
├─ eslint.config.js
├─ index.html
├─ package-lock.json
├─ package.json
├─ public
│  └─ vite.svg
├─ README.md
├─ src
│  ├─ App.css
│  ├─ App.jsx
│  ├─ AppRoutes.jsx
│  ├─ assets
│  │  └─ react.svg
│  ├─ components
│  │  ├─ AbsensiMurid.jsx
│  │  ├─ atoms
│  │  ├─ DrawerLayout.jsx
│  │  ├─ FormAddTugasByGuru.jsx
│  │  ├─ FormEditProfileMurid.jsx
│  │  ├─ KonsepPelajari.jsx
│  │  ├─ molecules
│  │  ├─ organism
│  │  ├─ ori.jsx
│  │  ├─ ProfileMurid.jsx
│  │  ├─ Salinan.jsx
│  │  └─ template
│  ├─ index.css
│  ├─ main.jsx
│  ├─ middleware
│  │  ├─ Backup.jsx
│  │  └─ ProtectedRoute.jsx
│  ├─ pages
│  │  ├─ CoabDrawer2.jsx
│  │  ├─ CobaDrawer.jsx
│  │  ├─ Loginpage.jsx
│  │  ├─ MuridPage.jsx
│  │  ├─ ProfileGuruBackup.jsx
│  │  ├─ ProfileGuruPage.jsx
│  │  └─ TambahTugasPage.jsx
│  ├─ stores
│  │  └─ AuthStore.jsx
│  └─ utils
│     ├─ Api.jsx
│     └─ FetchApiGet.jsx
└─ vite.config.js

```