import { request } from '@/src/utils/request';
import { 
  AddBookParams,
  AddBookResp,
  DeleteBookParams,
  DeleteBookResp,
  ListBooksParams,
  ListBooksResp,
  UpdateBookParams,
  UpdateBookResp 
} from './types';

/** 添加书籍 */
export async function Add(params: AddBookParams) {
  return request.Put<AddBookResp>('/api/book/add', params);
}

/** 删除书籍 */
export async function Delete(params: DeleteBookParams) {
  return request.Delete<DeleteBookResp>(`/api/book/delete/${params.book_id}`);
}

/** 获取书籍列表 */
export async function List(params: ListBooksParams) {
  return request.Get<ListBooksResp>('/api/book/list', {
    params: params
  });
}

/** 更新书籍 */
export async function Update(book_id: number, params: UpdateBookParams) {
  return request.Post<UpdateBookResp>(`/api/book/update/${book_id}`, params);
}
