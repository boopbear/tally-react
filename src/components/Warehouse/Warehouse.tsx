import React from "react";
import {
  IOverviewTabHeaderProp,
  ISearchQueryForm,
  ISearchWarehouse,
} from "../../interfaces/overview";
import { ENDPOINTS, RES_STATUS, USER_DETAILS_LOCAL } from "../../constants";
import {
  IWarehouseCategory,
  IWarehouseItem,
  IWarehouseItemCategoriesResponse,
  IWarehouseLog,
  IWarehouseResponse,
} from "../../interfaces/warehouse";
import { client } from "../../api/client";
import { message } from "antd";
import { PageTitle } from "../common/PageTitle";
import { DEFAULT_USER_CONTEXT, UserContext } from "../../store/userContext";
import { IUser } from "../../interfaces/user";
import TabHeader from "../common/TabHeader/TabHeader";
import Supplies from "./Supplies/Supplies";
import ModalCreateSupply from "./Supplies/Modals/ModalCreateSupply";
import Requisitions from "./Requisitions/Requisitions";
import ModalCreateRequisition from "./Requisitions/Modals/ModalCreateRequisition";

export interface IWarehouseTabProp {
  query?: ISearchWarehouse;
  items?: IWarehouseItem[];
  logs?: IWarehouseLog[];
  loading?: boolean;
  itemCategories?: IWarehouseCategory[];
  onFinishSearchInput: (values?: any) => Promise<void>;
  onFinishSearchInputFailed: (errorInfo?: any) => void;
}

const Warehouse: React.FC = () => {
  const [userLoggedIn, setUserLoggedIn] =
    React.useState<IUser>(DEFAULT_USER_CONTEXT);
  const [warehouseItems, setWarehouseItems] = React.useState<IWarehouseItem[]>(
    []
  );
  const [itemCategories, setItemCategories] = React.useState<
    IWarehouseCategory[]
  >([]);
  const [warehouseLogs, setWarehouseLogs] = React.useState<IWarehouseLog[]>([]);
  const [retrievingWarehouseItems, setRetrievingWarehouseItems] =
    React.useState(false);
  const [retrievingWarehouseLogs, setRetrievingWarehouseLogs] =
    React.useState(false);

  const [isSuppliesDashboard, setIsSuppliesDashboard] = React.useState(true);
  const [querySuppliesSearch, setQuerySuppliesSearch] =
    React.useState<ISearchWarehouse>();
  const [queryLogsSearch, setQueryLogsSearch] =
    React.useState<ISearchWarehouse>();

  const [isCreateWarehouseItemOpen, setIsCreateWarehouseItemOpen] =
    React.useState(false);
  const [isCreateWarehouseTransactOpen, setIsCreateWarehouseTransactOpen] =
    React.useState(false);

  const getWarehouseItemCategories = React.useCallback(async () => {
    const endpoint = ENDPOINTS.warehouse.getItemCategories;

    try {
      const result = await client<IWarehouseItemCategoriesResponse>(endpoint);

      if (result.status !== RES_STATUS.success) {
        throw new Error(result.message);
      } else {
        setItemCategories(result.categories || []);
      }
    } catch (err: any) {
      message.error(err.message);
      console.log(err);
    }
  }, []);

  const onFinishSearchWarehouseItems = React.useCallback(
    async (query?: ISearchWarehouse) => {
      setRetrievingWarehouseItems(true);
      setQuerySuppliesSearch(query);

      const endpoint = ENDPOINTS.warehouse.getItems(
        query?.categoryFilterId || 0,
        query?.keyword,
        query?.sortBy,
        query?.active
      );

      try {
        const result = await client<IWarehouseResponse>(endpoint);

        if (result.status !== RES_STATUS.success) {
          throw new Error(result.message);
        } else {
          setWarehouseItems(result.warehouseItems || []);
          setRetrievingWarehouseItems(false);
        }
      } catch (err: any) {
        setRetrievingWarehouseItems(false);
        message.error(err.message);
        console.log(err);
      }
    },
    []
  );

  const onFinishSearchWarehouseLogs = React.useCallback(
    async (query?: ISearchQueryForm) => {
      setRetrievingWarehouseLogs(true);
      setQueryLogsSearch(query);

      const endpoint = ENDPOINTS.warehouse.getLogs(
        query?.keyword,
        query?.sortBy,
        query?.active
      );

      try {
        const result = await client<IWarehouseResponse>(endpoint);

        if (result.status !== RES_STATUS.success) {
          throw new Error(result.message);
        } else {
          setWarehouseLogs(result.warehouseLogs || []);
          setRetrievingWarehouseLogs(false);
        }
      } catch (err: any) {
        setRetrievingWarehouseLogs(false);
        message.error(err.message);
        console.log(err);
      }
    },
    []
  );

  const onFinishSearchInputFailed = (errorInfo: any) => {
    console.log(errorInfo);
    return;
  };

  React.useEffect(() => {
    try {
      const details: IUser = JSON.parse(
        localStorage.getItem(USER_DETAILS_LOCAL) || ""
      );
      setUserLoggedIn(details);
      getWarehouseItemCategories();
      onFinishSearchWarehouseItems();
    } catch (e: any) {
      console.log(e.message);
    }
  }, [getWarehouseItemCategories, onFinishSearchWarehouseItems]);

  const getWarehouseItems = () => {
    setIsSuppliesDashboard(true);
    onFinishSearchWarehouseItems();
  };

  const getWarehouseLogs = () => {
    setIsSuppliesDashboard(false);
    onFinishSearchWarehouseLogs();
  };

  const tabs: IOverviewTabHeaderProp[] = [
    {
      name: "Supplies",
      menuOnClick: getWarehouseItems,
      createButtonName: "+ Add",
      createOnClick: () => setIsCreateWarehouseItemOpen(true),
    },
    {
      name: "Requisitions",
      menuOnClick: getWarehouseLogs,
      createButtonName: "+ Add",
      createOnClick: () => setIsCreateWarehouseTransactOpen(true),
    },
  ];

  return (
    <>
      <PageTitle>Warehouse</PageTitle>
      <UserContext.Provider value={userLoggedIn}>
        <TabHeader tabs={tabs} />
      </UserContext.Provider>

      {isSuppliesDashboard ? (
        <Supplies
          query={querySuppliesSearch}
          items={warehouseItems}
          loading={retrievingWarehouseItems}
          itemCategories={itemCategories}
          onFinishSearchInput={onFinishSearchWarehouseItems}
          onFinishSearchInputFailed={onFinishSearchInputFailed}
        />
      ) : (
        <Requisitions
          query={queryLogsSearch}
          logs={warehouseLogs}
          loading={retrievingWarehouseLogs}
          onFinishSearchInput={onFinishSearchWarehouseLogs}
          onFinishSearchInputFailed={onFinishSearchInputFailed}
        />
      )}

      <ModalCreateSupply
        isModalOpen={isCreateWarehouseItemOpen}
        setModalOpen={setIsCreateWarehouseItemOpen}
        overloadOnFinish={() => {
          onFinishSearchWarehouseItems(querySuppliesSearch);
        }}
        categories={itemCategories}
      />
      <ModalCreateRequisition
        isModalOpen={isCreateWarehouseTransactOpen}
        setModalOpen={setIsCreateWarehouseTransactOpen}
        overloadOnFinish={() => {
          onFinishSearchWarehouseLogs(queryLogsSearch);
        }}
        items={warehouseItems}
      />
    </>
  );
};

export default Warehouse;
