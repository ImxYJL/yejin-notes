import Link from 'next/link';
import { PostItem as PostItemType } from '@/types/blog';
import { formatDate } from '@/utils/date';

type PostItemProps = {
  href: string;
  post: PostItemType;
};

const PostItem = ({ href, post }: PostItemProps) => (
  <li
    className="border-b"
    style={{
      borderColor: 'color-mix(in srgb, var(--color-accent), transparent 60%)',
    }}
  >
    <Link href={href} className="flex items-baseline gap-5 py-8 group">
      <div className="flex-1 min-w-0">
        <h2 className="text-2xl font-semibold tracking-tight leading-snug group-hover:text-accent-primary base-transition">
          {post.title}
        </h2>
        {post.summary && (
          <p className="text-sm opacity-60 line-clamp-2 leading-relaxed mt-1">
            {post.summary}
          </p>
        )}
      </div>
      <span className="font-mono text-xs opacity-50 shrink-0">
        {formatDate(post.createdAt)}
      </span>
    </Link>
  </li>
);

export default PostItem;
