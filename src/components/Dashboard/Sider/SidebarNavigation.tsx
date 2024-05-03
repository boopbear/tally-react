import React from "react";
import {
  NotificationFilled,
  AppstoreFilled,
  DatabaseFilled,
  FolderAddFilled,
  TeamOutlined,
  BankFilled,
  FileTextFilled,
  ProfileFilled,
  QuestionCircleOutlined,
  LogoutOutlined,
} from "@ant-design/icons";

export interface SidebarNavigationItem {
  title: string;
  subtitle?: string;
  key: string;
  url?: string;
  children?: SidebarNavigationItem[];
  icon?: React.ReactNode;
  allRole: boolean;
}

export const sidebarNavigation: SidebarNavigationItem[] = [
  {
    title: "Overview",
    key: "overview",
    url: "/overview",
    icon: <NotificationFilled className="menu-icons" />,
    allRole: true,
  },
  {
    title: "Warehouse",
    key: "warehouse",
    url: "/warehouse",
    icon: <AppstoreFilled className="menu-icons" />,
    allRole: false,
  },
  {
    title: "Asset Movement",
    key: "asset-movement",
    url: "/asset-movement",
    icon: <DatabaseFilled className="menu-icons" />,
    allRole: true,
  },
  {
    title: "Request",
    subtitle: "Request from Stakeholders",
    key: "request",
    url: "/request",
    icon: <FolderAddFilled className="menu-icons" />,
    allRole: true,
  },
  {
    title: "Users",
    key: "users",
    url: "/users",
    icon: <TeamOutlined className="menu-icons" />,
    allRole: false,
  },
  {
    title: "Units",
    key: "units",
    url: "/units",
    icon: <BankFilled className="menu-icons" />,
    allRole: false,
  },
  {
    title: "Asset Logs",
    key: "logs",
    url: "/logs",
    icon: <FileTextFilled className="menu-icons" />,
    allRole: false,
  },
  {
    title: "Profile",
    key: "profile",
    url: "/profile",
    icon: <ProfileFilled className="menu-icons" />,
    allRole: true,
  },
  {
    title: "FAQs",
    key: "faqs",
    url: "/faqs",
    icon: <QuestionCircleOutlined className="menu-icons" />,
    allRole: true,
  },
  {
    title: "Logout",
    key: "logout",
    url: "/auth/logout",
    icon: <LogoutOutlined className="menu-icons" />,
    allRole: true,
  },
];
