import { useFieldArray, useFormContext } from "react-hook-form";

export const MuridData = () => {
  const { register } = useFormContext();
  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box border p-3 flex flex-row">
      <legend className="fieldset-legend">Profile Murid</legend>
      <div className="flex flex-col w-1/2">
        <label className="label">Nama Murid</label>
        <input
          {...register("muridProfile.name")}
          type="text"
          className="input mt-2"
          placeholder="Input nama anda"
        />
      </div>
      <div className="flex flex-col w-1/2">

        <label className="label">No Handphone murid</label>
        <input
          {...register("muridProfile.noMurid")}
          type="text"
          className="input mt-2"
          placeholder="Input nomor hp murid"
        />
      </div>
    </fieldset>
  );
};

export const WaliMuridFields = () => {
  const { register, control } = useFormContext(); // ambil context
  const { fields, append, remove } = useFieldArray({
    control,
    name: "muridProfile.waliMurids",
  });

  return (
    <fieldset className="fieldset bg-base-200 border-base-300 rounded-box w-full border p-4">
      <legend className="fieldset-legend">List Wali Murid</legend>
      {fields.map((field, index) => (
        <div key={field.id} className="flex flex-row gap-4 items-end">
          <div className="w-2/5">
            <label className="label">Nama Wali Murid</label>
            <input {...register(`muridProfile.waliMurids.${index}.nameWaliMurid`)} className="input w-full mt-2" placeholder="Nama Wali" />
          </div>

          <div className="w-2/5">

            <label className="label">Nomor Wali Murid</label>
            <input {...register(`muridProfile.waliMurids.${index}.noWaliMurid`)} className="input w-full mt-2" placeholder="No HP Wali" />
          </div>
          <button className="btn btn-soft btn-error" type="button" onClick={() => remove(index)}>Hapus</button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => append({ nameWaliMurid: "", noWaliMurid: "" })}
        className="btn btn-soft btn-accent mt-3"
      >
        Tambah Wali
      </button>
    </fieldset>
  );
};


