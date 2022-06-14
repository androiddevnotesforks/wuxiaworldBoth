import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const chapterFetch = ({ queryKey }) => {
  const [_, chapSlug] = queryKey;

  const headers = { "Content-Type": "application/json" };
  const response = axios
    .get(`${apiHome}/getchapter/${chapSlug}/`, {
      headers: headers,
    })
    .then((res) => {
      return res.data;
    })
    .catch((error) => {
      console.error(error);
    });
  return response;
};

const useChapter = (chapterSlug) => {
  return useQuery(
    ["chapterFetch", chapterSlug],

    chapterFetch,
    {
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    }
  );
};
export { useChapter, chapterFetch };
