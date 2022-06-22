import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const settingsFetch = ({ queryKey }) => {
  const [_, accessToken] = queryKey;

  const link = `${apiHome}/settings/me/`;
  if (accessToken) {
    return axios
      .get(link, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      })
      .then((res) => res.data);
  }
  return axios.get(link).then((response) => response.data);
};

const useSettings = (options = {}) => {
  const accessToken =
    typeof window !== "undefined" ? parseCookies().accessToken : null;

  return useQuery(
    ["getSettings", accessToken],

    settingsFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: Boolean(accessToken),
      ...options,
    }
  );
};

export { useSettings, settingsFetch };
