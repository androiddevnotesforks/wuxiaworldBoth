import { useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { ActionIcon, Button } from "@mantine/core";
import ReactGA from "react-ga4";
import React, { useEffect, useState } from "react";
import { routes } from "../../utils/Routes.js";
import { useStore } from "../../Store/Store";
import LinkText from "../../common/LinkText.js";
import { useBookmark, useUpdateBookmark } from "../../hooks/useBookmark";

const BookmarkButton = ({ novelData, id, desktop }) => {
  const notifications = useNotifications();
  const loggedIn = useStore((state) => state.accessToken);

  const queryClient = useQueryClient();

  const { data, isLoading, error } = useBookmark(id);
  const [bookmarked, setBookmarked] = useState(false);

  useEffect(() => {
    if (data?.data?.created_at) {
      setBookmarked(true);
    }
  }, [data]);
  const {
    data: updateBookmarkData,
    isLoading: updateBookmarkLoading,
    error: updateBookmarkError,
    mutate,
  } = useUpdateBookmark();

  const addNovelBookmark = () => {
    if (!loggedIn) {
      ReactGA.event({
        category: "Novel Bookmark",
        action: "Unsuccessful Bookmark",
        label: `Tried Bookmarking without logging in ${novelData?.name}`,
      });
      notifications.showNotification({
        title: `Please Login First`,
        message: `Please login first before adding bookmarks`,
        autoClose: 10000,
      });
    } else {
      ReactGA.event({
        category: "Novel Bookmark",
        action: "New Bookmark",
        label: `${novelData?.name}`,
      });
      const notifId = notifications.showNotification({
        title: `Adding to Bookmarks `,
        message: `Adding ${novelData?.name} to Bookmarks, please wait`,
        loading: true,
        autoClose: false,
        disallowClose: true,
      });
      mutate(
        { operation: "add", novelSlug: id },
        {
          onError: () => {
            notifications.updateNotification(notifId, {
              id: notifId,
              loading: false,
              autoClose: 2000,
              title: `Failed`,
              message: `Failed to add ${novelData?.name} to Bookmarks due to an error. Please try refreshing`,
              icon: <ActionIcon>X</ActionIcon>,
            });
          },
          onSuccess: () => {
            setBookmarked(true);

            queryClient.invalidateQueries(["getBookmark"]);
            queryClient.refetchQueries(["getBookmark", id]);
            notifications.updateNotification(notifId, {
              id: notifId,
              loading: false,
              autoClose: 2000,
              title: `Added`,
              message: `Sucessfully added ${novelData?.name} to Bookmarks`,
              icon: <ActionIcon>✓</ActionIcon>,
            });
          },
        }
      );
    }
  };

  const removeNovelBookmark = () => {
    ReactGA.event({
      category: "Novel Bookmark",
      action: "Removed Bookmark",
      label: `${novelData?.name}`,
    });
    const notifId = notifications.showNotification({
      title: `Removing From Bookmarks `,
      message: `Removing ${novelData?.name} from Bookmarks, please wait`,
      loading: true,
      autoClose: false,
      disallowClose: true,
    });
    mutate(
      { operation: "remove", novelSlug: id },
      {
        onError: () => {
          notifications.updateNotification(notifId, {
            id: notifId,
            loading: false,
            autoClose: 2000,
            title: `Failed`,
            message: `Failed to add ${novelData?.name} to Bookmarks due to an error. Please try refreshing`,
            icon: <ActionIcon>X</ActionIcon>,
          });
        },
        onSuccess: () => {
          setBookmarked(false);

          queryClient.invalidateQueries(["getBookmark"]);
          queryClient.refetchQueries(["getBookmark", id]);
          notifications.updateNotification(notifId, {
            id: notifId,
            loading: false,
            autoClose: 2000,
            title: `Removed`,
            message: `Sucessfully removed ${novelData?.name} from Bookmarks`,
            icon: <ActionIcon>✓</ActionIcon>,
          });
        },
      }
    );
  };
  return (
    <>
      {bookmarked ? (
        <Button
          compact={!desktop}
          size="xl"
          radius={!desktop && 100}
          onClick={removeNovelBookmark}
          sx={{ fontSize: desktop ? "20px" : "20px" }}
        >
          ♥{desktop && " Remove Bookmark"}
        </Button>
      ) : (
        <Button
          compact={!desktop}
          size="xl"
          radius={!desktop && 100}
          onClick={addNovelBookmark}
          sx={{ fontSize: desktop ? "20px" : "20px" }}
        >
          ♡{desktop && " Bookmark"}
        </Button>
      )}
      {loggedIn && bookmarked && data?.next_chapter && desktop && (
        <LinkText
          href={
            data?.next_chapter &&
            `${routes.chapter}${data?.next_chapter?.novSlugChapSlug}`
          }
        >
          <Button size="lg" radius="md" fullWidth>
            Continue From Last Read
          </Button>
        </LinkText>
      )}
    </>
  );
};
export default React.memo(BookmarkButton);
