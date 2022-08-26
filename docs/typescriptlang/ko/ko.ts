import { defineMessages } from "react-intl"
import { navCopy } from "./nav"
import { comCopy } from "./community"
// import { headCopy } from "./head-seo"
// import { docCopy } from "./documentation"
// import { indexCopy } from "./index"
// import { playCopy } from "./playground"
// import { handbookCopy } from "./handbook"
// import { dtCopy } from "./dt"
import { Copy, messages as englishMessages } from "../en/en"

export const lang: Copy = defineMessages({
  ...englishMessages,
  ...navCopy,
  ...comCopy,
  // ...headCopy,
  // ...docCopy,
  // ...indexCopy,
  // ...playCopy,
  // ...handbookCopy,
  // ...dtCopy,
})
