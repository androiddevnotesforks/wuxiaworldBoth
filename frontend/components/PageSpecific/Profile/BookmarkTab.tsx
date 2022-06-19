import { Table, Text, Badge } from "@mantine/core";
import { useQuery } from "react-query";
import axios from "axios";
import { useMediaQuery } from "@mantine/hooks";
import { Skeleton } from "@mui/material";
import { routes } from "../../utils/Routes";
import { apiHome } from "../../utils/siteName";
import { useEffect } from "react";
import ReactGA from "react-ga4";
import { useStore } from "../../Store/Store";
import LinkText from "../../common/LinkText";
import TabBase from "./TabBase";

const BookmarkTab = () => {
  const verySmall = useMediaQuery("(max-width: 500px)");
  const userInfo = useStore((state) => state.userInfo);

  const bookmarkFetch = () => {
    const link = `${apiHome}/bookmark/`;
    return axios.get(link).then((response) => response.data);
  };
  const { data, isLoading, error, refetch } = useQuery(
    ["getBookmark"],
    bookmarkFetch,
    {
      refetchOnWindowFocus: false,
      retry: 1,
    }
  );
  const removeBookmark = (id) => {
    const link = `${apiHome}/bookmark/${id}/`;
    axios
      .delete(link)
      .then((response) => {
        // toast.info("Bookmark Removed");
        return response.data;
      })
      .catch((err) => {
        // toast.error("Couldn't remove bookmark");
      });
  };
  useEffect(() => {
    ReactGA.event({
      category: `Profile View`,
      label: `Bookmark Tab`,
      action: "Viewed Bookmark",
    });
  }, []);
  return (
    <TabBase title="Your Saved Bookmarks">
      <Table striped highlightOnHover style={{ marginTop: "40px" }}>
        <thead>
          <tr>
            <th>Novel</th>
            <th>You Last Read</th>
            <th>Next Chapter</th>
            {!verySmall && <th>Latest Chapter</th>}
          </tr>
        </thead>
        <tbody>
          {data &&
            data?.map((element) => (
              <tr key={element.id}>
                <td>
                  <LinkText href={`${routes.novel}${element.novelInfo.slug}`}>
                    <Text>{element.novelInfo.name}</Text>
                  </LinkText>
                </td>
                <td>
                  {element.last_read ? (
                    <LinkText
                      href={`${routes.chapter}${element.last_read.novSlugChapSlug}`}
                    >
                      <Text>{element.last_read.title}</Text>
                    </LinkText>
                  ) : (
                    <Text>No Chapters</Text>
                  )}
                </td>

                <td>
                  {element.next_chapter ? (
                    <LinkText
                      href={`${routes.chapter}${element.next_chapter.novSlugChapSlug}`}
                    >
                      <Text>{element.next_chapter.title}</Text>
                    </LinkText>
                  ) : element.last_read ? (
                    <Text>You're Caught Up</Text>
                  ) : (
                    <Text>No Chapters</Text>
                  )}
                </td>
                {!verySmall && (
                  <td>
                    {element.last_chapter ? (
                      <LinkText
                        href={`${routes.chapter}${element.last_chapter.novSlugChapSlug}`}
                      >
                        <Text>{element.last_chapter.title}</Text>
                      </LinkText>
                    ) : element.last_read ? (
                      <Text>You're Caught Up</Text>
                    ) : (
                      <Text>No Chapters</Text>
                    )}
                  </td>
                )}
                <td>
                  {element.novelInfo && element.novelInfo.slug ? (
                    <Badge
                      radius="xl"
                      size="sm"
                      onClick={() => {
                        removeBookmark(element.novelInfo.slug);
                        refetch();
                        ReactGA.event({
                          category: `Bookmark Tab`,
                          label: `Remove Bookmark`,
                          action: `${userInfo?.user?.first_name} removed ${element.novelInfo.name}`,
                        });
                      }}
                    >
                      X
                    </Badge>
                  ) : null}
                </td>
              </tr>
            ))}
          {isLoading &&
            Array.from(new Array(4)).map((element) => {
              return (
                <tr>
                  {Array.from(new Array(verySmall ? 3 : 4)).map((element) => {
                    return (
                      <td>
                        <Skeleton>
                          <Text>Lorem Ipsum </Text>
                        </Skeleton>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
        </tbody>
      </Table>
    </TabBase>
  );
};

export default BookmarkTab;
