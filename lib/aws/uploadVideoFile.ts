import fetcher from '@lib/fetcher';

const uploadVideoFile: (
  file: File,
  artistId: string,
) => Promise<{ key: string }> = async (file, artistId) => {
  const { url, fields } = await fetcher(
    `/api/v1/admin/video/aws?ext=${
      file.name.split('.').slice(-1)[0]
    }&id=${artistId}`,
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
      console.log('[uploadVideoFile.ts] AWS Upload Failed.', resBody);
    }

    throw new Error('AWS Upload Failed.');
  }
  return { key: fields.key };
};

export default uploadVideoFile;
