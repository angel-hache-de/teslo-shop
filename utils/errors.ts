import axios from "axios";

export const getErrorMessage = (error: any): string => {
  if (axios.isAxiosError(error))
    return (error.response?.data as any).message || "";

  return error.message;
};
