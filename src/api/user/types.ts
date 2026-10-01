import { CommonResp } from "@/src/api/common.type";

export interface LoginParams {
  username: string;
  password: string;
  remember_me?: boolean;
  captcha?: string;
  captcha_id?: string;
}

export interface AddUserParams {
  username: string;
  password: string;
  enable?: boolean;
}

export interface UpdateUserParams {
  username?: string;
  enable?: boolean;
}

export interface LoginResp extends CommonResp {
  data?: {
    token: string;
  };
}

export type LogoutResp = CommonResp;

export interface UserListParams {
  page?: number;
  page_size?: number;
  username?: string;
  enable?: boolean;
}

export interface UserInfo {
  user_id: string;
  username: string;
  enable?: boolean;
}

export interface UserListResp extends CommonResp {
  total?: number;
  data?: UserInfo[];
}

export interface DeleteUserParams {
  user_id: string;
}

export interface ChangePasswdParams {
  password: string;
}

export type DeleteUserResp = CommonResp;

export type ChangePasswdResp = CommonResp;

export type AddUserResp = CommonResp;

export type UpdateUserResp = CommonResp;

export interface CaptchaResp extends CommonResp {
  data?: {
    id: string;
    base64_image: string;
  };
}

export interface UserInfoResp extends CommonResp {
  data?: UserInfo;
}
