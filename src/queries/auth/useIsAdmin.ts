import { useQuery } from "@tanstack/react-query";
import { ADMIN_QUERY_KEY } from "../queryKey";
import axiosInstance from "@/libs/axios/axios";
import { API_ENDPOINT } from "@/constants/paths";

const useIsAdmin = () => {
  const { data, isLoading } = useQuery({
    queryKey: [ADMIN_QUERY_KEY.authUser],
    queryFn: async () => {
      const { data: res } = await axiosInstance.get(API_ENDPOINT.me);
      return res.data;
    },
    staleTime: Infinity, 
    gcTime: Infinity,   
  });

  return {
    isAdmin: !!data?.isAdmin,
    isLoading,
  };
};

export default useIsAdmin;
