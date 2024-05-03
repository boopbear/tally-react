import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { googleLogout } from "@react-oauth/google";
import { BasicStatusResponse, ENDPOINTS } from "../constants";
import { client } from "../api/client";
import { Loading } from "../components/common/Loading";

const Logout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    async function clearCookie() {
      try {
        await client<BasicStatusResponse>(ENDPOINTS.user.logout).then(() =>
          navigate("/")
        );
      } catch {}
    }
    clearCookie();
    googleLogout();
  }, [navigate]);

  return <Loading />;
};

export default Logout;
