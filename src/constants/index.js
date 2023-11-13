export { default as datetimeFormat } from './datetimeFormat';
export { default as storageKeys } from './storageKeys';
export { default as exportType } from './exportType';
export { default as pattern } from './pattern';
export { default as moneyFormat } from './moneyFormat';
export const amountFormat = '0,0.00';
export const searchFieldCol = {
  basic: {
    xxl: 4,
    lg: 6,
    md: 8,
    sm: 12,
  },
  twoTimes: {
    xxl: 8,
    lg: 12,
    md: 16,
    sm: 24,
  },
};
export const genderOptions = [
  { label: '男', value: 'MALE' },
  { label: '女', value: 'FEMALE' },
];
export const enterpriseOptions = [
  { label: '人力服务公司', value: '人力服务公司' },
  { label: '劳务派遣公司', value: '劳务派遣公司' },
  { label: '其它', value: '其它' },
];
export const verifyStatus = {
  PASS: {
    text: '已审核',
    tag: 'success',
  },
  REJECT: {
    text: '已驳回',
    tag: 'error',
  },
  INIT: {
    text: '审核中',
    tag: 'processing',
  },
  RETRACT: {
    text: '已撤回',
    tag: 'warning',
  },
  DIRECTOR_PASS: {
    text: '主管已审核',
    tag: 'success',
  },
  DIRECTOR_REJECT: {
    text: '主管驳回',
    tag: 'error',
  },
  FINANCE_PASS: {
    text: '财务已审核',
    tag: 'success',
  },
  FINANCE_REJECT: {
    text: '财务驳回',
    tag: 'error',
  },
};
export const approvalStatus = {
  PENDING: '未提交',
  REVIEWING: '审核中',
  AGREE: '审核通过',
  REFUSE: '已拒绝',
  CANCEL: '撤回成功',
};
export const approvalOptions = [
  { label: '未提交', value: 'PENDING' },
  { label: '审核中', value: 'REVIEWING' },
  { label: '审核通过', value: 'AGREE' },
  { label: '已拒绝', value: 'REFUSE' },
];
export const flowPoolTemplateLink = 'https://blue-collar-prod.oss-cn-shenzhen.aliyuncs.com/public/%E7%BA%BF%E7%B4%A2%E5%AF%BC%E5%85%A5%E6%A8%A1%E6%9D%BF.xlsx';
export default {};
