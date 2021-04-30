import uploadAWSImage from './uploadAWSImage';

const uploadImage: (
  file: File | string,
  isMd?: boolean,
) => Promise<string> = async (file, isMd = false) => {
  try {
    return await uploadAWSImage(file, isMd);
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[uploadImage] error', err);
    }
    const { code, additionalInfo } = err;

    let message: string;
    switch (code) {
      default:
        message = `[${code}] `;
        break;
    }

    const error = new Error(message) as CustomError;
    error.code = code;
    error.additionalInfo = additionalInfo;

    throw error;
  }
};

export default uploadImage;
