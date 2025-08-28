import { FormProvider, useForm } from 'react-hook-form'
import { MuridData, WaliMuridFields } from './FormEditProfileMurid';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import Api from '../../utils/Api';
import { useEffect } from 'react';

const MuridProfile = () => {
  const { isPending, error, data: muridData } = useQuery({
    queryKey: ['muridProfile'],
    queryFn: async () => {
      const response = await Api.get(`/murid/profile`);
      console.log(response.data);
      return response.data.payload;
    }
  })

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      <ToastContainer />
      <div className="flex flex-col w-[90%] max-w-screen-lg">
        <div className="flex gap-4">
          <div className="card bg-base-300 rounded-box p-5 w-full">
            <p><strong>ID:</strong> {muridData?.user?.muridProfile?.muridProfileId ?? 'muridId tidak tersedia'}</p>
            <p><strong>Email:</strong> {muridData?.user?.email ?? 'Email tidak tersedia'}</p>
            <p><strong>Role:</strong> {muridData?.user?.role ?? 'Role tidak diketahui'}</p>
            <p><strong>Nama:</strong> {muridData?.user?.muridProfile?.name ?? 'Nama belum diisi'}</p>
            <p><strong>Nomor:</strong> {muridData?.user?.muridProfile?.noMurid ?? 'Nomor belum diisi'}</p>
            <p><strong>NIS:</strong> {muridData?.user?.muridProfile?.nis ?? 'NIS belum tersedia'}</p>
            <p><strong>Kelas:</strong> {muridData?.user?.muridProfile?.kelas ?? 'Kelas belum didaftarkan'}</p>
          </div>
          <div className="divider divider-horizontal" />
          <div className="card bg-base-300 rounded-box p-5 w-full">
            <div>
              <h2 className="font-bold">Nama Wali Kelas : {muridData?.user?.muridProfile?.waliKelas?.name}</h2>
              <h2 className="font-bold">Nomor Wali Kelas : {muridData?.user?.muridProfile?.waliKelas?.noGuru}</h2>
            </div>
            <hr className='m-5' />
            <div>
              <h2 className="font-bold">Daftar Wali Murid:</h2>
              {muridData?.user?.muridProfile?.waliMurids?.length > 0 ? (
                muridData.user.muridProfile.waliMurids.map((wali) => (
                  <div key={wali.id}>{wali.nameWaliMurid} - {wali.noWaliMurid}</div>
                ))
              ) : (
                <p>Tidak ada wali murid</p>
              )}
            </div>
          </div>
        </div>

        <button
          className="btn btn-soft btn-accent mt-5 w-full"
          onClick={() => document.getElementById('my_modal_4').showModal()}
        >
          open modal
        </button>
      </div>
      <Modal muridData={muridData} />
    </div>
  )
}

const Modal = ({ muridData }) => {
  const methods = useForm({
    defaultValues: {
      muridProfile: {
        name: "",
        noMurid: "",
        waliMurids: [],
      },
    },
  });
  const queryClient = useQueryClient();
  const { handleSubmit, reset } = methods;
  useEffect(() => {
    if (muridData) {
      reset({
        muridProfile: {
          name: muridData.user.muridProfile.name || "",
          noMurid: muridData.user.muridProfile.noMurid || "",
          waliMurids: muridData.user.muridProfile.waliMurids || [],
        },
      });
    }
  }, [muridData, reset]);

  const mutation = useMutation({
    mutationFn: (data) => Api.put(`/murid/profile`, data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      document.getElementById('my_modal_4').close();
      queryClient.invalidateQueries({ queryKey: ['muridProfile'] });
      reset();
    },
    onError: (err) => {
      console.log("Axios error full object:", err);
      console.log("Server response:", err?.response?.data);
      toast.error(err.response?.data?.message || "Terjadi kesalahan.");
      toast.error(err.response?.data?.Message);
      toast.error(err.response?.data?.error);
      if (err.response?.data?.details) {
        err.response.data.details.forEach((detailMsg) => {
          toast.error(detailMsg);
        });
      }
    },
  });
  const onSubmit = (data) => {
    console.log("data yang dikirim edit profile : ", data);

    mutation.mutate(data);
  };
  return (
    <dialog id="my_modal_4" className="modal">
      <div className="modal-box  w-1/2 max-w-none pb-5">
        <FormProvider {...methods}>
          <form id="myForm" onSubmit={handleSubmit(onSubmit)}>
            <MuridData />
            <WaliMuridFields />
          </form>
        </FormProvider>

        <div className="modal-action">
          <form method="dialog" className='flex gap-x-3 -mt-2'>
            {/* if there is a button, it will close the modal */}
            <button type="submit" className="btn btn-primary" form="myForm">Simpan</button>
            <button className="btn btn-secondary">Close</button>
          </form>
        </div>
      </div>
    </dialog>
  )
}

export default MuridProfile

