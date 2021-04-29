import s3 from './s3';
import sha256 from 'sha256';
import { v4 as uuidv4 } from 'uuid';

const bucketName = process.env.AWS_BUCKET_NAME;
if (!bucketName)
  throw new Error(`Can't find AWS_BUCKET_NAME in environment variables.`);

const getUploadUrl: (options: {
  basePath: string;
  ext: string;
  acl?: string;
  maxSize?: number;
  expires?: number;
}) => Promise<{
  url: string;
  fields: { [x: string]: string };
}> = async ({
  basePath,
  ext,
  acl,
  maxSize = 20 * 1024 * 1024,
  expires = 30,
}) => {
  return new Promise((resolve, reject) => {
    s3.createPresignedPost(
      {
        Bucket: bucketName,
        Fields: {
          key: `${basePath}${sha256(uuidv4())}.${ext}`,
        },
        Expires: expires,
        Conditions: acl
          ? [{ acl: acl }, ['content-length-range', 0, maxSize]]
          : [['content-length-range', 0, maxSize]],
      },
      (err, data) => {
        if (err) reject(err);
        else
          resolve({
            url: data.url,
            fields: acl
              ? {
                  acl: acl,
                  ...data.fields,
                }
              : data.fields,
          });
      },
    );
  });
};

export default getUploadUrl;
