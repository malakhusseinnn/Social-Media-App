import axios from "axios";
import React, { useEffect } from "react";
import Post from "../Post/Post";
import Loader from "../Loader/Loader";
import { useQuery } from "@tanstack/react-query";
import PostCreation from "../PostCreation/PostCreation";
import { Helmet } from "react-helmet";

export default function Home() {
  function getAllPosts() {
    return axios.get(`https://route-posts.routemisr.com/posts`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("userToken")}`,
      },
      params: { sort: "-createdAt" },
    });
  }

  useEffect(() => {
    getAllPosts();
  }, []);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["getAllPosts"],
    queryFn: getAllPosts,
  });

  if (isLoading) {
    return <Loader />;
  }

  if (isError) {
    return (
      <div className="min-h-screen justify-center items-center flex">
        <h1 className="bg-red-900 text-white text-3xl font-bold text-center rounded-3xl w-full">
          Cannot load posts...!
        </h1>
      </div>
    );
  }

  const allPosts = data.data.data.posts;

  return (
    <>
      <Helmet>
        <title>Home</title>
      </Helmet>
      <PostCreation />
      {allPosts?.map((post) => (
        <Post key={post.id} post={post} />
      ))}
    </>
  );
}
