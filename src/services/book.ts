import { AddBookParams, DeleteBookParams, ListBooksParams, UpdateBookParams } from '@/src/api/book/types';
import { BookAPI } from '@/src/api/book';
import { Toast } from '@douyinfe/semi-ui';

/** 书籍服务 */
export const BookService = {
    /** 获取书籍列表 */
    list: async (params: ListBooksParams) => {
        try {
            const resp = await BookAPI.List(params);
            if (resp.code === 200) {
                return {
                    data: resp.data,
                    total: resp.total,
                    page: params.page || 1
                };
            }
            Toast.error(resp.msg || '获取列表失败');
            return {data: [], total: 0};
        } catch (err) {
            Toast.error('网络请求异常');
            return {data: [], total: 0};
        }
    },

    /** 新增书籍 */
    add: async (params: AddBookParams) => {
        try {
            const resp = await BookAPI.Add(params);
            if (resp.code === 200) {
                Toast.success('添加成功');
                return true;
            }
            Toast.error(resp.msg || '添加失败');
            return false;
        } catch (err) {
            Toast.error('网络请求异常');
            return false;
        }
    },

    /** 更新书籍 */
    update: async (book_id: number, params: UpdateBookParams) => {
        try {
            const resp = await BookAPI.Update(book_id, params);
            if (resp.code === 200) {
                Toast.success('更新成功');
                return true;
            }
            Toast.error(resp.msg || '更新失败');
            return false;
        } catch (err) {
            Toast.error('网络请求异常');
            return false;
        }
    },

    /** 删除书籍 */
    delete: async (params: DeleteBookParams) => {
        try {
            const resp = await BookAPI.Delete(params);
            if (resp.code === 200) {
                Toast.success('删除成功');
                return true;
            }
            Toast.error(resp.msg || '删除失败');
            return false;
        } catch (err) {
            Toast.error('网络请求异常');
            return false;
        }
    }
};
