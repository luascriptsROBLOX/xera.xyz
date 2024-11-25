import { defineDocumentType, makeSource } from "contentlayer/source-files";
import remarkGfm from "remark-gfm";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeSlug from "rehype-slug";
import rehypeAutolinkHeadings from "rehype-autolink-headings";

/** @type {import('contentlayer/source-files').ComputedFields} */
const computedFields = {
  path: {
    type: "string",
    resolve: (doc) => `/${doc._raw.flattenedPath}`,
  },
  slug: {
    type: "string",
    resolve: (doc) => doc._raw.flattenedPath.split("/").slice(1).join("/"),
  },
};

// Define the Project Document Type
export const Project = defineDocumentType(() => ({
  name: "Project",
  filePathPattern: "./projects/**/*.mdx", // Path to project MDX files
  contentType: "mdx", // This is MDX content
  fields: {
    published: {
      type: "boolean", // If the project is published
    },
    title: {
      type: "string", // The title of the project
      required: true, // Required field
    },
    description: {
      type: "string", // The description of the project
      required: true, // Required field
    },
    date: {
      type: "date", // The date the project was created
    },
    url: {
      type: "string", // URL of the project
    },
    repository: {
      type: "string", // Repository URL
    },
  },
  computedFields, // Use the computed fields for path and slug
}));

// Define the Page Document Type
export const Page = defineDocumentType(() => ({
  name: "Page",
  filePathPattern: "pages/**/*.mdx", // Path to page MDX files
  contentType: "mdx", // This is MDX content
  fields: {
    title: {
      type: "string", // The title of the page
      required: true, // Required field
    },
    description: {
      type: "string", // Optional description for the page
    },
  },
  computedFields, // Use the computed fields for path and slug
}));

// Export the default Contentlayer source configuration
export default makeSource({
  contentDirPath: "./content", // Root directory for content files
  documentTypes: [Page, Project], // Register the document types
  mdx: {
    remarkPlugins: [remarkGfm], // Use GitHub Flavored Markdown (GFM)
    rehypePlugins: [
      rehypeSlug, // Automatically generate IDs for headings
      [
        rehypePrettyCode,
        {
          theme: "github-dark", // Use GitHub Dark theme for syntax highlighting
          onVisitLine(node) {
            if (node.children.length === 0) {
              node.children = [{ type: "text", value: " " }]; // Handle empty lines
            }
          },
          onVisitHighlightedLine(node) {
            node.properties.className.push("line--highlighted"); // Highlight lines
          },
          onVisitHighlightedWord(node) {
            node.properties.className = ["word--highlighted"]; // Highlight words
          },
        },
      ],
      [
        rehypeAutolinkHeadings,
        {
          properties: {
            className: ["subheading-anchor"], // Add anchor links to headings
            ariaLabel: "Link to section", // Add aria-label for accessibility
          },
        },
      ],
    ],
  },
});
