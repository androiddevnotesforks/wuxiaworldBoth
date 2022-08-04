import { Text } from "@mantine/core";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import LinkText from "../../common/LinkText";
import { StyledTableRow } from "../../common/RecentlyUpdated";
import { routes } from "../../utils/Routes";

const ChapterReportTable = ({ data }) => {
  const get_status_full = (status) => {
    switch (status) {
      case "PD":
        return "Pending";
      case "AP":
        return "Approved";
      case "RJ":
        return "Rejected";
      case "AC":
        return "Approved and Closed";
      case "II":
        return "Incomplete Info Provided";
      default:
        return "N/A";
    }
  };
  return (
    <TableContainer>
      <Table sx={{ minWidth: 300 }} aria-label="customized table">
        <TableHead>
          <TableRow>
            <TableCell>
              <Text>Novel Name</Text>
            </TableCell>
            <TableCell>
              <Text>Chapter Name</Text>
            </TableCell>
            <TableCell>
              <Text>Error Description</Text>
            </TableCell>
            <TableCell>
              <Text>Status</Text>
            </TableCell>
            <TableCell>
              <Text>Reason</Text>
            </TableCell>

            <TableCell>
              <Text>Requested At</Text>
            </TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {data?.map((report) => (
            <StyledTableRow key={report?.id}>
              <TableCell component="th" scope="row">
                <LinkText href={`${routes.novel}${report?.novel?.slug}`}>
                  <Text variant="link">{report?.novel?.name || "N/A"}</Text>
                </LinkText>
              </TableCell>
              <TableCell component="th" scope="row">
                <LinkText
                  href={`${routes.chapter}${report?.chapter?.novSlugChapSlug}`}
                >
                  <Text variant="link">{report?.chapter?.title || "N/A"}</Text>
                </LinkText>
              </TableCell>

              <TableCell component="th" scope="row">
                <Text>{report?.description || "N/A"}</Text>
              </TableCell>

              <TableCell component="th" scope="row">
                <Text>{get_status_full(report?.status)}</Text>
              </TableCell>
              <TableCell component="th" scope="row">
                <Text>{report?.reason || "N/A"}</Text>
              </TableCell>
              <TableCell component="th" scope="row">
                <Text>{new Date(report.created_at).toLocaleString()}</Text>
              </TableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default ChapterReportTable;
