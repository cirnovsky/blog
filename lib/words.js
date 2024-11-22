// 我草你妈，真他妈难写

export default function CountWords(text) {
  let cn = text.match(/\p{sc=Han}/gu);
  return cn == null ? 0 : cn.length;
//   let en = text.replace(/[^w-]/g, ' ');
//   en.split(/\s+/);
//   en = en.filter(w => {
//     return ['', '-', '_'].indexOf(w.trim()) === -1;
//   });
//   return cn.length + en.length;
}
