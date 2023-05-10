export const BASE_PATH = '/ind'
export const DOMAIN = '124.223.115.179:6001'; // 项目主域名

// 是否是开发模式
export const IS_DEV = [
  `dev.${DOMAIN}`,
].includes(location.hostname);

// 是否是测试模式
export const IS_TEST = [
  `test.${DOMAIN}`,
].includes(location.hostname);

// 是否是预发模式
export const IS_PRE = [
  `pre.${DOMAIN}`,
].includes(location.hostname);

export const File = ['ai', 'psd', 'rar', 'zip', 'war'];
export const Video = ['mp4', 'MP4'];
export const Image = ['png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG', 'gif', 'GIF'];
export const ImageNoGif = ['png', 'PNG', 'jpeg', 'JPEG', 'jpg', 'JPG'];
export const Doc = ['doc', 'docs', 'docx', 'pdf', 'ppt', 'pptx', 'txt', 'xls', 'xlsx'];