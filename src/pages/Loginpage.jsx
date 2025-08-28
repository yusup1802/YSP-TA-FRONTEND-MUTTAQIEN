import { useForm } from "react-hook-form";
import { useNavigate } from "react-router"; // pastikan ini bukan from 'react-router'
import { useMutation } from "@tanstack/react-query";
import Api from "./../utils/Api";
import AuthStore from "../stores/AuthStore";
import { Bounce, ToastContainer, toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();


  // Fungsi async untuk login
  const loginFn = async (data) => {
    const res = await Api.post(`${import.meta.env.VITE_BACKEND}/login`, data);
    return res.data;
  };

  // useMutation v5 style
  const mutation = useMutation({

    mutationFn: loginFn,
    onSuccess: (data) => {
      const { accessToken, refreshToken, user } = data.payload;
      localStorage.setItem("accessToken", accessToken);
      localStorage.setItem("refreshToken", refreshToken);

      AuthStore.getState().setAuthenticated(true);
      AuthStore.getState().setUser(user);
    },
    onError: (err) => {
      if (err.response?.data?.details) {
        err.response.data.details.forEach((detailMsg) => {
          toast.error(detailMsg);
        });
      } else {
        toast.error("Terjadi kesalahan saat login");
      }
    },
  });

  // Handler submit form
  const onSubmit = (formData) => {
    console.log("mutation.isLoading:", mutation.isPending);
    mutation.mutate(formData);
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <ToastContainer />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="fieldset bg-base-200 border-base-300 rounded-box w-xs border p-4"
      >
        <legend className="fieldset-legend">Login</legend>

        <label className="label">Email</label>
        <input
          type="text"
          className="input"
          placeholder="Input your email"
          {...register("email", { required: "Email wajib diisi" })}
        />
        {errors.email && (
          <p className="text-red-500">{errors.email.message}</p>
        )}

        <label className="label">Password</label>
        <input
          type="password"
          className="input"
          placeholder="Input your password"
          {...register("password", { required: "Password wajib diisi" })}
        />
        {errors.password && (
          <p className="text-red-500">{errors.password.message}</p>
        )}

        <button
          type="submit"
          className="btn btn-primary mt-4"
          disabled={mutation.isPending}
        >
          {mutation.isPending ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
