import { Badge } from "@mantine/core";
import LinkText from "../../common/LinkText";
import { routes } from "../../utils/Routes";

const TagBadges = ({ tagList }) => {
  return (
    <>
      {tagList?.map((item) => (
        <LinkText key={item.id} to={`${routes.tag}${item.slug}`}>
          <Badge
            variant="dot"
            size="md"
            color="blue"
            sx={{ cursor: "pointer", margin: "2px" }}
          >
            {item.name}
          </Badge>
        </LinkText>
      ))}
    </>
  );
};
export default TagBadges;
