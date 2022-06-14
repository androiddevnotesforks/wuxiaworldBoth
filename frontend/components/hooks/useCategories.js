import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const categoriesFetch = () => {
  const link = `${apiHome}/categories`;
  return axios.get(link).then((response) => {
    const res = response.data;
    return res;
  });
};

const useCategories = () => {
  return useQuery(["categories_list"], categoriesFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
  });
};
export { useCategories, categoriesFetch };
