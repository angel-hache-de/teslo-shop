import { createContext } from "react";
import { IUser } from "../../interfaces";
import { RegisterUserReturn } from "./AuthProvider";

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;

  //   methods
  loginUser: (email: string, password: string) => Promise<boolean>;
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<RegisterUserReturn>;
  logout: () => void;
}

export const AuthContext = createContext({} as ContextProps);
