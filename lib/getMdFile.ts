import fetcher from './fetcher';

const getMdFile: (url: string) => Promise<string> = async (url) => {
  try {
    const { mdText } = await fetcher('/api/v1/getMdFile', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    if (mdText) return mdText;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.log('[getMdFile] error', err);
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

export default getMdFile;
