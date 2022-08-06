import Cookies from "js-cookie";

import { IShippingAddress } from "../interfaces";

export const getAddressFromCookies = (): IShippingAddress => {
  return {
    address: Cookies.get("address") || "",
    address2: Cookies.get("address2") || "",
    city: Cookies.get("city") || "",
    country: Cookies.get("country") || "",
    firstName: Cookies.get("firstName") || "",
    lastName: Cookies.get("lastName") || "",
    phone: Cookies.get("phone") || "",
    zip: Cookies.get("zip") || "",
  };
};

export const setAddressInCookies = (address: IShippingAddress) => {
  Cookies.set("address", address.address);
  Cookies.set("address2", address.address2 || "");
  Cookies.set("city", address.city);
  Cookies.set("country", address.country);
  Cookies.set("firstName", address.firstName);
  Cookies.set("lastName", address.lastName);
  Cookies.set("phone", address.phone);
  Cookies.set("zip", address.zip);
};

export const removeAddressFromCookies = () => {
  Cookies.remove("address");
  Cookies.remove("address2");
  Cookies.remove("city");
  Cookies.remove("country");
  Cookies.remove("firstName");
  Cookies.remove("lastName");
  Cookies.remove("phone");
  Cookies.remove("zip");
};
