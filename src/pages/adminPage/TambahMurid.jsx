import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form"
import { ToastContainer, toast } from 'react-toastify';
import Api from '../../utils/Api';
import { useEffect, useState } from 'react';
import axios from 'axios';


const fetchRfid = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND}/rfid`);
  console.log("datanya : ", res.data);

  return res.data;
};


const TambahMurid = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/admin/murid`, data),
    onSuccess: (response) => {
      toast.success(response.data.message);
      queryClient.invalidateQueries({ queryKey: ['tambahMurid'] });
      reset();
    },
    onError: (err) => {
      // console.log(`tambah Murid.jsx : ${err}`);
      console.log("🔴 Axios error full object:", err); // Bukan string
      console.log("📦 Server response:", err?.response?.data); // Ini penting
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
      nis: parseInt(data.nis, 10),
      kelasId: parseInt(data.kelasId, 10),
    };
    console.log(newData);
    mutation.mutate(newData);
  };

  const [autoRefetch, setAutoRefetch] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rfid-tambah-murid"],
    queryFn: fetchRfid,
    refetchInterval: autoRefetch ? 5000 : false, // aktif polling 5 detik saat toggle on
  });

  useEffect(() => {
    if (data?.rfid) {
      setValue("rfidNumb", data.rfid);
    }
  }, [data, setValue]);

  return (
    <div className='min-h-screen items-center justify-center flex'>
      <form className='w-full flex justify-center px-2.5' onSubmit={handleSubmit(onSubmit)}>
        <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-4 w-full">
          <legend className="fieldset-legend">Register Murid</legend>
          <label className="flex w-full justify-end px-4 gap-4 items-center">
            <span className="text-sm font-medium">Auto Refetch</span>
            <input
              type="checkbox"
              className="toggle toggle-primary"
              checked={autoRefetch}
              onChange={() => setAutoRefetch((prev) => !prev)}
            />
          </label>
          <div className='flex flex-wrap w-full gap-4 justify-center'>
            <div className='flex w-[48%] flex-col'>
              <label className="label">Email</label>
              <input {...register("email")} type="text" className="input w-full" placeholder="Input email anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">Password</label>
              <input {...register("password")} type="text" className="input w-full" placeholder="Input password anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">Nis</label>
              <input {...register("nis")} type="text" className="input w-full" placeholder="Input nis anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">Name</label>
              <input  {...register("name")} type="text" className="input w-full" placeholder="Input nama anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">kelas</label>
              <input {...register("kelasId")} type="text" className="input w-full" placeholder="Input kelas anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">No Orang Tua Murid</label>
              <input {...register("noMurid")} type="text" className="input w-full" placeholder="Input Nomor Anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">RFID</label>
              <input {...register("rfidNumb")} type="text" className="input w-full" placeholder="Input Nomor RFID" />
            </div>

          </div>

          <input className='btn btn-soft btn-primary w-full mt-3.5' type="submit" />
        </fieldset>
      </form>
      <ToastContainer />
    </div>
  )
}

export default TambahMurid
