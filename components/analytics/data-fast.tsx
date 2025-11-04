export default function DataFast() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  const dataFastDomain = process.env.NEXT_PUBLIC_DATA_FAST_DOMAIN;
  const dataFastWebsiteId = process.env.NEXT_PUBLIC_DATA_FAST_WEBSITE_ID;

  if (!dataFastWebsiteId || !dataFastDomain) {
    return null;
  }

  return (
    <script
      defer
      data-website-id={dataFastWebsiteId}
      data-domain={dataFastDomain}
      src={"https://datafa.st/js/script.js"}
    ></script>
  );
}
