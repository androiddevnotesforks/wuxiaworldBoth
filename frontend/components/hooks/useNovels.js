import axios from "axios";
import { useQuery } from "react-query";

const apiHome = process.env.NEXT_PUBLIC_API_HOME;

const novelsFetch = () => {
  const link = `${apiHome}/home_view/`;
  return axios.get(link).then((response) => {
    const res = response.data;
    return res;
  });
};
const useNovels = () => {
  return useQuery(["home_view"], novelsFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
  });
};
export { useNovels, novelsFetch };
