import axios from "axios";
import { useQuery } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { apiHome } from "../utils/siteName";

const chapterFetch = ({ queryKey }) => {
  const [_, id] = queryKey;

  return axios
    .get(`${apiHome}/chapters/${id}/`, {})
    .then((response) => {
      const res = response.data;
      return res;
    })
    .catch((error) => error);
};
const useChapters = (id) => {
  const notifications = useNotifications();
  let errorMessage =
    "No chapters found for this novel, please check again later or add a comment below";
  let errorTitle = "No Chapters Found";

  return useQuery(["chapters", id], chapterFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: 1000000,
    onError: () => {
      const notifId = notifications.showNotification({
        title: errorTitle,
        message: errorMessage,
        autoClose: 10000,
      });
    },
    onSuccess: (data) => {
      if (!data.length) {
        const notifId = notifications.showNotification({
          title: errorTitle,
          message: errorMessage,
          autoClose: 10000,
        });
      }
    },
  });
};

export { useChapters, chapterFetch };
