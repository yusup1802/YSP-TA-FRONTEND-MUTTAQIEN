import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useForm } from "react-hook-form"
import Api from '../../utils/Api';
import { ToastContainer, toast } from 'react-toastify';
import { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';

const fetchRfid = async () => {
  const res = await axios.get(`${import.meta.env.VITE_BACKEND}/rfid`); // ganti dengan endpoint kamu
  console.log("datanya : ", res.data);

  return res.data;
};

const TambahGuru = () => {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
  } = useForm()
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/admin/guru`, data),
    onSuccess: (response) => {
      toast.success(response.data.message);

      queryClient.invalidateQueries({ queryKey: ['tambahGuru'] });
      reset(); // kosongkan form
    }, onError: (err) => {
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
    }
  });
  const onSubmit = (data) => {
    const newData = {
      ...data,
      nik: parseInt(data.nik, 10)
    };
    mutation.mutate(newData);
  };

  const [autoRefetch, setAutoRefetch] = useState(false);

  const { data, isLoading, error } = useQuery({
    queryKey: ["rfid-tambah-guru"],
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
          <legend className="fieldset-legend">Register Guru</legend>
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
              <label className="label">Nik</label>
              <input {...register("nik")} type="text" className="input w-full" placeholder="Input nik anda" />
            </div>
            <div className='flex w-[48%] flex-col'>
              <label className="label">Name</label>
              <input  {...register("name")} type="text" className="input w-full" placeholder="Input nama anda" />
            </div>

            <div className='flex w-[48%] flex-col'>
              <label className="label">Nomor Handphone</label>
              <input  {...register("noGuru")} type="text" className="input w-full" placeholder="Input nomor handphone" />
            </div>
            <div className='flex w-[48%] flex-col'>
              <label className="label">RFID</label>
              <input  {...register("rfidNumb")} type="text" className="input w-full" placeholder="Input nomor RFID" />
            </div>
          </div>
          <input className='btn btn-soft btn-primary w-full mt-3.5' type="submit" />
        </fieldset>
      </form>
      <ToastContainer />
    </div>
  )
}

export default TambahGuru
