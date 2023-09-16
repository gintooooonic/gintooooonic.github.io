import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";

export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.md",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: { type: "string", required: false },
    draft: { type: "boolean", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: post => {
        const path = post._raw.flattenedPath;
        const prefix = post._raw.sourceFileDir + "/";

        if (path.startsWith(prefix)) {
          return path.slice(prefix.length);
        }

        return path;
      },
    },
  },
}));

export default makeSource({
  contentDirPath: "./content",
  documentTypes: [Post],
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
