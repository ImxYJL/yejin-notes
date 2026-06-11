import useSaveDraft from '@/queries/useSaveDraft';
import { PostForm } from '@/types/blog';
import { debounce } from '@/utils/node';
import { useEffect, useRef } from 'react';

const useAutoSave = (formData: PostForm, setId: (id: string) => void) => {
  // formData 클로저로 낡은 값 들어가는 것 방지용
  const formDataRef = useRef(formData);

  // 렌더 이후에 ref 업데이트를 예약 (렌더 중 ref 갱신할 경우 값이 모호하므로)
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  const AUTOSAVE_TIME = 5000;
  const { mutate: saveDraft } = useSaveDraft(setId);
  const debouncedSave = useRef(
    debounce((data: PostForm) => saveDraft(data), AUTOSAVE_TIME),
  ).current;

  // 언마운트시 타이머 해제용
  useEffect(() => {
    return () => debouncedSave.cancel();
  }, []);

  const trigger = <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
    debouncedSave({ ...formDataRef.current, [field]: value });
  };

  // ref의 current값 평가 지연용
  const cancel = () => debouncedSave.cancel();

  return { trigger, cancel };
};

export default useAutoSave;
