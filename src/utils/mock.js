const mockObject = (arr, key, num) => {
  const result = [];
  for (let i = 0; i < num; i += 1) {
    const object = {};
    arr.forEach((item) => {
      object[item[key]] = item[key] + i;
    });
    result.push(object);
  }
  return result;
};
export default {};
export { mockObject };
