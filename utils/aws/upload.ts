import s3 from './s3';

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName)
  throw new Error(`Can't find AWS_BUCKET_NAME in environment variables.`);

const upload: (options: {
  buffer: Buffer;
  key: string;
}) => Promise<{
  ETag: string;
  VersionId: string;
  Location: string;
  key: string;
  Key: string;
  Bucket: string;
}> = async ({ buffer, key }) => {
  return new Promise((resolve, reject) => {
    s3.upload(
      {
        Bucket: bucketName,
        Key: key,
        Body: buffer,
        ACL: 'public-read',
      },
      (err, data) => {
        if (err) reject(err);
        else
          resolve(
            data as {
              ETag: string;
              VersionId: string;
              Location: string;
              key: string;
              Key: string;
              Bucket: string;
            },
          );
      },
    );
  });
};

export default upload;
