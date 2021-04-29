import { NextApiRequest, NextApiResponse } from 'next';
import sharp from 'sharp';
import { throwError, withErrorHandler } from '@utils/common';
import {
  doesObjectExist,
  getObjectByKey,
  getUploadUrl,
  uploadS3,
} from '@utils/aws';
import sha256 from 'sha256';
import { v4 as uuidv4 } from 'uuid';

const handler: (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> = async (req, res) => {
  if (req.method === 'GET') {
    const { ext } = req.query;

    if (!ext) return throwError(res, 2, 400);

    const data = await getUploadUrl({
      basePath: 'images/target/',
      ext: ext as string,
    });

    return res.json(data);
  }

  if (req.method === 'POST') {
    const { key } = req.body;

    if (!key) return throwError(res, 2, 400);

    if (!doesObjectExist(key)) return throwError(res, 10, 404);

    const { Body: buffer } = await getObjectByKey(key);

    const filename = sha256(uuidv4());

    const original = sharp(buffer)
      .clone()
      .flatten({ background: { r: 255, g: 255, b: 255, alpha: 1 } })
      .resize({
        fit: 'contain',
        width: 800,
        withoutEnlargement: true,
      })
      .jpeg({ quality: 40, chromaSubsampling: '4:4:4' })
      .withMetadata();

    await uploadS3({
      buffer: await original.toBuffer(),
      key: `images/target/${filename}.jpg`,
    });

    const url = `${process.env.CLOUDFRONT_URL}/images/target/${filename}.jpg`;

    console.log('aws', url);
    return res.status(201).json({
      url,
    });
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
