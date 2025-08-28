import React, { useRef, useState } from 'react'
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { useQuery } from '@tanstack/react-query';
import Api from '../../utils/Api';
const DaftarTugasMurid = () => {
  const calendarRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalEvent, setModalEvent] = useState(null);

  const { isPending, error, data: daftarTugas } = useQuery({
    queryKey: ['listTugasKelas'],
    queryFn: async () => {
      const response = await Api.get('/tugas/kelas');
      console.log(response.data);

      return response.data.payload
    }
  })

  if (isPending) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  const handleDateClick = (arg) => {
    setIsModalOpen(true);
  };

  const handleEventClick = (eventInfo) => {
    setModalEvent(eventInfo.event);
    setIsModalOpen(true);

  };
  return (
    <div className='p-7'>
      <FullCalendar
        ref={calendarRef}
        height="100vh"
        plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        weekends={true}
        events={daftarTugas}
        eventContent={renderEventContent}
        dateClick={handleDateClick}
        eventClick={handleEventClick}  // Menambahkan event click untuk event
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
      />
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <div className="modal modal-open">
            <div className="modal-box">
              {/* content */}
              <h2 className="text-xl font-semibold mb-2 text-center">{modalEvent.title}</h2>
              <p className="mb-4">Keterangan : {modalEvent.extendedProps.description || "Tidak ada deskripsi"}</p>
              {/* Bisa juga tambahkan detail lain jika perlu */}
              <p><b>Start:</b> {modalEvent.start.toLocaleString()}</p>
              <p><b>End:</b> {modalEvent.end ? modalEvent.end.toLocaleString() : "-"}</p>
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
      {/* <span>{eventInfo.event.extendedProps.description}</span> */}
    </div>
  );
}
export default DaftarTugasMurid
