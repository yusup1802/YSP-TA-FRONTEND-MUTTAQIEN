import React from 'react'
import { useQuery } from '@tanstack/react-query';
import Api from '../../utils/Api';
import { useForm } from 'react-hook-form';

const GuruKehadiranHariIni = () => {
  const { isPending, error, data: kehadiran } = useQuery({
    queryKey: ['kehadiranGuruHariIni'],
    queryFn: async () => {
      const response = await Api.get('/absensi/today');
      console.log('POST /tugas/guru :', response);
      return response.data.payload
    }
  })
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()
  const onSubmit = (data) => {
    // mutation.mutate(data);
  };
  if (isPending) return <p className="text-center">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Terjadi error: {error.message}</p>;

  return (
    <div className='flex flex-col gap-3 px-8 items-center justify-center min-h-screen bg-base-100'>
      <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" defaultChecked />
        <div className="collapse-title font-semibold">Kehadiran guru</div>
        <div className="collapse-content text-sm">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>RFID</th>
                  <th className='text-center'>Kehadiran</th>
                </tr>
              </thead>
              <tbody>
                {/* {kehadiran.hasil.belumHadir.map((murid, index) => (
                  <tr key={`belum-${murid.id}`}>
                    <td className='text-center'>{murid.name}</td>
                    <td className='text-center'>{murid.rfid?.rfidNumb}</td>
                  </tr>
                ))} */}
                  <tr>
                    <td className='text-center'>nama guru</td>
                    <td className='text-center'>rfid</td>
                    <td className='text-center'>status kehadiran</td>
                  </tr>

              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">belum hadir</div>
        <div className="collapse-content text-sm">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>RFID</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {kehadiran.hasil.belumHadir.map((murid, index) => (
                  <tr key={`belum-${murid.id}`}>
                    <td className='text-center'>{murid.name}</td>
                    <td className='text-center'>{murid.rfid?.rfidNumb}</td>
                    <td className='text-center gap-2 flex justify-center'>
                      {/* Open the modal using document.getElementById('ID').showModal() method */}
                      <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>Beri keterangan</button>
                      <button className='btn btn-error'>hapus</button>
                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                          {/* start content modal */}
                          <h3 className="text-xl font-semibold mb-2 text-center" > Beri Keterangan Kehadiran Murid </h3>
                          <form onSubmit={handleSubmit(onSubmit)} id="formKehadiranMurid">
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border px-3 flex text-left">
                              <legend className="fieldset-legend"> <h3 className="text-base">Keterangan </h3></legend>
                              <div className="mb-4">
                                <p className="text-sm">Tanggal : </p>
                                <p className="text-sm">Jam hadir : </p>
                                <p className="text-sm">Jam pulang : </p>
                                <p className="text-sm">Catatan : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex text-left">
                              <legend className="fieldset-legend">Profile Murid</legend>
                              <input type="hidden" className="hidden" {...register("rfidNumb")} />
                              <input type="hidden" className="hidden" {...register("tanggal")} />
                              <div className="flex gap-2 flex-col">
                                <p className="text-sm">Name : </p>
                                <p className="text-sm">NIS : </p>
                                <p className="text-sm">RFID : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex justify-around gap-2">
                              <legend className="fieldset-legend text-left">Beri Keterangan</legend>
                              <label>
                                <input
                                  type="radio"
                                  value="HADIR"
                                  {...register("keterangan")}
                                  className="radio radio-primary"
                                />
                                <span className="ml-2">Hadir</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="PULANG"
                                  {...register("keterangan")}
                                  className="radio radio-success"
                                />
                                <span className="ml-2">Pulang</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="IZIN"
                                  {...register("keterangan", { required: true })}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Izin</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="SAKIT"
                                  {...register("keterangan")}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Sakit</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="ALFA"
                                  {...register("keterangan")}
                                  className="radio radio-secondary"
                                />
                                <span className="ml-2">Alfa</span>
                              </label>
                            </fieldset>
                            <fieldset className="fieldset text-left">
                              <legend className="fieldset-legend">Catatan</legend>
                              <textarea
                                {...register("catatan")}
                                className="textarea w-full" placeholder="Catatan"></textarea>
                            </fieldset>
                          </form>
                          {/* end start modal */}
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn">Close</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </tr>
                ))}
                {/* /murid/:muridId/absensi */}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Murid telah hadir</div>
        <div className="collapse-content text-sm">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th className='text-center'>Name</th>
                  <th className='text-center'>RFID</th>
                  <th className='text-center'>Jam Hadir</th>
                  <th className='text-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {kehadiran.hasil.telahHadir.map((murid, index) => (
                  <tr key={`sudah-${murid.id}`}>
                    <td className='text-center'>{murid.name}</td>
                    <td className='text-center'>{murid.rfid?.rfidNumb}</td>
                    <td className='text-center'>{murid.jamHadir}</td>
                    <td className='text-center gap-2 flex justify-center'>
                      {/* Open the modal using document.getElementById('ID').showModal() method */}
                      <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>Beri Keterangan</button>
                      <button className='btn btn-error'>hapus</button>
                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                          {/* start content modal */}
                          <h3 className="text-xl font-semibold mb-2 text-center">Beri Keterangan Kehadiran Murid</h3>
                          <form onSubmit={handleSubmit(onSubmit)} id="formKehadiranMurid">
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border px-3 flex text-left">
                              <legend className="fieldset-legend"> <h3 className="text-base">Keterangan </h3></legend>
                              <div className="mb-4">
                                <p className="text-sm">Tanggal : </p>
                                <p className="text-sm">Jam hadir : </p>
                                <p className="text-sm">Jam pulang : </p>
                                <p className="text-sm">Catatan : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex text-left">
                              <legend className="fieldset-legend">Profile Murid</legend>
                              <input type="hidden" className="hidden" {...register("rfidNumb")} />
                              <input type="hidden" className="hidden" {...register("tanggal")} />
                              <div className="flex gap-2 flex-col">
                                <p className="text-sm">Name : </p>
                                <p className="text-sm">NIS : </p>
                                <p className="text-sm">RFID : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex justify-around gap-2">
                              <legend className="fieldset-legend text-left">Beri Keterangan</legend>
                              <label>
                                <input
                                  type="radio"
                                  value="HADIR"
                                  {...register("keterangan")}
                                  className="radio radio-primary"
                                />
                                <span className="ml-2">Hadir</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="PULANG"
                                  {...register("keterangan")}
                                  className="radio radio-success"
                                />
                                <span className="ml-2">Pulang</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="IZIN"
                                  {...register("keterangan", { required: true })}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Izin</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="SAKIT"
                                  {...register("keterangan")}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Sakit</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="ALFA"
                                  {...register("keterangan")}
                                  className="radio radio-secondary"
                                />
                                <span className="ml-2">Alfa</span>
                              </label>
                            </fieldset>
                            <fieldset className="fieldset text-left">
                              <legend className="fieldset-legend">Catatan</legend>
                              <textarea
                                {...register("catatan")}
                                className="textarea w-full" placeholder="Catatan"></textarea>
                            </fieldset>
                          </form>
                          {/* end content modal */}
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn">Close</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="collapse collapse-arrow bg-base-100 border-base-300 border">
        <input type="checkbox" />
        <div className="collapse-title font-semibold">Murid telah pulang</div>
        <div className="collapse-content text-sm">
          <div className="overflow-x-auto rounded-box border border-base-content/5 bg-base-100">
            <table className="table">
              {/* head */}
              <thead>
                <tr>
                  <th>Name</th>
                  <th>RFID</th>
                  <th>Jam Hadir</th>
                  <th>Jam Pulang</th>
                  <th className='text-center gap-2 flex justify-center'>Action</th>
                </tr>
              </thead>
              <tbody>
                {kehadiran.hasil.telahPulang.map((murid, index) => (
                  <tr key={`sudah-${murid.id}`}>
                    <td className='text-center'>{murid.name}</td>
                    <td className='text-center'>{murid.rfid?.rfidNumb}</td>
                    <td className='text-center'>{murid.jamHadir}</td>
                    <td className='text-center'>{murid.jamPulang}</td>
                    <td className='text-center gap-2 flex justify-center'>
                      {/* Open the modal using document.getElementById('ID').showModal() method */}
                      <button className="btn btn-primary" onClick={() => document.getElementById('my_modal_1').showModal()}>Beri Keterangan</button>
                      <button className='btn btn-error'>Hapus</button>
                      <dialog id="my_modal_1" className="modal">
                        <div className="modal-box">
                          {/* start content modal */}
                          <h3 className="text-xl font-semibold mb-2 text-center" > Beri Keterangan Kehadiran Murid </h3>
                          <form onSubmit={handleSubmit(onSubmit)} id="formKehadiranMurid">
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border px-3 flex text-left">
                              <legend className="fieldset-legend"> <h3 className="text-base">Keterangan </h3></legend>
                              <div className="mb-4">
                                <p className="text-sm">Tanggal : </p>
                                <p className="text-sm">Jam hadir : </p>
                                <p className="text-sm">Jam pulang : </p>
                                <p className="text-sm">Catatan : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex text-left">
                              <legend className="fieldset-legend">Profile Murid</legend>
                              <input type="hidden" className="hidden" {...register("rfidNumb")} />
                              <input type="hidden" className="hidden" {...register("tanggal")} />
                              <div className="flex gap-2 flex-col">
                                <p className="text-sm">Name : </p>
                                <p className="text-sm">NIS : </p>
                                <p className="text-sm">RFID : </p>
                              </div>
                            </fieldset>
                            <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex justify-around gap-2">
                              <legend className="fieldset-legend text-left">Beri Keterangan</legend>
                              <label>
                                <input
                                  type="radio"
                                  value="HADIR"
                                  {...register("keterangan")}
                                  className="radio radio-primary"
                                />
                                <span className="ml-2">Hadir</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="PULANG"
                                  {...register("keterangan")}
                                  className="radio radio-success"
                                />
                                <span className="ml-2">Pulang</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="IZIN"
                                  {...register("keterangan", { required: true })}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Izin</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="SAKIT"
                                  {...register("keterangan")}
                                  className="radio radio-warning"
                                />
                                <span className="ml-2">Sakit</span>
                              </label>
                              <label>
                                <input
                                  type="radio"
                                  value="ALFA"
                                  {...register("keterangan")}
                                  className="radio radio-secondary"
                                />
                                <span className="ml-2">Alfa</span>
                              </label>
                            </fieldset>
                            <fieldset className="fieldset text-left">
                              <legend className="fieldset-legend">Catatan</legend>
                              <textarea
                                {...register("catatan")}
                                className="textarea w-full" placeholder="Catatan"></textarea>
                            </fieldset>
                          </form>
                          {/* end start modal */}
                          <div className="modal-action">
                            <form method="dialog">
                              {/* if there is a button in form, it will close the modal */}
                              <button className="btn">Close</button>
                            </form>
                          </div>
                        </div>
                      </dialog>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  )
}

export default GuruKehadiranHariIni
