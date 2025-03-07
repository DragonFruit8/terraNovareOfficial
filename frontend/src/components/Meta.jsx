import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title = "Terra'Novare", description, keywords, url, image }) => {
  return (
    <Helmet>
      {/* General Meta Tags */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph (Facebook, LinkedIn) */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />
      <meta property="og:type" content="website" />

      {/* TikTok Card */}
      <meta name="tiktok:title" content={title} />
      <meta name="tiktok:description" content={description} />
      <meta name="tiktok:image" content={image} />
      <meta name="tiktok:card" content="summary_large_image" />
    </Helmet>
  );
};


export default Meta;
