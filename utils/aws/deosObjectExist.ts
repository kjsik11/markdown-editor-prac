import s3 from './s3';

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName) throw new Error('missing bucketName.');

const doesObjectExist: (key: string) => Promise<boolean> = async (key) => {
  try {
    await s3
      .headObject({
        Bucket: bucketName,
        Key: key,
      })
      .promise();

    return true;
  } catch (err) {
    if (err.code === 'NotFound') return false;

    throw err;
  }
};

export default doesObjectExist;
