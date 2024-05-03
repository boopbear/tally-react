import React, { useState } from "react";
import * as S from "./Dashboard.styles";
import { Outlet } from "react-router-dom";
import MainSider from "./Sider/MainSider/MainSider";
import { Header } from "./Header/Header";

const MainLayout: React.FC = () => {
  const [siderCollapsed, setSiderCollapsed] = useState(true);

  const toggleSider = () => setSiderCollapsed(!siderCollapsed);

  return (
    <S.LayoutMaster>
      <MainSider
        isCollapsed={siderCollapsed}
        setCollapsed={setSiderCollapsed}
      />
      <S.LayoutMain>
        <S.MainHeader>
          <Header toggleSider={toggleSider} isSiderOpened={!siderCollapsed} />
        </S.MainHeader>
        <S.LayoutContent>
          <div>
            <Outlet />
          </div>
        </S.LayoutContent>
      </S.LayoutMain>
    </S.LayoutMaster>
  );
};

export default MainLayout;
