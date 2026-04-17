import { getPaginationRange } from '@/utils/pagination';

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PostListPagination = ({ currentPage, totalPages, onPageChange }: Props) => {
  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <nav className="flex flex-col items-center gap-6 pt-12" aria-label="Pagination">
      <ul className="flex items-center gap-2">
        {pageRange.map((pageNum) => (
          <li key={pageNum}>
            <button
              onClick={() => onPageChange(pageNum)}
              className={`
                relative w-8 h-8 text-sm font-mono transition-all duration-200
                flex items-center justify-center
                hover:bg-accent-primary/10 
                ${
                  currentPage === pageNum
                    ? 'text-accent-primary font-bold shadow-[0_2px_0_0_currentColor]'
                    : 'text-muted-foreground hover:text-foreground'
                }
              `}
            >
              {pageNum}
            </button>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default PostListPagination;
