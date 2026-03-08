import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";
import { AuthContext } from "./../../Context/AuthContext";

const schema = z.object({
  email: z
    .email("invalid email")
    .regex(
      /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/,
      "email does not match the pattern",
    )
    .nonempty("email is required"),

  password: z
    .string()
    .regex(
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
      "the password does not match the pattern",
    )
    .nonempty("password is required"),
});

export default function Login() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { userToken, setUserToken } = useContext(AuthContext);
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handleLogin(obj) {
    setIsLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signin`, obj)
      .then((res) => {
        if (res.data.message === "signed in successfully") {
          localStorage.setItem("userToken", res.data.data.token);
          setUserToken(res.data.data.token);

          navigate("/");
        }
      })
      .catch((err) => {
        setApiError(err.response.data.message);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }
  return (
    <div>
      <h1 className="font-bold text-5xl text-center">Login Now!</h1>
      {apiError && (
        <p className="bg-red-900 p-2 my-4 rounded-xl w-[400px] mx-auto text-center text-white font-bold">
          {apiError}
        </p>
      )}

      <form
        className="max-w-md mx-auto mt-16"
        onSubmit={handleSubmit(handleLogin)}
      >
        <div className="relative z-0 w-full mb-5 group mt-2">
          <input
            {...register("email")}
            type="email"
            name="email"
            id="email"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="email"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter your Email
          </label>

          {formState.errors.email && formState.touchedFields.email && (
            <p className="bg-amber-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
              {formState.errors.email?.message}
            </p>
          )}
        </div>

        <div className="relative z-0 w-full mb-5 group mt-2">
          <input
            {...register("password")}
            type="password"
            name="password"
            id="password"
            className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
            placeholder=" "
          />
          <label
            htmlFor="password"
            className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
          >
            Enter your Password
          </label>

          {formState.errors.password && formState.touchedFields.password && (
            <p className="bg-amber-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
              {formState.errors.password?.message}
            </p>
          )}
        </div>

        <button
          disabled={isLoading}
          type="submit"
          className="text-white disabled:bg-amber-900 bg-brand w-full bg-amber-700 rounded-xl hover:cursor-pointer hover:bg-amber-800 transition transition-normal box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
        >
          {isLoading ? "Loading..." : "Login"}
        </button>
      </form>
    </div>
  );
}
