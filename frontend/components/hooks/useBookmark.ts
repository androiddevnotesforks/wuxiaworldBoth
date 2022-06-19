import axios from "axios";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useStore } from "../Store/Store";
import { apiHome } from "../utils/siteName";

const bookmarkFetch = ({ queryKey }) => {
  const [_, id] = queryKey;
  const link = `${apiHome}/bookmark/${id}/`;
  const cookies = typeof window !== "undefined" ? parseCookies() : null;
  if (cookies) {
    const accessToken = cookies.accessToken;
    if (accessToken) {
      return axios.get(link, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      });
    }
  }
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
  const params: any = chapSlug
    ? { novSlugChapSlug: chapSlug }
    : { novSlug: novelSlug };
  let link;
  switch (operation) {
    case "add":
      link = `${apiHome}/bookmark/`;
      params.novSlug = novelSlug;
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

const useUpdateBookmark: any = () => {
  return useMutation(["updateBookmark"], updateBookmark, {
    retry: 1,
  });
};

export { useBookmark, bookmarkFetch, useUpdateBookmark };
