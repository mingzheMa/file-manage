/**
 * @description: 运行队列
 * @param {any} queue 队列
 * @param {function} iterator 迭代器，用于处理队列值，并调用next参数向后迭代
 * @param {function} cb 执行完毕回调
 * @return {*}
 */
export default function (
  queue: any[],
  iterator: (item: any, index: number, next: () => void) => void,
  cb: () => void
) {
  // step函数递归queue队列，递归判断的点就是iterator迭代器中调用next函数
  // next函数将调用step函数进行递归，也就是向后迭代queue队列

  function step(index: number) {
    // 判断队列执行完毕
    if (index >= queue.length) {
      cb();
      return;
    }

    iterator(queue[index], index, () => {
      step(index + 1);
    });
  }

  step(0);
}
