import { defineMessages } from "react-intl";
import { Copy, messages as englishMessages } from "../en/en";
import { comCopy } from "./community";
import { dtCopy } from "./dt";
import { handbookCopy } from "./handbook";
import { headCopy } from "./head-seo";
import { navCopy } from "./nav";

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...comCopy,
  ...dtCopy,
  ...handbookCopy,
  ...headCopy,
  ...navCopy,
});
