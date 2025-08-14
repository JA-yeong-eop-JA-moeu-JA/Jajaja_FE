import { decrypt, encrypt } from '@/utils/crypto';

class Storage {
  static getAccessToken = () => {
    const accessToken = localStorage.getItem('accessToken');
    return accessToken ? decrypt(accessToken) : undefined;
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
  static clearStorage = () => {
    localStorage.clear();
  };
}

export default Storage;
