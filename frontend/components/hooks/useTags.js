import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const tagsFetch = () => {
  const link = `${apiHome}/tags`;
  return axios.get(link).then((response) => {
    const res = response.data;
    return res;
  });
};
const useTags = () => {
  return useQuery(["tags_list"], tagsFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
  });
};
export { useTags, tagsFetch };
