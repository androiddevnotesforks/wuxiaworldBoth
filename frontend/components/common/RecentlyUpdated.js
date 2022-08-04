import axios from "axios";
import { useQuery } from "react-query";
import { styled } from "@mui/material/styles";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { Text, Card, Image, Loader, Center, Title } from "@mantine/core";
import React from "react";
import { apiHome } from "../utils/siteName";
import { routes } from "../utils/Routes";
import LinkText from "./LinkText";

export const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  "&:last-child td, &:last-child th": {
    border: 0,
  },
}));
const chapterFetch = ({ queryKey }) => {
  let link = `${apiHome}/latest_chapters/`;
  const [_, tag, category] = queryKey;
  if (tag) {
    link = `${apiHome}/latest_chapters/?tag=${tag}`;
  }
  if (category) {
    link = `${apiHome}/latest_chapters/?category=${category}`;
  }

  return axios.get(link).then((response) => {
    const res = response.data;
    return res;
  });
};
const RecentlyUpdated = ({ tag, category }) => {
  const { isLoading, error, data } = useQuery(
    ["latest_chapters", tag, category],
    chapterFetch,
    {
      refetchOnWindowFocus: true,
      retry: 2,
    }
  );
  return (
    <Card>
      <Center sx={{ marginTop: "10px", marginBottom: "10px" }}>
        <Title>Latest Chapter Releases</Title>
      </Center>
      <TableContainer>
        <Table sx={{ minWidth: 300 }} aria-label="customized table">
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell>
                <Text>Novel Name</Text>
              </TableCell>
              <TableCell>
                <Text>Title</Text>
              </TableCell>

              <TableCell>
                <Text>Added Time</Text>
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {data?.map((chapter) => (
              <StyledTableRow key={chapter.slug}>
                <TableCell component="th" scope="row">
                  <Image
                    radius="md"
                    src={
                      chapter?.novel_thumb
                        ? `${chapter?.novel_thumb?.replace(
                            "https://wuxiaworld.fra1.cdn.digitaloceanspaces.com/",
                            "https://ik.imagekit.io/opyvhypp7cj/"
                          )}?tr=w-80`
                        : ""
                    }
                    alt={chapter.novel_name}
                    width={50}
                    height={80}
                    fit="contain"
                    imageProps={{ loading: "lazy" }}
                    withPlaceholder
                  />
                </TableCell>
                <TableCell component="th" scope="row">
                  <LinkText href={`${routes.novel}${chapter.novelParent}`}>
                    <Text variant="link">{chapter.novel_name || "N/A"}</Text>
                  </LinkText>
                </TableCell>
                <TableCell component="th" scope="row">
                  <LinkText
                    href={`${routes.chapter}${chapter.novSlugChapSlug}`}
                  >
                    <Text>{chapter.title || "N/A"}</Text>
                  </LinkText>
                </TableCell>
                <TableCell>
                  <Text>{chapter.created_at}</Text>
                </TableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      {isLoading && (
        <Center>
          <Loader style={{ margin: "10px" }} />
        </Center>
      )}
    </Card>
  );
};
export default React.memo(RecentlyUpdated);
