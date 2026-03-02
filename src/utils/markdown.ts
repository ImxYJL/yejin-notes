import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkBreaks from "remark-breaks";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
// TODO: 나중에 상수로 변경
import rosePineDawn from "shiki/themes/rose-pine-dawn.mjs";
import catppuccinFrappe from "shiki/themes/catppuccin-frappe.mjs";

export const getMarkdownHtml = async (content: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: catppuccinFrappe,
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(content);

  return result.toString();
};
