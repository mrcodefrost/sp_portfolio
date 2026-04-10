import { postSchema } from "./post";
import { codeBlockSchema, imageBlockSchema, youtubeBlockSchema } from "./blockTypes";
import { authorSchema } from "./author";
import { categorySchema } from "./category";

export const schemaTypes = [
  postSchema,
  codeBlockSchema,
  imageBlockSchema,
  youtubeBlockSchema,
  authorSchema,
  categorySchema,
];
