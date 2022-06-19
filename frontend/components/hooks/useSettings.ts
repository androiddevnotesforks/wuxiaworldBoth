import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const settingsFetch = () => {
  const link = `${apiHome}/settings/me/`;
  const cookies = typeof window !== "undefined" ? parseCookies() : null;
  const accessToken = cookies.accessToken;
  if (accessToken) {
    return axios
      .get(link, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      })
      .then((res) => res.data);
  }
};

const useSettings = (token) => {
  return useQuery(
    ["getSettings"],

    settingsFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: token ? true : false,
    }
  );
};

export { useSettings, settingsFetch };
