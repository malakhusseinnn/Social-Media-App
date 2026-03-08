import React from "react";
import { RotatingLines } from "react-loader-spinner";

export default function Loader() {
  return (
    <div className="flex justify-center min-h-screen items-center">
      <RotatingLines
        visible={true}
        width="96"
        color="#09c"
        strokeWidth="5"
        animationDuration="0.75"
        ariaLabel="rotating-lines-loading"
        wrapperStyle={{}}
        wrapperClass=""
      />
    </div>
  );
}
