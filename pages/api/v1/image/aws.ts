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
import handleImage from '@utils/handleImage';

const handler: (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> = async (req, res) => {
  if (req.method === 'GET') {
    const { ext } = req.query;

    if (!ext) return throwError(res, 2, 400);

    const data = await getUploadUrl({
      basePath: `${ext === 'md' ? 'markdown/' : 'images/target/'}`,
      ext: ext as string,
    });

    return res.json(data);
  }

  if (req.method === 'POST') {
    const { key, isMd } = req.body;

    if (!key) return throwError(res, 2, 400);

    if (!doesObjectExist(key)) return throwError(res, 10, 404);

    const { Body: buffer } = await getObjectByKey(key);

    const { url } = await handleImage({
      input: buffer,
      basePath: `${isMd ? 'markdown' : 'images/target'}`,
    });

    return res.status(201).json({
      url,
    });
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
