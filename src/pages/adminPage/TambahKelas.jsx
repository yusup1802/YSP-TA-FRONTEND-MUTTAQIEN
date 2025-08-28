import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form"
import { Bounce, ToastContainer, toast } from 'react-toastify';
import Api from '../../utils/Api';

const TambahMurid = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/admin/kelas`, data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      console.log("Response :", response);

      queryClient.invalidateQueries({ queryKey: ['tambahKelas'] });
      reset();
    }, onError: (err) => {

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
    const newData = {
      ...data,
      waliKelasId: parseInt(data.waliKelasId, 10),
    };
    console.log(newData);
    mutation.mutate(newData);
  };
  return (
    <div className='min-h-screen items-center justify-center flex'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register Kelas</legend>
          <label className="label">Nama Kelas</label>
          <input {...register("name")} type="text" className="input" placeholder="Input nama kelas baru" />

          <label className="label">Wali Kelas ID</label>
          <input {...register("waliKelasId")} type="text" className="input" placeholder="Input ID wali kelas" />
          <input className='btn btn-soft btn-primary w-full mt-3.5' type="submit" />
        </fieldset>
      </form>
      <ToastContainer />
    </div>
  )
}

export default TambahMurid
