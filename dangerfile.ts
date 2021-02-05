const markdownTranslate = require('@orta/markdown-translator')
import {danger, markdown} from "danger"

const go = async () => {
  const allMDFiles = [...danger.git.modified_files, ...danger.git.created_files].filter(f => f.endsWith(".md")).filter(f => f.split("/").length > 2)

  
  for (const file of allMDFiles) {
    const fileContents = await danger.github.utils.fileContents(file)
    if (!fileContents) continue
    
    const translation = await markdownTranslate({
      text: fileContents,
      from: file.split("/")[2],
      to: "en",
      subscriptionKey: process.env.AZURE_TRANSLATE_KEY,
      region: "eastus"
    })
    
    markdown(`<details>
<summary>Translation of ${danger.github.utils.fileLinks([file])}</summary>

${translation}

</details>`)
  };
}

go()
