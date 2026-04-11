import { postSchema } from "./post";
import { codeBlockSchema, imageBlockSchema, youtubeBlockSchema } from "./blockTypes";

export const schemaTypes = [
  postSchema,
  codeBlockSchema,
  imageBlockSchema,
  youtubeBlockSchema,
];
