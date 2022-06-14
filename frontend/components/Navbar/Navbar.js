import React, { lazy, Suspense, useEffect } from "react";
import { useState } from "react";
import { useMediaQuery, useWindowScroll } from "@mantine/hooks";
import { Paper } from "@mantine/core";
import NavbarMobile from "./NavbarMobile.js";
import { useStore } from "../Store/StoreProvider.js";

const Navbar = () => {
  const phone = useMediaQuery("(max-width: 1024px)");
  const [scroll, scrollTo] = useWindowScroll();

  const [sticky, setSticky] = useState(false);

  useEffect(() => {
    if (scroll.y > 10) {
      setSticky(true);
    }
    if (scroll.y < 10) {
      setSticky(false);
    }
  }, [scroll]);

  return (
    <Paper
      withBorder={true}
      shadow="sm"
      radius={0}
      sx={(theme) =>
        !phone && sticky
          ? {
              position: "sticky",
              top: "0px",
              right: "0px",
              left: "0px",
              zIndex: 6,
              borderBottom: "1px solid",
            }
          : {}
      }
    >
      <NavbarMobile />
    </Paper>
  );
};

export default React.memo(Navbar);
