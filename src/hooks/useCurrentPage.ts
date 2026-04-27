import { QUERY_PARAMS } from '@/constants/system';
import { getValidatedPage } from '@/utils/page';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

const useCurrentPage = () => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const pageStr = searchParams.get(QUERY_PARAMS.page);
  const page = getValidatedPage(pageStr);

  const handlePageChange = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(QUERY_PARAMS.page, newPage.toString());

    router.push(`${pathname}?${params.toString()}`);
  };

  return { page, handlePageChange };
};

export default useCurrentPage;
