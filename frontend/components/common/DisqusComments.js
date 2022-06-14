import { DiscussionEmbed } from "disqus-react";
import { useEffect, useState } from "react";
import { Container } from "@mantine/core";
import React from "react";
const DisqusComments = ({ slug }) => {
  const [shortname, setShortname] = useState(
    process.env.NEXT_PUBLIC_DISQUS_SHORTNAME
  );
  const [url, setUrl] = useState(window.location.href);
  const [title, setTitle] = useState(document.title);

  useEffect(() => {
    setUrl(window.location.href);
    setTitle(document.title);
  }, []);

  return (
    <Container>
      <DiscussionEmbed
        shortname={shortname}
        config={{
          url: url,
          identifier: slug,
          title: title,
        }}
      />
    </Container>
  );
};
export default React.memo(DisqusComments);
