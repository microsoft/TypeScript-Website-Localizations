import { defineMessages } from "react-intl";
import { Copy, messages as englishMessages } from "../en/en";
import { cheatCopy } from "./cheatsheets"
import { comCopy } from "./community"
import { docCopy } from "./documentation"
import { dtCopy } from "./dt"
import { footerCopy } from "./footer"
import { handbookCopy } from "./handbook"
import { headCopy } from "./head-seo"
import { indexCopy } from "./index"
import { indexCopy as index2Copy } from "./index2"
import { navCopy } from "./nav"
import { playCopy } from "./playground"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...docCopy,
  ...headCopy,
  ...indexCopy,
  ...playCopy,
  ...comCopy,
  ...handbookCopy,
  ...dtCopy,
  ...index2Copy,
  ...footerCopy,
  ...cheatCopy
});
