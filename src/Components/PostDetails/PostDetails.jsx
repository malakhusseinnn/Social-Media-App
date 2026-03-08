import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import React from "react";
import { useParams } from "react-router-dom";
import Loader from "../Loader/Loader";
import Post from "../Post/Post";

export default function PostDetails() {
  const { id } = useParams();

  function getSinglePost() {
    return axios.get(`https://route-posts.routemisr.com/posts/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
    });
  }

  const { isLoading, data, isError } = useQuery({
    queryKey: ["getSinglePost", id],
    queryFn: getSinglePost,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen justify-center items-center flex">
        <h1 className="bg-red-900 text-white text-3xl font-bold text-center rounded-3xl w-full">
          Cannot load post...!
        </h1>
      </div>
    );
  }

  return (
    <>
      <Post post={data?.data.data.post} isPostDetails />
    </>
  );
}
