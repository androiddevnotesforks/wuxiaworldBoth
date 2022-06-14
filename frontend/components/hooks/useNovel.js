import { useNotifications } from "@mantine/notifications";
import axios from "axios";
import { useQuery } from "react-query";
import { apiHome } from "../utils/siteName";

const novelInfoFetch = ({ queryKey }) => {
  const [_, id] = queryKey;
  const link = `${apiHome}/novels/${id}/`;
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
const useNovel = (slug) => {
  const notifications = useNotifications();

  let errorMessage =
    "Novel not found, it might have been moved or deleted. Please refresh and if that doesn't work, try logging out then back in";
  let errorTitle = "No Chapters Found";
  return useQuery(["novelInfo", slug], novelInfoFetch, {
    refetchOnWindowFocus: false,
    retry: 2,
    staleTime: Infinity,
    onError: (error) => {
      const notifId = notifications.showNotification({
        title: errorTitle,
        message: errorMessage,
        autoClose: 10000,
      });
    },
  });
};
export { useNovel, novelInfoFetch };
