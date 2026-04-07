import { usePathname } from 'next/navigation';

const useCurrentSlug = () => {
  const pathname = usePathname();
  const segments = pathname.split('/').filter(Boolean);

  // /admin/dev/posts → dev
  // /dev/posts → dev
  const currentSlug = segments[0] === 'admin' ? segments[1] : segments[0];

  return {
    currentSlug,
    isActiveCategory: (slug: string) => currentSlug === slug,
  };
};

export default useCurrentSlug;
