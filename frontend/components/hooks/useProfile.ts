import axios from "axios";
import { parseCookies } from "nookies";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const profileFetch = ({ queryKey }) => {
  const [_, accessToken] = queryKey;
  const link = `${apiHome}/users/me/`;
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

const useProfile = (options = {}) => {
  const accessToken =
    typeof window !== "undefined" ? parseCookies().accessToken : null;

  return useQuery(
    ["getProfile", accessToken],

    profileFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      enabled: Boolean(accessToken),
      ...options,
    }
  );
};

export { useProfile, profileFetch };
