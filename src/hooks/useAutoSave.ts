import useSaveDraft from '@/queries/useSaveDraft';
import { PostForm } from '@/types/blog';
import { debounce } from '@/utils/node';
import { useEffect, useRef } from 'react';

const AUTOSAVE_TIME = 5000;

const useAutoSave = (formData: PostForm, setId: (id: string) => void) => {
  const { mutate: saveDraft } = useSaveDraft(setId);
  const debouncedSave = useRef(
    debounce((data: PostForm) => saveDraft(data), AUTOSAVE_TIME),
  ).current;

  // 언마운트시 타이머 해제용
  useEffect(() => {
    return () => debouncedSave.cancel();
  }, []);

  const trigger = <K extends keyof PostForm>(field: K, value: PostForm[K]) => {
    debouncedSave({ ...formData, [field]: value });
  };

  // ref의 current값 평가 지연용
  const cancel = () => debouncedSave.cancel();

  return { trigger, cancel };
};

export default useAutoSave;
