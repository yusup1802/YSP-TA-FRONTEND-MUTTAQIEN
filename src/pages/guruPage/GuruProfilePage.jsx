// pages/ExamplePage.jsx
import DrawerLayout from "../../components/DrawerLayout";
import ListAbsensiMurid from "../../components/ListAbsensiMurid";
import FormAddTugasByGuru from './FormAddTugasByGuru';
import DaftarTugas from "./DaftarTugas";

const ProfileGuruPage = () => {
  const sidebarItems = [
    { label: "Tambah Tugas", value: "tambahTugas" },
    { label: "Riwayat Absensi Murid", value: "riwayatAbsensiMurid" },
    { label: "Daftar Tugas", value: "daftarTugas" },
  ];

  const renderContent = (activeTab) => {
    switch (activeTab) {
      case "tambahTugas":
        return <FormAddTugasByGuru />;
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
