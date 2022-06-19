import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const profileFetch = () => {
  const link = `${apiHome}/users/me/`;
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

const useProfile = (token) => {
  return useQuery(
    ["getProfile"],

    profileFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: token ? true : false,
    }
  );
};

export { useProfile, profileFetch };
