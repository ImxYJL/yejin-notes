import axios from "axios";

export const getAxiosMessage = (e: unknown) => {
  if (axios.isAxiosError(e)) {
    const status = e.response?.status;
    const message =
      e.response?.data?.message ?? e.response?.data?.error ?? e.message;

    if (!status || !message) return "요청에 실패했습니다.";
    return message;
  }

  return e instanceof Error ? e.message : "요청에 실패했습니다.";
};
