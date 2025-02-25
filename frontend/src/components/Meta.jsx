import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({ title, description, keywords, url, image }) => {
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

      {/* Twitter Card */}
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:card" content="summary_large_image" />
    </Helmet>
  );
};

Meta.defaultProps = {
  title: "Terra'Novare",
  description: "Default site description for SEO.",
  keywords: "your, business, keywords",
  url: "https://terranovare.tech",
  image: "https://terranovare.tech/default-image.jpg",
};

export default Meta;
