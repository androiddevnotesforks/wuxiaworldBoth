import React from "react";
import PropTypes from "prop-types";
import Head from "next/head";
import { useStore } from "../Store/Store";

const Seo = ({ description, title, url, image, loading = true }) => {
  const siteName = useStore((state) => state.siteName);

  return (
    <>
      <Head>
        <title>{title}</title>
        <meta name="description" content={`${description}`} />
        <meta property="og:description" content={`${description}`} />
        <meta property="og:locale" content="en_US" />
        <meta property="og:type" content="article" />
        <meta property="og:title" content={`${title}`} />
        <meta property="og:site_name" content={`${siteName}`} />
        <meta property="og:image" content={`${image}`} />
        <meta name="twitter:card" content={`${image}`} />
        <meta name="twitter:label1" content="Est reading time" />
        <meta name="twitter:data1" content="10 minutes" />
        <link rel="canonical" href={`${url}`} />
      </Head>
    </>
  );
};

Seo.propTypes = {
  description: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  url: PropTypes.string,
  image: PropTypes.string,
};

export default React.memo(Seo);
