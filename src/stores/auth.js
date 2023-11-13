import { makeAutoObservable, runInAction } from 'mobx';
import Cookies from 'js-cookie';
import { httpRequest } from '@/utils';
import { storageKeys } from '@/constants';

const hasLoggedIn = !!Cookies.get(storageKeys.token);
const initPermissions = localStorage.getItem(storageKeys.permissions)
  ? JSON.parse(localStorage.getItem(storageKeys.permissions))
  : [];

class Auth {
  profile = {
    username: Cookies.get(storageKeys.username),
  };

  isLoggedIn = hasLoggedIn;

  permissions = initPermissions;

  isAdmin = false;

  constructor() {
    makeAutoObservable(this);
    if (hasLoggedIn) {
      this.getPermission();
    }
  }

  setProfile(username) {
    this.profile.username = username;
  }

  setIsLoggedIn(isLoggedIn) {
    this.isLoggedIn = isLoggedIn;
    if (isLoggedIn) {
      this.getPermission();
    }
  }

  async getPermission() {
    try {
      const res = await httpRequest.get('/admin/user');
      if (res.code !== 0) {
        throw new Error(res.msg);
      }
      runInAction(() => {
        const { permissions, admin, mobile } = res.data || {};
        this.permissions = permissions;
        localStorage.setItem(storageKeys.permissions, JSON.stringify(permissions));
        localStorage.setItem(storageKeys.isAdmin, admin);
        localStorage.setItem(storageKeys.mobile, mobile);
        this.isAdmin = admin;
      });
    } catch (err) {
      console.log(err?.message || '获取权限失败');
    }
  }

  setPermissions(permissions) {
    this.permissions = permissions;
  }

  clearlogInfo() {
    this.profile = {
      username: '',
      avatar: '',
    };
    this.isLoggedIn = false;
    this.permissions = [];
    this.isAdmin = false;
  }
}

export default new Auth();
