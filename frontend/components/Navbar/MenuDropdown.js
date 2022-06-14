import { ActionIcon, Group, Menu, MenuItem, Title } from "@mantine/core";
import FormatListBulletedIcon from "@mui/icons-material/FormatListBulleted";
import { useHistory } from "react-router";
import React, { useState } from "react";
const MenuDropdown = ({ title, items }) => {
  const history = useHistory();
  const [openPop, setOpenPop] = useState(false);

  return (
    <Group
      onMouseEnter={() => setOpenPop(true)}
      onMouseLeave={() => setOpenPop(false)}
      position="left"
    >
      <Title variant="link" order={5}>
        {title}
      </Title>
      <Menu
        withArrow={true}
        trigger="hover"
        delay={300}
        closeOnScroll={false}
        opened={openPop}
        position="bottom"
        zIndex={10}
        control={
          <ActionIcon>
            <FormatListBulletedIcon fontSize="medium" />
          </ActionIcon>
        }
      >
        {items.map((item) =>
          item.directLink ? (
            <MenuItem key={item.name}>
              <a href={item.directLink}>
                <Title order={6}>{item.name}</Title>
              </a>
            </MenuItem>
          ) : (
            <MenuItem onClick={() => history.push(item.link)}>
              {item.name}
            </MenuItem>
          )
        )}
      </Menu>
    </Group>
  );
};

export default React.memo(MenuDropdown);
