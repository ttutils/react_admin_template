import { CommonResp } from "@/src/api/common.type";

export interface AddBookParams {
  title?: string;
  author?: string;
  year?: string;
  summary?: string;
}

export interface AddBookResp extends CommonResp {}

export interface DeleteBookParams {
  book_id: string;
}

export interface DeleteBookResp extends CommonResp {}

export interface ListBooksParams {
  page?: number;
  page_size?: number;
  title?: string;
  author?: string;
}

export interface BookItem {
  book_id: string;
  title: string;
  author: string;
  year: string;
  summary: string;
}

export interface ListBooksResp extends CommonResp {
  total?: number;
  data?: BookItem[];
}

export interface UpdateBookParams {
  title?: string;
  author?: string;
  year?: string;
  summary?: string;
}

export interface UpdateBookResp extends CommonResp {}
