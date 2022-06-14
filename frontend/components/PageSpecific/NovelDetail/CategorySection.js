import { Badge } from "@mantine/core";
import LinkText from "../../common/LinkText";
import { routes } from "../../utils/Routes";

const CategorySection = ({ categoryList }) => {
  return (
    <>
      {categoryList?.map((item) => (
        <LinkText href={`${routes.category}${item.slug}`} key={item.slug}>
          <Badge
            key={item.name}
            variant="filled"
            size="lg"
            sx={{ cursor: "pointer", margin: "2px" }}
          >
            {item.name}
          </Badge>
        </LinkText>
      ))}
    </>
  );
};

export default CategorySection;
