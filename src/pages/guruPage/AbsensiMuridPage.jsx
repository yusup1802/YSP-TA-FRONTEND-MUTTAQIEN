import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { NavLink } from "react-router";
import Api from "../../utils/Api";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import HandleLogout from "../../utils/HandleLogout";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);


const AbsensiMuridPage = () => {
  const { muridId } = useParams();
  const calendarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/guru/absensi`, data),
    onSuccess: (response) => {
      const failed = response?.data?.payload?.failedNumbers;
      const message = response?.data?.message || "Tugas berhasil dikirim";
      if (Array.isArray(failed) && failed.length > 0) {
        toast.warn(
          <div>
            {message}<br /><br />
            Sebagian pesan gagal dikirim ke:
            {failed.map(f => f.number).join(", ")}
          </div>
        );

      } else {
        toast.success(message);
      }

      setIsModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['absensiMuridByID'] });
      reset();
    },
    onError: (err) => {
      toast.error(err.response?.data?.Message || "Gagal Validasi"); //gagal validasi
      toast.error(err.response?.data?.error); // error response
      if (err.response?.data?.details) { // error detail validasi
        err.response.data.details.forEach((detailMsg) => {
          toast.error(detailMsg);
        });
      }
    }
  });
  const onSubmit = (data) => {
    mutation.mutate(data);
  };
  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const handleDateClick = (arg) => {
    const start = dayjs(arg.date).tz("Asia/Jakarta").startOf("day").toDate();
    setModalEvent({
      title: "Tanggal Dipilih",
      start,
      extendedProps: {
        rfidNumb: murid?.rfidNumb || "",
        catatan: ""
      }
    });
    setValue("tanggal", start);
    setIsModalOpen(true);
    setValue("rfidNumb", murid?.rfidNumb || "");
  };

  const handleEventClick = (eventInfo) => {
    setModalEvent(eventInfo.event);
    setIsModalOpen(true);
    const rfidNumb = eventInfo.event.extendedProps?.rfidNumb || "tidak ada rfid";
    setValue("rfidNumb", rfidNumb || "");
    const tanggal = dayjs(eventInfo.event.start).tz("Asia/Jakarta").startOf("day").toDate();
    setValue("tanggal", tanggal);

  };


  const { isPending, error, data } = useQuery({
    queryKey: ['absensiMuridByID'],
    queryFn: async () => {
      const response = await Api.get(`/murid/${muridId}/absensi`);
      return response.data
    }
  })
  const murid = data?.murid;

  const events = data?.absensi?.map((absen) => ({
    title: absen.keterangan,
    start: new Date(absen.tanggal),
    allDay: true,
    extendedProps: {
      jamHadir: absen.jamHadir,
      jamPulang: absen.jamPulang,
      rfidNumb: absen.rfidNumb,
      catatan: absen.catatan,
    },
  })) || [];

  if (isPending) return <p>Memuat data murid...</p>;
  if (error) return <p>Gagal memuat data: {error.message}</p>;
  // if (!kelasData) return <p>Data kelas tidak ditemukan.</p>;

  return (
    <div className="mx-auto w-3/4 ">
      <ToastContainer />
      <div className="flex items-center justify-between w-full mb-6 p-4">
        <div className="flex gap-3">
          <HandleLogout />
          <NavLink to={`/guru`} className={'btn btn-primary'}>kembali</NavLink>
        </div>

        <div className="text-right">
          <h1 className="text-xl font-bold">{murid?.name}</h1>
          <p className="text-lg text-gray-300">{murid?.kelas}</p>
        </div>
      </div>

      <FullCalendar
        ref={calendarRef}
        height="100vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}  // Menambahkan event click untuk event
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
      />

      {/* Modal */}
      {isModalOpen && modalEvent && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              <h3 className="text-xl font-semibold mb-2 text-center">Beri Keterangan Kehadiran Murid</h3>
              {/* content */}


              <form onSubmit={handleSubmit(onSubmit)} id="formKehadiranMurid">
                {/* register your input into the hook by invoking the "register" function */}
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border px-3 flex flex-row">
                  <legend className="fieldset-legend">{modalEvent?.title && <h3 className="text-base">Keterangan {modalEvent.title}</h3>}</legend>
                  <div className="mb-4">
                    <p className="text-sm">Tanggal : {dayjs(modalEvent?.start).tz("Asia/Jakarta").format("DD/MM/YYYY")}</p>
                    {modalEvent?.extendedProps?.jamHadir && (
                      <p className="text-sm ">Jam hadir : {new Date(modalEvent.extendedProps.jamHadir).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      </p>
                    )}
                    {modalEvent?.extendedProps?.jamPulang && (
                      <p className="text-sm ">Jam pulang : {new Date(modalEvent.extendedProps.jamHadir).toLocaleTimeString("id-ID", {
                        hour: "2-digit",
                        minute: "2-digit"
                      })}
                      </p>
                    )}
                    {modalEvent?.extendedProps?.catatan && (
                      <p className="text-sm ">Catatan : {modalEvent.extendedProps.catatan}</p>
                    )}
                  </div>
                </fieldset>
                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex flex-row">
                  <legend className="fieldset-legend">Profile Murid</legend>
                  <input type="hidden" className="hidden" {...register("rfidNumb")} />
                  <input type="hidden" className="hidden" {...register("tanggal")} />
                  <div className="flex gap-2.5 flex-col">
                    <h1 className="text-sm">Name : {murid?.name}</h1>
                    <p className="text-sm">NIS: {murid?.nis}</p>
                    <p className="text-sm">RFID: {murid?.rfidNumb}</p>
                  </div>
                </fieldset>


                <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex justify-around gap-2">
                  <legend className="fieldset-legend">Beri Keterangan</legend>
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
                <fieldset className="fieldset">
                  <legend className="fieldset-legend">Catatan</legend>
                  <textarea
                    {...register("catatan")}
                    className="textarea w-full" placeholder="Catatan"></textarea>
                </fieldset>
              </form>
              <div className="modal-action">
                <button className="btn btn-primary" type="submit" form="formKehadiranMurid">Submit</button>

                <button
                  className="btn"
                  onClick={() => setIsModalOpen(false)}
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function renderEventContent(eventInfo) {
  const { title, extendedProps } = eventInfo.event;
  return (
    <div className={`p-1 text-xs leading-snug cursor-pointer truncate max-w-full  ${title === 'HADIR'
      ? 'bg-green-600 text-white'
      : title === 'IZIN' || title === 'SAKIT'
        ? 'bg-yellow-400 text-black'
        : title === 'ALFA'
          ? 'bg-red-600 text-white'
          : 'bg-blue-600 text-white'
      }`}
    >
      <strong

      >{title}</strong><br />
      <p className="truncate max-w-full">
        {extendedProps?.jamHadir && <span>Hadir: {extendedProps.jamHadir}</span>}
      </p>
      <p className="truncate max-w-full">
        {extendedProps?.jamPulang && <span>Pulang: {extendedProps.jamPulang}</span>}
      </p>
      <p className="truncate max-w-full">
        {extendedProps?.catatan && <span>Catatan: {extendedProps.catatan}</span>}
      </p>
    </div>
  );
}
export default AbsensiMuridPage
