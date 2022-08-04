import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const reportFetch = () => {
  const link = `${apiHome}/report/public_reports/`;
  return axios
    .get(link)
    .then((response) => {
      const res = response.data;
      return res;
    })
    .catch((err) => {
      console.log(err);
    });
};
const useReports = () => {
  return useQuery(["reportInfo"], reportFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
  });
};
export { useReports, reportFetch };
