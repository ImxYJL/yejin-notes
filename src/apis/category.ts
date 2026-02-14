import { API_ENDPOINT } from "@/constants/paths";
import axiosInstance from "@/libs/axios/axios";

export const getCategoriesApi = async () => {
  const { data } = await axiosInstance.get(API_ENDPOINT.categories);

  return data.data;
};
