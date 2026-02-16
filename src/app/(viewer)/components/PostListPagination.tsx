import { Button } from "@/components/common";
import { getPaginationRange } from "@/utils/pagination";

type Props = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
};

const PostListPagination = ({
  currentPage,
  totalPages,
  onPageChange,
}: Props) => {
  const pageRange = getPaginationRange(currentPage, totalPages);

  return (
    <nav
      className="flex flex-col items-center gap-6 pt-12"
      aria-label="Pagination"
    >
      {/* 숫자 버튼 리스트 */}
      <div className="flex items-center gap-2">
        {pageRange.map((pageNum) => (
          <button
            key={pageNum}
            onClick={() => onPageChange(pageNum)}
            className={`w-8 h-8 text-sm font-mono transition-colors ${
              currentPage === pageNum
                ? "text-accent-primary font-bold border-b-2 border-accent-primary"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            {pageNum.toString()}
          </button>
        ))}
      </div>

      {/* 컨트롤 버튼 (Prev / Next) */}
      <div className="flex items-center gap-6">
        <Button
          variant="outline"
          size="sm"
          className="w-24 font-mono uppercase tracking-tighter"
          disabled={currentPage === 1}
          onClick={() => onPageChange(currentPage - 1)}
        >
          Prev
        </Button>

        <span className="text-sm font-bold font-mono tracking-widest">
          <span className="text-accent-primary">{currentPage}</span> /{" "}
          {totalPages}
        </span>

        <Button
          variant="outline"
          size="sm"
          className="w-24 font-mono uppercase tracking-tighter"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(currentPage + 1)}
        >
          Next
        </Button>
      </div>
    </nav>
  );
};

export default PostListPagination;
