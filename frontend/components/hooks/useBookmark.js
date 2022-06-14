import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiHome } from "../utils/siteName";

const bookmarkFetch = ({ queryKey }) => {
  const [_, id] = queryKey;
  const link = `${apiHome}/bookmark/${id}/`;
  return axios.get(link).then((response) => response.data);
};

const useBookmark = (id) => {
  return useQuery(
    ["getBookmark", id],

    bookmarkFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
    }
  );
};

const updateBookmark = ({ operation, novelSlug, chapSlug }) => {
  const params = chapSlug
    ? { novSlugChapSlug: chapSlug }
    : { novSlug: novelSlug };
  let link;
  switch (operation) {
    case "add":
      link = `${apiHome}/bookmark/`;

      return axios.post(link, params).then((response) => {
        const res = response.data;
        return res;
      });
    case "remove":
      link = `${apiHome}/bookmark/${novelSlug}`;

      return axios.delete(link, params).then((response) => {
        const res = response.data;
        return res;
      });
  }
};

const useUpdateBookmark = () => {
  return useMutation(
    updateBookmark,
    ["updateBookmark"],

    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
};

export { useBookmark, bookmarkFetch, useUpdateBookmark };
