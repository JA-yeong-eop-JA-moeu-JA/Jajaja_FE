import type { TLocalCartStorage } from '@/types/cart/TCart';

import { decrypt, encrypt } from '@/utils/crypto';

import { LocalCartStorage } from './cartStorage';

type TKeywordItem = {
  id: number;
  keyword: string;
};
class Storage {
  static getAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? decrypt(accessToken) : undefined;
  };
  static getLocalCart = (): TLocalCartStorage => LocalCartStorage.get();
  static setLocalCart = (cart: TLocalCartStorage) => LocalCartStorage.set(cart);
  static clearLocalCart = () => LocalCartStorage.clear();

  // 로그인 시 로컬 데이터 정리
  static clearLocalDataOnLogin = () => {
    sessionStorage.removeItem('keyword');
  };

  static setAccessToken = (accessToken: string) => {
    localStorage.setItem('accessToken', encrypt(accessToken));
  };
  static getCategory = () => {
    const category = localStorage.getItem('category');
    return category ? category : undefined;
  };
  static setCategory = (category: number) => {
    localStorage.setItem('category', category.toString());
  };
  static getServer = () => {
    const server = localStorage.getItem('server');
    return server ? server : undefined;
  };
  static setServer = () => {
    localStorage.setItem('server', 'set');
  };
  static setKeyword = (keyword: string) => {
    const list: TKeywordItem[] = JSON.parse(sessionStorage.getItem('keyword') || '[]');
    if (list[0]?.keyword === keyword) return;
    list.unshift({ id: Date.now(), keyword });
    if (list.length > 10) list.pop();
    sessionStorage.setItem('keyword', JSON.stringify(list));
  };

  static getKeyword = (): TKeywordItem[] => {
    return JSON.parse(sessionStorage.getItem('keyword') || '[]');
  };

  static deleteKeyword = (id: number) => {
    const keywords: TKeywordItem[] = JSON.parse(sessionStorage.getItem('keyword') || '[]');
    const filtered = keywords.filter((item) => item.id !== id);
    sessionStorage.setItem('keyword', JSON.stringify(filtered));
  };

  static clearStorage = () => {
    localStorage.clear();
  };
}

export default Storage;
