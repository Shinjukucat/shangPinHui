import {v4 as uuidv4} from 'uuid';
// 要求：要随机生成一个字符串，且每次执行不能发生变化，且游客身份要永久存储
export const getUUID = () => {
  // 先在本地存储看看有没有这个uuid
  let uuid_token = localStorage.getItem('UUIDTOKEN');
  // 如果没有
  if(! uuid_token) {
    // 生成一个uuid
    uuid_token = uuidv4();
    // 本地存储
    localStorage.setItem('UUIDTOKEN', uuid_token);
  }
  return uuid_token
}