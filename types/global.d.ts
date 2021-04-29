// Declarations for global interfaces & types
interface ImageInfo {
  _id: string;
  url: string;
  thumbUrl: string;
  aspectRatio: number;
  // created: string;
}

interface CustomError extends Error {
  code?: number;
  additionalInfo?: unknown;
}

interface RequestWithUserId extends NextApiRequest {
  userId: ObjectId;
}

interface RequestWithFile extends RequestWithUserId {
  files: any[];
  file: any;
}

interface CustomError extends Error {
  code?: number;
  additionalInfo?: any;
}
