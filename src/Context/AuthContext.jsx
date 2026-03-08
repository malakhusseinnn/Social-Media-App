import { createContext, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
export const AuthContext = createContext();

export default function AuthContextProvider({ children }) {
  const [userToken, setUserToken] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userPhoto, setUserPhoto] = useState(null);
  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      setUserToken(localStorage.getItem("userToken"));
    }
  }, []);

  useEffect(() => {
    if (localStorage.getItem("userToken")) {
      const { user } = jwtDecode(localStorage.getItem("userToken"));
      setUserId(user);
    }
  }, [userToken]);

  useEffect(() => {
    if (userToken && userId) {
      getUserProfilePhoto();
    }
  }, [userToken, userId]);

  function getUserProfilePhoto() {
    axios
      .get(`https://route-posts.routemisr.com/users/profile-data`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("userToken")}`,
        },
      })
      .then((res) => {
        setUserPhoto(res.data.data.user.photo);
      });
  }

  return (
    <>
      <AuthContext.Provider
        value={{ userToken, setUserToken, userId, userPhoto , setUserPhoto}}
      >
        {children}
      </AuthContext.Provider>
    </>
  );
}
