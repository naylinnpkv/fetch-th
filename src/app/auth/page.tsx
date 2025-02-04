"use client";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm, SubmitHandler } from "react-hook-form";
import axios from "axios";
import { useRouter } from "next/navigation";
type FormData = {
  name: string;
  email: string;
};

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email("invalid email").required(),
});

export default function Auth() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const response = await axios.post(
      "https://frontend-take-home-service.fetch.com/auth/login",
      data,
      { withCredentials: true }
    );
    if (response.status === 200) {
      router.push("/search/1");
    } else {
      console.log("error", response.data.message);
    }
  };
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold text-center mb-5">Sign in</h1>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col w-full justify-center items-center"
      >
        <input
          type="text"
          {...register("name")}
          placeholder="name"
          className="border-2 border-gray-300 rounded-full p-2 w-1/4"
        />
        {errors.name && (
          <p className="text-red-500 text-sm">{`*${errors.name.message}`}</p>
        )}
        <input
          type="text"
          {...register("email")}
          placeholder="email"
          className="border-2 border-gray-300 rounded-full p-2 mt-2 w-1/4"
        />
        {errors.email && (
          <p className="text-red-500 text-sm">{`*${errors.email.message}`}</p>
        )}
        <button className="bg-blue-500 text-white rounded-full p-2 mt-2 w-1/4">
          Login
        </button>
      </form>
    </div>
  );
}
