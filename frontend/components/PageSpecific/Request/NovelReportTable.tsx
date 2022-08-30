import { Button, Group, Image, Text } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useState } from "react";
import LinkText from "../../common/LinkText";
import { StyledTableRow } from "../../common/RecentlyUpdated";
import { routes } from "../../utils/Routes";

const NovelReportTable = ({ data, showReason, showActioned }) => {
  const [showCount, setShowCount] = useState(5);

  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Text>Image</Text>
            </TableCell>
            <TableCell>
              <Text>Novel Name</Text>
            </TableCell>
            <TableCell>
              <Text>Request Count</Text>
            </TableCell>
            {showReason && (
              <TableCell>
                <Text>Reason</Text>
              </TableCell>
            )}

            <TableCell>
              <Text>Requested At</Text>
            </TableCell>
            {showActioned && (
              <TableCell>
                <Text>Actioned At</Text>
              </TableCell>
            )}
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.slice(0, showCount)?.map((report) => (
            <StyledTableRow key={report?.id}>
              <TableCell component="th" scope="row">
                <Image
                  radius="md"
                  src={
                    report?.novel?.image
                      ? `${report?.novel?.image?.replace(
                          "https://wuxiaworld.fra1.cdn.digitaloceanspaces.com/",
                          "https://ik.imagekit.io/opyvhypp7cj/"
                        )}?tr=w-80`
                      : ""
                  }
                  alt={report?.novel?.slug}
                  width={50}
                  height={80}
                  fit="contain"
                  imageProps={{ loading: "lazy" }}
                  withPlaceholder
                />
              </TableCell>
              <TableCell component="th" scope="row">
                <LinkText href={`${routes.novel}${report?.novel?.slug}`}>
                  <Text variant="link">{report?.novel?.name || "N/A"}</Text>
                </LinkText>
              </TableCell>
              <TableCell component="th" scope="row">
                <Text>{report?.request_count || 1}</Text>
              </TableCell>
              {showReason && (
                <TableCell component="th" scope="row">
                  <Text>{report?.reason || "N/A"}</Text>
                </TableCell>
              )}
              <TableCell component="th" scope="row">
                <Text>{new Date(report.created_at).toLocaleString()}</Text>
              </TableCell>
              {showActioned && (
                <TableCell component="th" scope="row">
                  <Text>{new Date(report.updated_at).toLocaleString()}</Text>
                </TableCell>
              )}
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
      {data?.length > showCount && (
        <Group position="center">
          <Button onClick={() => setShowCount(showCount + 10)}>
            Show More
          </Button>
        </Group>
      )}
    </TableContainer>
  );
};
export default NovelReportTable;
