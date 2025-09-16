import { useQuery } from '@tanstack/react-query';
import Api from '../../utils/Api';

const GuruProfilePage = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ['GuruProfilePage'],
    queryFn: async () => {
      const response = await Api.get(`/guru`);
      console.log(response.data.user);
      return response.data.user;
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-base-100">
      {isPending ? (
        <div className="w-full flex items-center justify-center min-h-screen">
          <span className="loading loading-spinner loading-xl" />
        </div>
      ) : error ? (
        <div className="w-full flex items-center justify-center min-h-screen">
          <p className="text-center text-red-500 font-bold">
            Terjadi kesalahan saat mengambil data
          </p>
        </div>
      ) : (
        <div className="flex flex-col w-1/2 max-w-screen-lg">
          <div className="flex gap-4">
            <div className="card bg-base-300 rounded-box p-5 w-full">
              <p><strong>Nama <span className='mx-1.5'>:</span></strong> {data.guruProfile.name}</p>
              <p><strong>Nik <span className='mx-1.5'>:</span></strong> {data.guruProfile.nik}</p>
              <p><strong>Email <span className='mx-1.5'>:</span></strong>  {data.email}</p>
              <p><strong>Wali Kelas <span className='mx-1.5'>:</span></strong> {data.guruProfile.namaKelas}</p>
              <p><strong>Nomor Handphone <span className='mx-1.5'>:</span></strong> {data.guruProfile.noGuru}</p>
              <p><strong>RFID <span className='mx-1.5'>:</span></strong> {data.rfidNumb}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GuruProfilePage

