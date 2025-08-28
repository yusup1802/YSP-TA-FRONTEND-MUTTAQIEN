import { useForm, FormProvider, useFormContext, useFieldArray } from "react-hook-form";
import { DayPicker } from "react-day-picker";
import "react-day-picker/style.css";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {  ToastContainer, toast } from 'react-toastify';
import Api from "../../utils/Api";

export default function TambahTugas() {
  const methods = useForm({
    defaultValues: {
      selectedType: "oneDate",
      tugas: [],
    },
  });

  const { watch, control, reset } = methods;
  const selectedType = watch("selectedType");

  const { fields, append, remove } = useFieldArray({
    control,
    name: "tugas",
  });

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => Api.post(`${import.meta.env.VITE_BACKEND}/guru/jadwal`, data),
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

      queryClient.invalidateQueries({ queryKey: ['addTugas'] });
      reset();
    },

    onError: (err) => {
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
    // console.log("data yg dikirim", data.tugas);
    mutation.mutate(data.tugas);
  };

  const handleAppend = () => {
    if (selectedType === "dateRange") {
      append({ date: { from: undefined, to: undefined }, type: "dateRange", title: "", description: "" });
    }
    if (selectedType === "optionsDate") {
      append({ date: [], type: "optionsDate", title: "", description: "" });
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)} className="flex h-screen overflow-hidden">
        <FormSelectedType handleAppend={handleAppend}>
          <button type="button" className="btn btn-primary mt-4" onClick={handleAppend}>
            Tambah Tugas
          </button>
        </FormSelectedType>
        <div className="flex-1 overflow-y-auto">

          <TugasFieldArray
            fields={fields}
            handleAppend={handleAppend}
            remove={remove}
          />

          {fields.length > 0 && (
            <div className="flex justify-end gap-4">
              <input type="submit" className="btn btn-primary mt-4 items-end w-2/12" />
              <button
                type="button"
                className="btn btn-error mt-4 mr-4 w-2/12"
                onClick={() => methods.reset({
                  selectedType: "oneDate",
                  tugas: [],
                })}
              >
                Batal
              </button>
            </div>
          )}
        </div>
      </form>
      <ToastContainer />
    </FormProvider>
  );
}

function FormSelectedType({ children }) {
  const { register, watch } = useFormContext();
  const selectedType = watch("selectedType");

  return (
    <div className="tabs tabs-box flex flex-col w-fit min-h-screen  p-4 px-6 mx-3">
      <h1>Pilih Mode Tugas</h1>
      <input type="radio" name="my_tabs_1" className="tab" aria-label="optionsDate" value="optionsDate" {...register("selectedType")} defaultChecked />
      <input type="radio" name="my_tabs_1" className="tab" aria-label="dateRange" value="dateRange" {...register("selectedType")} />
      {/* <p>Selected: {selectedType}</p> */}
      <div className="mt-2">{children}</div>
    </div>
  );
}

function TugasFieldArray({ fields, handleAppend, remove }) {
  const { watch, register, setValue } = useFormContext();
  const tugas = watch("tugas") || [];

  return (
    <div>
      {fields.length <= 0 && (
        <div className="flex flex-col h-screen">
          <div className="text-center grow flex flex-col items-center justify-center">
            <p className="text-gray-500 ">Belum ada tugas ditambahkan.</p>
            <button
              type="button"
              className="btn btn-primary mt-4"
              onClick={handleAppend}
            >
              Tambah Tugas Pertama
            </button>
          </div>
        </div>
      )
      }
      {
        fields.map((field, index) => (
          <div
            key={field.id}
            style={{
              border: "1px solid #ccc",
            }}
            className="collapse collapse-arrow bg-base-100 border border-base-300 p-3 mt-4"
          >

            {/* <input type="radio" name="tugas-accordion" defaultChecked={index === 0} /> */}
            <input type="checkbox" defaultChecked />

            <div className="collapse-title font-semibold">
              Tugas {index + 1} - Tipe: {field.type}
            </div>

            <div className="collapse-content text-sm flex gap-10">
              <div className="mt-3 w-full justify-center flex items-center flex-col">
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Judul Tugas</legend>

                  <input
                    type="text"
                    placeholder="Judul Tugas"
                    className="input input-bordered w-full mb-2"
                    {...register(`tugas.${index}.title`)}
                  />
                </fieldset>
                <fieldset className="fieldset w-full">
                  <legend className="fieldset-legend">Deskripsi Tugas</legend>

                  <input
                    type="text"
                    placeholder="Deskripsi Tugas"
                    className="input input-bordered w-full mb-2"
                    {...register(`tugas.${index}.description`)}
                  />
                </fieldset>
              </div>
              <div>

                {field.type === "optionsDate" && (
                  <DayPicker
                    mode="multiple"
                    selected={tugas[index]?.date || []}
                    onSelect={(dates) => setValue(`tugas.${index}.date`, dates)}
                    disabled={{ before: new Date() }}

                  />
                )}

                {field.type === "dateRange" && (
                  <DayPicker
                    animate
                    mode="range"
                    selected={watch(`tugas.${index}.date`)}
                    onSelect={(range) => setValue(`tugas.${index}.date`, range)}
                    disabled={{ before: new Date() }}
                  />
                )}
              </div>

            </div>
            <button
              className="btn btn-soft btn-error"
              type="button"
              onClick={() => remove(index)}
            >
              Hapus
            </button>
          </div>
        ))
      }
    </div >
  );
}

