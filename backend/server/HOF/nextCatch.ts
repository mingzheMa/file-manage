export default (fn) => {
  return (...args) => fn(...args).catch(args[2]);
};
