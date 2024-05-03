import React, { useState } from "react";
import styled from "styled-components";
import ClipLoader from "react-spinners/ClipLoader";

interface LoadingProp {
  className?: string;
}
export const Loading: React.FC<LoadingProp> = ({
  className = "center-page",
}) => {
  const [loading, setLoading] = useState(true);

  return (
    <div className={className}>
      <SpinnerContainer>
        <ClipLoader
          color={"#212529"}
          loading={loading}
          size={150}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </SpinnerContainer>
    </div>
  );
};

const SpinnerContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;
