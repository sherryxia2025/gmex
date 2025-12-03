import DataFast from "./data-fast";
import GoogleAnalytics from "./google-analytics";
import OpenPanelAnalytics from "./open-panel";
import Plausible from "./plausible";
import VercelAnalytics from "./vercel-analytics";

export default function Analytics() {
  if (process.env.NODE_ENV !== "production") {
    return null;
  }

  return (
    <>
      <VercelAnalytics />
      <OpenPanelAnalytics />
      <GoogleAnalytics />
      <Plausible />
      <DataFast />
    </>
  );
}
