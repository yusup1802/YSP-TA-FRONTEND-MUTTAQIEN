import DrawerLayout from "../../components/DrawerLayout";
import TambahAdmin from "./TambahAdmin";
import TambahGuru from "./TambahGuru";
import TambahMurid from "./TambahMurid";
import TambahKelas from "./TambahKelas";

const AdminprofilePage = () => {
  const sidebarItems = [
    { label: "Tambah Admin", value: "TambahAdmin" },
    { label: "Tambah Guru", value: "TambahGuru" },
    { label: "Tambah Murid", value: "TambahMurid" },
    { label: "Tambah Kelas", value: "TambahKelas" },
  ];

  const renderContent = (activeTab) => {
    switch (activeTab) {
      case "TambahAdmin":
        return <TambahAdmin />;
      case "TambahGuru":
        return <TambahGuru />
      case "TambahMurid":
        return <TambahMurid />
      case "TambahKelas":
        return <TambahKelas />

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

export default AdminprofilePage
