import fetcher from '@lib/fetcher';
import uploadImageFile from '@lib/aws/uploadImageFile';

const uploadAWSImage: (
  file: File | string,
  isMd?: boolean,
) => Promise<string> = async (file, isMd = false) => {
  try {
    const { key } = await uploadImageFile(file, isMd);

    const { url } = await fetcher('/api/v1/image/aws', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ key, isMd }),
    });
    console.log('uploadawsimawge', url);

    return url;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[AWSUploadImage] error', err);
    }
    const { code, additionalInfo } = err;
    let message: string;
    switch (code) {
      case 413:
        message = `[${code}] 이미지 사이즈 초과(20MB)`;
        break;
      default:
        message = `[${code}] 서버 에러 발생 ${err.message}`;
        break;
    }

    const error = new Error(message) as CustomError;
    error.code = code;
    error.additionalInfo = additionalInfo;

    throw error;
  }
};

export default uploadAWSImage;
