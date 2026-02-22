import { unified } from "unified";
import remarkParse from "remark-parse";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";
import rehypePrettyCode from "rehype-pretty-code";
import rehypeStringify from "rehype-stringify";
// TODO: 나중에 상수로 변경
import rosePineDawn from "shiki/themes/rose-pine-dawn.mjs";

export const getMarkdownHtml = async (content: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: rosePineDawn,
      keepBackground: true,
    })
    .use(rehypeStringify)
    .process(content);

  return result.toString();
};
