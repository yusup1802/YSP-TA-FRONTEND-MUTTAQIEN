// pages/ExamplePage.jsx
import DrawerLayout from "../../components/DrawerLayout";
import MuridProfile from "./MuridProfile";
import RiwayatAbsensiByMurid from "./RiwayatAbsensiByMurid";
import DaftarTugasMurid from "./DaftarTugasMurid";


const ProfileGuruPage = () => {
  const sidebarItems = [
    { label: "Profile Murid", value: "muridProfile" },
    { label: "Riwayat Absensi", value: "riwayatAbsensiMurid" },
    { label: "Daftar Tugas", value: "daftarTugas" },
  ];

  const renderContent = (activeTab) => {
    switch (activeTab) {
      case "muridProfile":
        return <MuridProfile />;
      case "riwayatAbsensiMurid":
        return <RiwayatAbsensiByMurid />;
      case "daftarTugas":
        return <DaftarTugasMurid />;
      default:
        return <div className="p-4">Silakan pilih tab4</div>;
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
