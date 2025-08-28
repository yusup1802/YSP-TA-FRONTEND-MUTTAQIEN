import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form"
import Api from '../../utils/Api';
import { ToastContainer, toast } from 'react-toastify';

const TambahAdmin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/admin`, data),
    onSuccess: (response) => {
      toast.success(response.data.message);

      queryClient.invalidateQueries({ queryKey: ['tambahAdmin'] });
      reset();
    }, onError: (err) => {
      console.log("Axios error full object:", err);
      console.log("🔴 Axios error full object:", err); // Bukan string
      console.log("📦 Server response:", err?.response?.data); // Ini penting
      toast.error(err.response?.data?.Message);
      toast.error(err.response?.data?.error);

      if (err.response?.data?.details) {
        err.response.data.details.forEach((detailMsg) => {
          toast.error(detailMsg);
        });
      }
    }
  });
  const onSubmit = (data) => {
    console.log("tambah admin ", data);

    mutation.mutate(data);
  };

  return (
    <div className='min-h-screen items-center justify-center flex'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4">
          <legend className="fieldset-legend">Register Admin</legend>

          <label className="label">Email</label>
          <input {...register("email")} type="text" className="input" placeholder="Input email anda" />

          <label className="label">Password</label>
          <input {...register("password")} type="text" className="input" placeholder="Input password anda" />

          <input className='btn btn-soft btn-primary w-full mt-3.5' type="submit" />
        </fieldset>

      </form>
      <ToastContainer />
    </div>
  )
}

export default TambahAdmin
