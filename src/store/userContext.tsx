import React from "react";
import { IUser } from "../interfaces/user";

// interface IUserContext {
//   userLoggedIn?: IUser;
//   setUserLoggedIn: (userLoggedIn?: IUser) => void;
// }

// const DEFAULT_USER_CONTEXT: IUserContext = {
//   userLoggedIn: { id: 0 },
//   setUserLoggedIn: (userLoggedIn?: IUser) => {},
// };
const DEFAULT_USER_CONTEXT: IUser = { id: 0 };

const UserContext = React.createContext(DEFAULT_USER_CONTEXT);

export { DEFAULT_USER_CONTEXT, UserContext };
