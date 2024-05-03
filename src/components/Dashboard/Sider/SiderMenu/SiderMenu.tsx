import React from "react";
import { Link, useLocation } from "react-router-dom";
import * as S from "./SiderMenu.styles";
import { sidebarNavigation, SidebarNavigationItem } from "../SidebarNavigation";
import { Menu, Tooltip } from "antd";
import { IUser } from "../../../../interfaces/user";
import { USER_DETAILS_LOCAL } from "../../../../constants";

interface SiderContentProps {
  setCollapsed: (isCollapsed: boolean) => void;
}

const sidebarNavFlat = sidebarNavigation.reduce(
  (result: SidebarNavigationItem[], current) =>
    result.concat(
      current.children && current.children.length > 0
        ? current.children
        : current
    ),
  []
);

const SiderMenu: React.FC<SiderContentProps> = ({ setCollapsed }) => {
  const location = useLocation();
  const [userLoggedIn, setUserLoggedIn] = React.useState<IUser | undefined>();

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      setUserLoggedIn(details);
    } catch (e: any) {
      console.log(e.message);
    }
  }, []);

  const currentMenuItem = sidebarNavFlat.find(
    ({ url }) => url === location.pathname
  );
  const defaultSelectedKeys = currentMenuItem ? [currentMenuItem.key] : [];

  const openedSubmenu = sidebarNavigation.find(({ children }) =>
    children?.some(({ url }) => url === location.pathname)
  );
  const defaultOpenKeys = openedSubmenu ? [openedSubmenu.key] : [];

  return (
    <S.Menu
      mode="inline"
      defaultSelectedKeys={defaultSelectedKeys}
      defaultOpenKeys={defaultOpenKeys}
      onClick={() => setCollapsed(true)}
    >
      {sidebarNavigation
        .filter((snav) => {
          if (userLoggedIn?.role !== "SUPER_ADMIN") {
            return snav.allRole;
          }
          return true;
        })
        .map((nav, i, arr) => (
          <Menu.Item
            key={nav.key}
            title=""
            icon={nav.icon}
            style={{
              fontSize: "20px",
              // ...(arr.length - 1 === i
              //   ? { bottom: "1em", position: "absolute", width: "251px" }
              //   : {}),
            }}
          >
            <Tooltip
              title={nav.subtitle}
              placement="right"
              overlayInnerStyle={{ color: "black", backgroundColor: "white" }}
            >
              <Link to={nav.url || ""} className="text-decoration-none">
                {nav.title}
              </Link>
            </Tooltip>
          </Menu.Item>
        ))}
    </S.Menu>
  );
};

export default SiderMenu;
