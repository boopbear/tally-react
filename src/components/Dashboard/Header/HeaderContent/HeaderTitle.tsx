import React from "react";
import reactLogo from "../../../../assets/tally.png";
import { Row } from "antd";
import { HeaderHeading, HeaderHeadingCol } from "./HeaderTitle.styles";
import { USER_DETAILS_LOCAL } from "../../../../constants";
import { IUser } from "../../../../interfaces/user";

const HeaderTitle: React.FC = () => {
  const heading = (fullName?: string) => {
    const welcome = `Hi, ${fullName || "User"}`;
    return (
      <Row align={"middle"}>
        <img
          src={reactLogo}
          alt="mascot_pic"
          className="img-fluid"
          style={{ width: "70px" }}
        />
        <HeaderHeadingCol
          style={{
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}
        >
          <HeaderHeading>{welcome}</HeaderHeading>
        </HeaderHeadingCol>
      </Row>
    );
  };

  try {
    const details: IUser = JSON.parse(
      localStorage.getItem(USER_DETAILS_LOCAL) || ""
    );
    return heading(details.profile?.fullName);
  } catch (e: any) {
    return heading();
  }
};

export default HeaderTitle;
