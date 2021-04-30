import fetcher from '@lib/fetcher';

const uploadImageFile: (
  file: File | string,
  isMd?: boolean,
) => Promise<{ key: string }> = async (file, isMd = false) => {
  const { url, fields } = await fetcher(
    `/api/v1/image/aws?ext=${isMd ? 'md' : 'jpg'}`,
  );

  const formData = new FormData();

  Object.entries({ ...fields, file }).forEach(([key, value]) => {
    formData.append(key, value as string | Blob);
  });

  const response = await fetch(url, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const resBody = await response.json();

    if (process.env.NODE_ENV === 'development') {
      console.log('[uploadImageFile.ts] AWS Upload Failed.', resBody);
    }

    throw new Error('AWS Upload Failed.');
  }
  return { key: fields.key };
};

export default uploadImageFile;
