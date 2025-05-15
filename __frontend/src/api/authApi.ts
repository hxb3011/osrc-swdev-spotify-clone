import { AuthInfo, Profile } from "../types";
import iaxios from "./iaxios";

export type loginParams = {
  user_info: string;
  password: string;
  remember_me: boolean;
};

export function login(data: loginParams) {
  return iaxios.post<AuthInfo>("/login/", data);
}

export interface RegisterParams {
  first_name: string;
  last_name: string;
  username: string;
  email: string;
  password: string;
  gender: string;
  birth_date: string;
}

export function register(data: RegisterParams) {
  return iaxios.post<AuthInfo>("/register/", data);
}

export function getProfile() {
  return iaxios.get<Profile>("/profile/");
}

export function uploadProfilePhoto(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  return iaxios.patch("/profile-image-upload/", formData);
}

export function followArtist(id: number) {
  return iaxios.post(`/follow-artist/${id}/`);
}

export function unfollowArtist(id: number) {
  return iaxios.post(`/unfollow-artist/${id}/`);
}
