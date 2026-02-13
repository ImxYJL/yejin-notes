import axios from "axios";

export const getErrorMessage = (e: unknown): string => {
  if (axios.isAxiosError(e)) {
    const serverMessage = e.response?.data?.message;
    const defaultMessage = e.message;

    return serverMessage ?? defaultMessage ?? "요청에 실패했습니다.";
  }

  return e instanceof Error ? e.message : "알 수 없는 오류가 발생했습니다.";
};
