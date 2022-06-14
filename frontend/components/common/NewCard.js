import { Card } from "@mantine/core";

const NewCard = (props) => {
  return (
    <Card
      sx={(theme) => ({
        backgroundColor:
          theme.colorScheme == "light"
            ? theme.colors.gray[3]
            : theme.colors.dark[6],
      })}
      {...props}
    >
      {props.children}
    </Card>
  );
};
export default NewCard;
