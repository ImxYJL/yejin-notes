import { getPaginationRange } from '@/utils/pagination';
import Link from 'next/link';

type Props = {
  currentPage: number;
  totalPages: number;
  getPageHref: (page: number) => string;
};

const PostListPagination = ({ currentPage, totalPages, getPageHref }: Props) => {
  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <nav className="flex flex-col items-center gap-6 pt-12">
      <ul className="flex items-center gap-2">
        {pageRange.map((pageNum) => {
          const isActive = currentPage === pageNum;

          return (
            <li key={pageNum}>
              <Link
                href={getPageHref(pageNum)}
                aria-current={isActive ? 'page' : undefined}
                className={`
                  relative w-8 h-8 text-sm font-mono transition-all duration-200
                  flex items-center justify-center
                  hover:bg-accent-primary/10
                  ${
                    isActive
                      ? 'text-accent-primary font-bold shadow-[0_2px_0_0_currentColor]'
                      : 'text-muted-foreground hover:text-foreground'
                  }
                `}
              >
                {pageNum}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
};

export default PostListPagination;
