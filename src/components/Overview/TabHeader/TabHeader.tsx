import React from "react";
import * as S from "./TabHeader.styles";
import { IOverviewTabHeaderProp } from "../../../interfaces/overview";
import { UserContext } from "../../../store/userContext";

interface TabContentProps {
  tabs: IOverviewTabHeaderProp[];
}

const TabHeader: React.FC<TabContentProps> = ({ tabs }) => {
  const [activeTabContentIndex, setActiveTabContentIndex] = React.useState(0);
  const userLoggedIn = React.useContext(UserContext);

  return (
    <S.TabContainer>
      {tabs && (
        <>
          <S.TabHeader4>
            {tabs.map((tab, index) => {
              return (
                <>
                  <S.TabButton
                    key={index}
                    className={
                      activeTabContentIndex === index
                        ? "page-nav-button-active"
                        : ""
                    }
                    onClick={() => {
                      setActiveTabContentIndex(index);
                      tab.menuOnClick();
                    }}
                  >
                    {tab.name}
                  </S.TabButton>
                  {tabs.length - 1 > index && <S.TabSpan> | </S.TabSpan>}
                </>
              );
            })}
          </S.TabHeader4>
          {userLoggedIn.role === "SUPER_ADMIN" && (
            <S.TabSubHeader>
              {tabs.map((tab, index) => {
                return (
                  <>
                    {activeTabContentIndex === index && (
                      <S.TabButton
                        onClick={tab.createOnClick}
                        isSubButton={true}
                      >
                        {tab.createButtonName}
                      </S.TabButton>
                    )}
                  </>
                );
              })}
            </S.TabSubHeader>
          )}
        </>
      )}
    </S.TabContainer>
  );
};

export default TabHeader;
