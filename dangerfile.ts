// const markdownTranslate = require('markdown-translator')
// markdownTranslate({
//   src: pathToSrcFile,
//   from: languageToTranslateFrom,
//   to: languageToTranslateTo,
//   subscriptionKey: yourSubscriptionKey,
//   region: theRegionOfYourAzureInstance
// }).then(res => {

// })

import {danger, message} from "danger"

const allFiles = [...danger.git.created_files, ...danger.git.created_files]
console.log(allFiles.join(", "))
message("Hello")

message(`Files: ${allFiles.join("")}`)

message(`PR: ${JSON.stringify(danger.github.pr, null, "   ")}`)
