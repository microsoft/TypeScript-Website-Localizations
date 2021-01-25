const markdownTranslate = require('@orta/markdown-translator')
import {danger, message} from "danger"

const go = async () => {
  const allMDFiles = [...danger.git.modified_files, ...danger.git.created_files].filter(f => f.endsWith(".md")).filter(f => f.split("/").length > 2)
  console.log(allMDFiles)
  for (const file of allMDFiles) {
    const fileContents = await danger.github.utils.fileContents(file)
    const translation = await markdownTranslate({
      text: fileContents,
      from: file.split("/")[2],
      to: "en",
      subscriptionKey: process.env.AZURE_TRANSLATE_KEY,
      region: "eastus"
    })
    
    message(`Translation of ${danger.github.utils.fileLinks([file])}\n\n${translation}`)
  };
}

go()
