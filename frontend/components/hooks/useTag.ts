import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const tagFetch = ({ queryKey }) => {
  const [_, slug, page, orderBy] = queryKey;
  let link = `${apiHome}/novels/?tag_name=${slug}&limit=12&offset=${
    ((page || 1) - 1) * 12
  }`;
  if (orderBy) {
    link = link + `&order=${orderBy}`;
  }
  const results = axios.get(link).then((res) => {
    const novels = res.data;
    return novels;
  });
  return results;
};
const useTag = ({ slug, page, orderBy }) => {
  return useQuery(["tagNovels", slug, page, orderBy], tagFetch, {
    refetchOnWindowFocus: false,
    staleTime: Infinity,
  });
};
export { useTag, tagFetch };
