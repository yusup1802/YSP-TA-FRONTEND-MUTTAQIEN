import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import Api from "../../utils/Api";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

const RiwayatAbsensiByMurid = () => {
  const calendarRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm()

  const { isPending, error, data } = useQuery({
    queryKey: ['absensiMuridByID'],
    queryFn: async () => {
      const response = await Api.get(`/murid/absensi`);
      console.log("riwayat absensi :", response);
      return response.data;
    }
  })

  const events = data?.payload?.map((absen) => ({
    title: absen.keterangan,
    start: dayjs(absen.tanggal).tz("Asia/Jakarta").format("YYYY-MM-DD"),
    allDay: true,
    extendedProps: {
      jamHadir: absen.jamHadir,
      jamPulang: absen.jamPulang,
      rfidNumb: absen.rfidNumb,
      catatan: absen.catatan,
      deskripsi: absen.deskripsi,
    },
  })) || [];


  if (isPending) return <p>Memuat data murid...</p>;
  if (error) return <p>Gagal memuat data: {error.message}</p>;
  // if (!kelasData) return <p>Data kelas tidak ditemukan.</p>;

  return (
    <div className="mx-auto w-3/4 ">
      <FullCalendar
        ref={calendarRef}
        height="100vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={events}
        eventContent={renderEventContent}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
      />

      {/* Modal */}

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
      {extendedProps?.catatan && (
        <p className="truncate max-w-full italic">Catatan: {extendedProps.catatan}</p>
      )}
      {extendedProps?.deskripsi && (
        <p className="truncate max-w-full italic">Deskripsi: {extendedProps.deskripsi}</p>
      )}
    </div>
  );
}
export default RiwayatAbsensiByMurid
