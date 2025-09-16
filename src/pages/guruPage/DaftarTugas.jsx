import { useRef, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from '@tanstack/react-query';
import Api from '../../utils/Api';
const DaftarTugas = () => {
  const calendarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const { isPending, error, data: daftarTugas } = useQuery({
    queryKey: ['DaftarTugasGuru'],
    queryFn: async () => {
      const response = await Api.get('/tugas/guru');
      console.log('POST /tugas/guru :', response);
      return response.data.payload
    }
  })

  const handleEventClick = (eventInfo) => {
    setModalEvent(eventInfo.event);
    setIsModalOpen(true);

  };
  return (
    <div className='mt-4'>
      {
        isPending ? (
          <div className='flex text-center grow min-h-screen justify-center items-center'>Loading...</div>
        ) : error ? (
          <div className="flex text-center grow min-h-screen justify-center items-center">
            {error?.response?.data?.message || "Terjadi kesalahan saat memuat data."}
          </div>) :
          <FullCalendar
            ref={calendarRef}
            height="100vh"
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            weekends={true}
            events={daftarTugas}
            eventContent={renderEventContent}
            eventClick={handleEventClick}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "",
            }}
          />
      }
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              {/* content */}
              <h2 className="text-xl font-bold mb-2 text-center">{modalEvent.title}</h2>
              <p className="font-semibold">Keterangan : {modalEvent.extendedProps.description || "Tidak ada deskripsi"}</p>
              <p className="mb-4 font-semibold">kelas : {modalEvent.extendedProps.kelas.name || "Tidak ada deskripsi"}</p>
              <p className='font-semibold'>Start :
                {new Date(modalEvent.start).toLocaleDateString("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric"
                })}
              </p>
              <p className='font-semibold'>End :
                {modalEvent.end
                  ? new Date(modalEvent.end).toLocaleDateString("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                  }) : " - "} </p>
              <div className="modal-action">
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
  )
}

function renderEventContent(eventInfo) {
  const { title, extendedProps } = eventInfo.event;
  return (
    <div className='p-2'>
      <b>{title}</b><br />
      <span>kelas : {extendedProps.kelas.name}</span>
      {/* <span>{eventInfo.event.extendedProps.description}</span> */}
    </div>
  );
}
export default DaftarTugas
