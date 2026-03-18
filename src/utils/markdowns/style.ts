import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { unified } from 'unified';
import remarkParse from 'remark-parse';
import remarkGfm from 'remark-gfm';
import remarkBreaks from 'remark-breaks';
import remarkRehype from 'remark-rehype';
import rehypePrettyCode from 'rehype-pretty-code';
import rehypeReact from 'rehype-react';
import catppuccinFrappe from 'shiki/themes/catppuccin-frappe.mjs';
import { Callout } from '@/components/common';

/**
 * @description 마크다운 원문을 Shiki 하이라이팅과 커스텀 컴포넌트가 적용된 리액트 노드로 변환
 */
export const getMarkdownComponent = async (content: string) => {
  const result = await unified()
    .use(remarkParse)
    .use(remarkGfm)
    .use(remarkBreaks)
    .use(remarkRehype)
    .use(rehypePrettyCode, {
      theme: catppuccinFrappe,
      keepBackground: true,
    })
    .use(rehypeReact, {
      Fragment,
      jsx,
      jsxs,
      components: {
        blockquote: Callout,
      },
    })
    .process(content);

  return result.result;
};
