import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";

/**
 * 포스트
 */
export const Post = defineDocumentType(() => ({
  name: "Post",
  filePathPattern: "posts/**/*.md",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    category: { type: "string", required: true },
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

/**
 * 페이지
 */
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.md",
  fields: {
    title: { type: "string", required: true },
    description: { type: "string", required: true },
    date: { type: "date", required: true },
    draft: { type: "boolean", required: false },
  },
  computedFields: {
    slug: {
      type: "string",
      resolve: page => {
        const path = page._raw.flattenedPath;
        const prefix = page._raw.sourceFileDir + "/";

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
  documentTypes: [Post, Page],
  markdown: {
    remarkPlugins: [remarkGfm],
  },
});
