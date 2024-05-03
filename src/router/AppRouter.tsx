import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import CheckAuth from "./CheckAuth";
import Logout from "./Logout";
import { includeLoading } from "../hocs/IncludeLoading.hoc";
import DashboardLayout from "../components/Dashboard/DashboardLayout";
import AuthLayout from "../components/Auth/AuthLayout";
import Login from "../components/Auth/Login";
import Verify from "../components/Auth/VerifyOTP";
import { IUser } from "../interfaces/user";
import { USER_DETAILS_LOCAL } from "../constants";

export const DASHBOARD_PATH = "/";
export const ASSET_SCAN_PATH = "inventory/asset";

const OverviewPage = includeLoading(
  React.lazy(() => import("../components/Overview/Overview"))
);
const WarehousePage = includeLoading(
  React.lazy(() => import("../components/Warehouse/Warehouse"))
);
const InventoryPage = includeLoading(
  React.lazy(() => import("../components/Inventory/Inventory"))
);
const RequestPage = includeLoading(
  React.lazy(() => import("../components/CRequest/CRequest"))
);
const UserListPage = includeLoading(
  React.lazy(() => import("../components/CUsers/CUsers"))
);
const DepartmentListPage = includeLoading(
  React.lazy(() => import("../components/Departments/Departments"))
);
const LogsPage = includeLoading(
  React.lazy(() => import("../components/Logs/Logs"))
);
const ProfilePage = includeLoading(
  React.lazy(() => import("../components/Profile/Profile"))
);
const CFaqPage = includeLoading(
  React.lazy(() => import("../components/FAQ/CFaq"))
);
const AuthLoginPage = includeLoading(Login);
const AuthVerifyPage = includeLoading(Verify);
const AuthLogoutPage = includeLoading(Logout);

export const AppRouter: React.FC = () => {
  const protectedLayout = (
    <CheckAuth>
      <DashboardLayout />
    </CheckAuth>
  );

  return (
    <BrowserRouter>
      <Routes>
        <Route path={DASHBOARD_PATH} element={protectedLayout}>
          <Route index element={<OverviewPage />} />

          <Route path="overview" element={<OverviewPage />} />
          <Route path="warehouse" element={<WarehousePage />} />
          <Route path="asset-movement" element={<InventoryPage />} />
          <Route path={ASSET_SCAN_PATH} element={<InventoryPage />} />
          <Route path="request" element={<RequestPage />} />
          <Route path="users" element={<UserListPage />} />
          <Route path="units" element={<DepartmentListPage />} />
          <Route path="logs" element={<LogsPage />} />
          <Route path="profile" element={<ProfilePage />} />
          <Route path="faqs" element={<CFaqPage />} />
        </Route>

        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<AuthLoginPage />} />

          <Route path="login" element={<AuthLoginPage />} />
          <Route path="verify" element={<AuthVerifyPage />} />
          <Route path="logout" element={<AuthLogoutPage />} />
        </Route>

        <Route
          path="*"
          element={<Navigate to={DASHBOARD_PATH} replace={true} />}
        />
      </Routes>
    </BrowserRouter>
  );
};
