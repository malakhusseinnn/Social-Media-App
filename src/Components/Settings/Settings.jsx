import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { IoKeySharp } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import * as z from "zod";
import { AuthContext } from "../../Context/AuthContext";

const schema = z
  .object({
    password: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "the password does not match the pattern",
      )
      .nonempty("password is required"),

    newPassword: z
      .string()
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "the password does not match the pattern",
      )
      .nonempty("new password is required"),

    rePassword: z.string().nonempty("new password confirmation is required"),
  })
  .refine(
    (obj) => {
      const newPassword = obj.newPassword;
      const rePassword = obj.rePassword;
      return rePassword === newPassword;
    },
    {
      message: "the new password and its confirmation does not match",
      path: ["rePassword"],
    },
  );

export default function Settings() {
  const { setUserToken } = useContext(AuthContext);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState(false);
  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      rePassword: "",
    },

    resolver: zodResolver(schema),
    mode: "onChange",
  });

  function logOut() {
    localStorage.removeItem("userToken");
    setUserToken(null);
    navigate("/login");
  }

  function changePassword(data) {
    setIsLoading(true);
    const body = {
      password: data.password,
      newPassword: data.newPassword,
    };
    axios
      .patch("https://route-posts.routemisr.com/users/change-password", body, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then(() => {
        toast.success("Password Changed Successfully..💜", {
          position: "top-center",
        });
        logOut();
      })
      .catch((error) => {
        const message = error.response?.data?.message;

        if (message === "incorrect email or password") {
          toast.error("Current password does not exist..., Enter a valid one", {
            position: "top-center",
          });
        } else {
          setApiError(true);
          toast.error("Can't change the password right now..!!", {
            position: "top-center",
          });
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  }

  return (
    <>
      <Helmet>
        <title> Change Password </title>
      </Helmet>
      <div className="changePasswordCard shadow-2xl w-[70%] mx-auto rounded-2xl p-4">
        <div className="flex gap-3 items-center mb-8">
          <div className="bg-blue-200 rounded-full w-10 h-10 flex justify-center items-center">
            <IoKeySharp className="text-blue-700" />
          </div>
          <div>
            <p className="font-bold text-2xl">Change Password</p>
            <p>Keep your account secure by using a strong password.</p>
          </div>
        </div>

        {apiError && (
          <h2 className="font-bold text-lg text-red-900 bg-red-200 rounded-xl p-1 mb-8">
            Something Went Wrong, Please Try Again Later..
          </h2>
        )}

        <form onSubmit={handleSubmit(changePassword)}>
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-2">
              <label htmlFor="currentPassword" className="font-bold">
                Current Password
              </label>
              <input
                {...register("password")}
                type="password"
                id="currentPassword"
                className="outline-none rounded-xl p-2 bg-slate-100 border-1 border-slate-500/30 focus:border-blue-500"
                placeholder="Enter Your Current Password"
              />

              {formState.errors.password &&
                formState.touchedFields.password && (
                  <p className="bg-red-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                    {formState.errors.password?.message}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="newPassword" className="font-bold">
                New Password
              </label>
              <input
                {...register("newPassword")}
                type="password"
                id="newPassword"
                className="outline-none rounded-xl p-2 bg-slate-100 border-1 border-slate-500/30 focus:border-blue-500"
                placeholder="Enter Your New Password"
              />

              {formState.errors.newPassword &&
                formState.touchedFields.newPassword && (
                  <p className="bg-red-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                    {formState.errors.newPassword?.message}
                  </p>
                )}
            </div>

            <div className="flex flex-col gap-2">
              <label htmlFor="confirmation" className="font-bold">
                Confirm New Password
              </label>
              <input
                {...register("rePassword")}
                type="password"
                id="confirmation"
                className="outline-none rounded-xl p-2 bg-slate-100 border-1 border-slate-500/30 focus:border-blue-500"
                placeholder="Re-Enter New Password"
              />
              {formState.errors.rePassword &&
                formState.touchedFields.rePassword && (
                  <p className="bg-red-100 text-amber-800 p-3 text-center rounded-2xl mt-2 font-bold">
                    {formState.errors.rePassword?.message}
                  </p>
                )}
            </div>

            <button
              disabled={isLoading}
              type="submit"
              className="w-full bg-blue-400 font-bold text-white p-2 rounded-xl cursor-pointer hover:bg-blue-500 transition-background duration-500 disabled:cursor-not-allowed disabled:bg-slate-900"
            >
              {isLoading ? "Updaing.." : "Update Password"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
