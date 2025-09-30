import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Outlet, Navigate } from "react-router-dom";
import { signOutUserSuccess } from "../redux/user/userSlice";

export default function PrivateRoute() {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await fetch("/api/auth/profile", {
          credentials: "include",
        });

        if (res.ok) {
          setIsAuth(true); // token valid
        } else {
          // Token expired or missing
          dispatch(signOutUserSuccess());
          setIsAuth(false);
        }
      } catch (err) {
        dispatch(signOutUserSuccess());
        setIsAuth(false);
      }
    };

    checkAuth(); // always check token on mount
  }, [dispatch]);

  if (isAuth === null) return <div>Loading...</div>;

  return isAuth ? <Outlet /> : <Navigate to="/sign-in" />;
}
