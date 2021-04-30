import { NextApiRequest, NextApiResponse } from 'next';
import { throwError, withErrorHandler } from '@utils/common';
const handler: (
  req: NextApiRequest,
  res: NextApiResponse,
) => Promise<void> = async (req, res) => {
  if (req.method === 'POST') {
    const { url } = req.body;

    const response = await fetch(url);

    const mdText = await response.text();

    return res.send({ mdText });
  }

  return throwError(res, 1, 400);
};

export default withErrorHandler(handler);
