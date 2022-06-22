import axios from "axios";
import { parseCookies } from "nookies";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { apiHome } from "../utils/siteName";

const bookmarkFetch = ({ queryKey }) => {
  const [_, id, accessToken] = queryKey;
  const link = `${apiHome}/bookmark/${id}/`;
  if (accessToken) {
    return axios
      .get(link, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      })
      .then((response) => response.data);
  }
  return axios.get(link).then((response) => response.data);
};

const bookmarksFetch = ({ queryKey }) => {
  const [_, accessToken] = queryKey;
  const link = `${apiHome}/bookmark/`;
  const token = accessToken;
  if (token) {
    return axios
      .get(link, {
        headers: {
          Authorization: `Token ${accessToken}`,
        },
      })
      .then((response) => response.data);
  }
  return axios.get(link).then((response) => response.data);
};
const useBookmark = ({ id }, options) => {
  const accessToken =
    typeof window !== "undefined" ? parseCookies().accessToken : null;

  return useQuery(
    ["getBookmark", id, accessToken],

    bookmarkFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      ...options,
    }
  );
};

const useBookmarks = (options) => {
  const accessToken =
    typeof window !== "undefined" ? parseCookies().accessToken : null;
  return useQuery(
    ["getBookmarks", accessToken],

    bookmarksFetch,
    {
      refetchOnWindowFocus: false,
      retry: 0,
      ...options,
    }
  );
};

const updateBookmark = ({ operation, novelSlug = null, chapSlug }) => {
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

const useUpdateBookmark = () => {
  return useMutation(["updateBookmark"], updateBookmark, {
    retry: 1,
  });
};

export {
  useBookmark,
  useBookmarks,
  bookmarksFetch,
  bookmarkFetch,
  useUpdateBookmark,
  updateBookmark,
};
