import { Empty, Row } from "antd";
import React from "react";
import * as S from "../LogsTable.styles";
import dayjs from "dayjs";
import json from "json-keys-sort";
import { ILogsProp } from "./DesktopLogsTable";
import { Loading } from "../../common/Loading";

const MobileLogsTable: React.FC<ILogsProp> = ({ data, loading }) => {
  return !loading ? (
    data && data.length ? (
      <div className="w-100 my-3 pb-3">
        {data.map((log) => {
          const entries = Object.entries(json.sort(log.details || {}, true));
          const actionItems = entries
            .filter(
              ([key]) =>
                !(
                  key.toLowerCase().includes("reason") ||
                  key.toLowerCase().includes("remark")
                )
            )
            .map(([key, value]) => (
              <li>
                {key}: {value}
              </li>
            ));
          const reasonItems = entries
            .filter(
              ([key]) =>
                key.toLowerCase().includes("reason") ||
                key.toLowerCase().includes("remark")
            )
            .map(([key, value]) => (
              <li style={{ whiteSpace: "pre-line" }}>
                {key}: {value}
              </li>
            ));

          return (
            <Row className="my-3">
              <S.LogsTableRowHeader>
                <S.LogsTableColTitle>Asset Code</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  {log.inventoryAsset != null
                    ? log.inventoryAsset?.assetCode
                    : log.assetCodeBackup != null
                    ? log.assetCodeBackup
                    : "Unknown"}
                </S.LogsTableColContent>
              </S.LogsTableRowHeader>
              <S.LogsTableRowContent>
                <S.LogsTableColTitle>User</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  {log.responsible?.profile?.fullName}
                </S.LogsTableColContent>
              </S.LogsTableRowContent>
              <S.LogsTableRowContent>
                <S.LogsTableColTitle>Category</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  {log.inventoryCategory != null
                    ? log.inventoryCategory?.name
                    : "Unknown"}
                </S.LogsTableColContent>
              </S.LogsTableRowContent>
              <S.LogsTableRowContent>
                <S.LogsTableColTitle>Timestamp</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  {log.createdAt !== undefined
                    ? dayjs(log.createdAt).format("DD/MM/YYYY h:mm A")
                    : "N/A"}
                </S.LogsTableColContent>
              </S.LogsTableRowContent>
              <S.LogsTableRowContent>
                <S.LogsTableColTitle>Details</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  <small>
                    <ul
                      className="mb-0 ps-1"
                      style={{
                        listStylePosition: "inside",
                        whiteSpace: "pre-line",
                      }}
                    >
                      {actionItems}
                    </ul>
                  </small>
                </S.LogsTableColContent>
              </S.LogsTableRowContent>
              <S.LogsTableRowContent>
                <S.LogsTableColTitle>Remarks/ Reason</S.LogsTableColTitle>
                <S.LogsTableColContent>
                  <small>
                    <ul
                      className="mb-0 ps-1"
                      style={{ listStylePosition: "inside" }}
                    >
                      {reasonItems}
                    </ul>
                  </small>
                </S.LogsTableColContent>
              </S.LogsTableRowContent>
            </Row>
          );
        })}
      </div>
    ) : (
      <Empty style={{ placeContent: "center" }} />
    )
  ) : (
    <Loading className="p-5" />
  );
};

export default MobileLogsTable;
