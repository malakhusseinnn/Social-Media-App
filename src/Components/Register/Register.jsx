import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import * as z from "zod";

const schema = z
  .object({
    name: z
      .string()
      .min(2, "min length is 2 chars")
      .max(20, "max length is 20 chars")
      .nonempty("name is required"),

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

    rePassword: z.string().nonempty("password confirmation is required"),

    dateOfBirth: z.string().refine((date) => {
      const userDate = new Date(date).getFullYear();
      const currentDate = new Date();

      return currentDate - userDate >= 10;
    }, "Must be at least 10 years old!"),

    gender: z.enum(["male", "female"]),
  })
  .refine(
    (obj) => {
      const password = obj.password;
      const rePassword = obj.rePassword;
      return rePassword === password;
    },
    {
      message: "the password and its confirmation does not match",
      path: ["rePassword"],
    },
  );

export default function Register() {
  const navigate = useNavigate();
  const [apiError, setApiError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { register, handleSubmit, formState } = form;

  function handleRegister(obj) {
    setIsLoading(true);
    axios
      .post(`https://route-posts.routemisr.com/users/signup`, obj)
      .then((res) => {
        if (res.data.message === "account created") {
          navigate("/login");        
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
    <>
      <div>
        <h1 className="font-bold text-5xl text-center">Register Now!</h1>
        {apiError && (
          <p className="bg-red-900 p-2 my-4 rounded-xl w-[400px] mx-auto text-center text-white font-bold">
            {apiError}
          </p>
        )}
        <form
          onSubmit={handleSubmit(handleRegister)}
          className="max-w-md mx-auto mt-16"
        >
          <div className="relative z-0 w-full mb-5 group mt-2">
            <input
              {...register("name")}
              type="text"
              name="name"
              id="name"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="name"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your Name
            </label>

            {formState.errors.name && formState.touchedFields.name && (
              <p className="bg-amber-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                {formState.errors.name?.message}
              </p>
            )}
          </div>
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

          <div className="relative z-0 w-full mb-5 group mt-2">
            <input
              {...register("rePassword")}
              type="password"
              name="rePassword"
              id="rePassword"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="rePassword"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your confirmed password
            </label>

            {formState.errors.rePassword &&
              formState.touchedFields.rePassword && (
                <p className="bg-amber-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                  {formState.errors.rePassword?.message}
                </p>
              )}
          </div>
          <div className="relative z-0 w-full mb-5 group mt-2">
            <input
              {...register("dateOfBirth")}
              type="date"
              name="dateOfBirth"
              id="dateOfBirth"
              className="block py-2.5 px-0 w-full text-sm text-heading bg-transparent border-0 border-b-2 border-default-medium appearance-none focus:outline-none focus:ring-0 focus:border-brand peer"
              placeholder=" "
            />
            <label
              htmlFor="dateOfBirth"
              className="absolute text-sm text-body duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 peer-focus:text-fg-brand peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto"
            >
              Enter your Date of Birth
            </label>
          </div>

          <div className="flex gap-5 mt-2">
            <div className="flex items-center mb-4">
              <input
                {...register("gender")}
                id="male"
                type="radio"
                name="gender"
                defaultValue="male"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
                defaultChecked
              />
              <label
                htmlFor="male"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                Male
              </label>
            </div>

            <div className="flex items-center mb-4">
              <input
                {...register("gender")}
                id="female"
                type="radio"
                name="gender"
                defaultValue="female"
                className="w-4 h-4 text-neutral-primary border-default-medium bg-neutral-secondary-medium rounded-full checked:border-brand focus:ring-2 focus:outline-none focus:ring-brand-subtle border border-default appearance-none"
              />
              <label
                htmlFor="female"
                className="select-none ms-2 text-sm font-medium text-heading"
              >
                Female
              </label>
            </div>

            {formState.errors.gender && formState.touchedFields.gender && (
              <p className="bg-amber-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                {formState.errors.gender?.message}
              </p>
            )}
          </div>

          <button
            disabled={isLoading}
            type="submit"
            className="text-white bg-brand disabled:cursor-not-allowed disabled:bg-amber-900 w-full bg-amber-700 rounded-xl hover:cursor-pointer hover:bg-amber-800 transition transition-normal box-border border border-transparent hover:bg-brand-strong focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-base text-sm px-4 py-2.5 focus:outline-none"
          >
            {isLoading ? "Loading..." : "Register"}
          </button>
        </form>
      </div>
    </>
  );
}
