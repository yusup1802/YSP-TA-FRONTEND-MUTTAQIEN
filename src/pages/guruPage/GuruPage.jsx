// pages/ExamplePage.jsx
import DrawerLayout from "../../components/DrawerLayout";
import ListAbsensiMurid from "../../components/ListAbsensiMurid";
import FormAddTugasByGuru from './FormAddTugasByGuru';
import DaftarTugas from "./DaftarTugas";
import GuruProfilePage from './GuruProfilePage'
import GuruKehadiranHariIni from './GuruKehadiranHariIni'
const ProfileGuruPage = () => {
  const sidebarItems = [
    { label: "Guru Profile", value: "GuruProfile" },
    { label: "Tambah Tugas", value: "tambahTugas" },
    { label: "Kehadiran Hari Ini", value: "GuruKehadiranHariIni" },
    { label: "Riwayat Absensi Murid", value: "riwayatAbsensiMurid" },
    { label: "Daftar Tugas", value: "daftarTugas" },
  ];

  const renderContent = (activeTab) => {
    switch (activeTab) {
      case "GuruProfile":
        return <GuruProfilePage />;
      case "tambahTugas":
        return <FormAddTugasByGuru />;
      case "GuruKehadiranHariIni":
        return <GuruKehadiranHariIni />;
      case "riwayatAbsensiMurid":
        return <ListAbsensiMurid />;
      case "daftarTugas":
        return <DaftarTugas />;
      default:
        return <div className="p-4">Silakan pilih tab</div>;
    }
  };

  return (
    <DrawerLayout
      sidebarItems={sidebarItems}
      renderContent={renderContent}
    />
  );
}

export default ProfileGuruPage
