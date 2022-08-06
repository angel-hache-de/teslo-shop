import { FC, useEffect, useReducer } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/router";
import Cookies from "js-cookie";
import axios from "axios";

import { tesloApi } from "../../api";
import { IUser } from "../../interfaces";
import { AuthContext, authReducer } from "./";
import { cookies } from "../../utils";

export interface AuthState {
  isLoggedIn: boolean;
  user?: IUser;
}

export interface RegisterUserReturn {
  hasError: boolean;
  message?: string;
}

const AUTH_INITIAL_STATE: AuthState = {
  isLoggedIn: false,
  user: undefined,
};

interface AuthProviderProps {
  children: JSX.Element;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const { data, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated")
      dispatch({ type: "Auth - Login", payload: data?.user as IUser });
  }, [status, data]);

  // Custom auth
  // useEffect(() => {
  //   const checkToken = async () => {
  //     try {
  //       const { data } = await tesloApi.get("/user/validate-token");
  //       const { token, user } = data;
  //       Cookies.set("token", token);
  //       dispatch({ type: "Auth - Login", payload: user });
  //     } catch (error) {
  //       Cookies.remove("token");
  //     }
  //   };

  //   if (Cookies.get("token")) checkToken();
  // }, []);

  const loginUser = async (
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post("/user/login", { email, password });
      const { token, user } = data;

      Cookies.set("token", token);

      dispatch({ type: "Auth - Login", payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<RegisterUserReturn> => {
    try {
      const { data } = await tesloApi.post("/user/signup", {
        name,
        email,
        password,
      });

      const { token, user } = data;

      Cookies.set("token", token);
      dispatch({ type: "Auth - Login", payload: user });

      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error))
        return {
          hasError: true,
          message: (error.response as any).data.message,
        };
      return {
        hasError: true,
        message: "The user was not created, try again.",
      };
    }
  };

  const logout = () => {
    // Cookies.remove("token");
    // router.reload();
    Cookies.remove("cart");
    cookies.removeAddressFromCookies();
    signOut();
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,

        // methods
        loginUser,
        registerUser,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
