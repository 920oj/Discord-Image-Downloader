exports.getUrlList = (content) => {
  const pattern = /(https?:\/\/[\x21-\x7e]+)/g;
  const list = content.match(pattern);
  if (!list) {
    return false;
  }
  else {
    return list;
  }
}