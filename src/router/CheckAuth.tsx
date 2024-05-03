import React from "react";
import { Navigate } from "react-router-dom";
import { WithChildrenProps } from "../types/generalTypes";
import { client } from "../api/client";
import { BasicStatusResponse, ENDPOINTS, RES_STATUS } from "../constants";
import { Loading } from "../components/common/Loading";

const RequireAuth: React.FC<WithChildrenProps> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    async function checkLogin() {
      try {
        const result = await client<BasicStatusResponse>(ENDPOINTS.idleChecker);

        if (result.status === RES_STATUS.success) {
          setIsLoggedIn(true);
          setIsLoading(false);
        } else {
          throw new Error("failed");
        }
      } catch {
        setIsLoggedIn(false);
        setIsLoading(false);
      }
    }
    checkLogin();
  }, []);

  if (isLoading) {
    return <Loading />;
  }
  
  return isLoggedIn ? <>{children}</> : <Navigate to="/auth/login" replace />;
};

export default RequireAuth;
