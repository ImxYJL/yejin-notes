import Link from 'next/link';
import Image from 'next/image';
import { PostItem as PostItemType } from '@/types/blog';
import { formatDate } from '@/utils/date';

type PostItemProps = {
  href: string;
  post: PostItemType;
};

const PostItem = ({ href, post }: PostItemProps) => (
  <li>
    <Link href={href} className="block py-10 group border-muted-foreground/40">
      <article className="flex flex-col md:flex-row gap-6 md:gap-10 items-start md:items-center">
        {post.thumbnailUrl && (
          <div className="relative w-full md:w-48 lg:w-64 aspect-video overflow-hidden rounded-main shrink-0 md:order-last">
            <Image
              src={post.thumbnailUrl}
              alt={post.title}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 200px, 256px"
            />
          </div>
        )}

        <div className="flex-1 space-y-3 w-full">
          <h2 className="text-2xl font-bold group-hover:text-palette-0 base-transition tracking-tight leading-snug">
            {post.title}
          </h2>
          <p className="text-muted-foreground line-clamp-2 leading-relaxed text-base">
            {post.summary}
          </p>
          <div className="flex items-center gap-3 text-sm text-muted-foreground/60 font-mono pt-1">
            <span>{formatDate(post.createdAt)}</span>
          </div>
        </div>
      </article>
    </Link>
  </li>
);

export default PostItem;
