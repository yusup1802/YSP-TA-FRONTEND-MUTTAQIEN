import Api from "../utils/Api";
import { NavLink } from "react-router";
import { useMutation, useQuery } from "@tanstack/react-query";

const MuridByWaliKelas = () => {
  const { isPending, error, data: kelasData } = useQuery({
    queryKey: ['ListMuridByWaliKelas'],
    queryFn: async () => {
      const response = await Api.get('/kelas/murid');
      console.log('form react query :', response.data);
      return response.data
    }
  })

  const {
    name: namaKelas = '',
    waliKelas = {},
    muridProfile = [],
  } = kelasData ?? {};

  const downloadAbsensi = useMutation({
    mutationFn: async () => {
      const response = await Api.get("/absensi/download", {
        responseType: "blob",
      });

      return {
        blob: new Blob([response.data], {
          type: response.headers["content-type"],
        }),
        filename: response.headers["content-disposition"]
          ?.split("filename=")[1]
          ?.replace(/"/g, "") || "laporan_absensi.xlsx",
      };
    },
    onSuccess: ({ blob, filename }) => {
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    },
    onError: (error) => {
      console.error("Error download:", error.message);
    },
  });

  return (
    <>
      {isPending ? (
        <div className="w-full flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-xl" />
        </div>
      ) : error ? (
        error?.response?.status === 400 ? (
          <div className="w-full flex items-center justify-center min-h-screen">
            <p className="text-center font-medium">
              {error?.response?.data?.message}
            </p>
          </div>
        ) : (
          <div className="w-full flex items-center justify-center min-h-screen">
            <p className="text-center font-medium text-red-500">
              Terjadi kesalahan: {error?.response?.statusText || error.message || "Tidak diketahui"}
            </p>
          </div>
        )
      ) :
        (
          <div className="min-h-screen flex flex-col container mx-auto" >
            <div className="p-4">
              <h2 className="text-2xl text-center">Daftar Murid Kelas - {namaKelas}</h2>
              <div className="flex justify-around w-full">
                <p className="text-xl text-center">Wali Kelas: {waliKelas.name || "Tidak diketahui"}</p>
                <button className="btn btn-primary" onClick={() => downloadAbsensi.mutate()} disabled={downloadAbsensi.isPending}>
                  {downloadAbsensi.isPending ? "Downloading..." : "Download Absensi"}
                </button>
              </div>

            </div>

            {!muridProfile ? (
              <div className="w-full grow items-center flex justify-center textarea-info">
                <p>Kelas tidak ditemukan atau data murid kosong.</p>
              </div>
            ) : muridProfile.length === 0 ? (
              <div className="w-full grow items-center flex justify-center textarea-info">
                <p>Tidak ada murid di kelas ini.</p>
              </div>
            ) : (
              <ul className="flex flex-wrap grow items-start justify-center ">
                {muridProfile.map((m) => (
                  <li key={m.id} className="w-1/3 p-4 ">
                    <div className="bg-primary text-primary-content shadow-sm rounded-md">
                      <div className="card-body">
                        <h2 className="card-title">{m.name}</h2>
                        <p>ID Murid: {m.id}</p>
                        <p>Nomor Murid: {m.noMurid}</p>
                        <p>RFID: {m.rfid?.rfidNumb || 'Belum terdaftar'}</p>

                        <div className="justify-end card-actions w-full flex mx-auto">
                          {/* Open the modal using document.getElementById('ID').showModal() method */}
                          <NavLink
                            to={`/murid/${m.id}/absensi`}
                            className="btn w-full text-center"
                          >
                            Lihat Absensi
                          </NavLink>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>)}
    </>
  );
};

export default MuridByWaliKelas;
