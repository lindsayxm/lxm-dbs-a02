// Code 128 encoder (subsets B and C). Returns the bar pattern as a string of
// "1" (bar) and "0" (space) modules, including the start, checksum and stop symbols.

const PATTERNS = [
  "212222", "222122", "222221", "121223", "121322", "131222", "122213", "122312", "132212", "221213",
  "221312", "231212", "112232", "122132", "122231", "113222", "123122", "123221", "223211", "221132",
  "221231", "213212", "223112", "312131", "311222", "321122", "321221", "312212", "322112", "322211",
  "212123", "212321", "232121", "111323", "131123", "131321", "112313", "132113", "132311", "211313",
  "231113", "231311", "112133", "112331", "132131", "113123", "113321", "133121", "313121", "211331",
  "231131", "213113", "213311", "213131", "311123", "311321", "331121", "312113", "312311", "332111",
  "314111", "221411", "431111", "111224", "111422", "121124", "121421", "141122", "141221", "112214",
  "112412", "122114", "122411", "142112", "142211", "241211", "221114", "413111", "241112", "134111",
  "111242", "121142", "121241", "114212", "124112", "124211", "411212", "421112", "421211", "212141",
  "214121", "412121", "111143", "111341", "131141", "114113", "114311", "411113", "411311", "113141",
  "114131", "311141", "411131", "211412", "211214", "211232",
];
const STOP = "2331112";
const START_B = 104;
const START_C = 105;

function modules(widths: string) {
  let bar = true;
  let out = "";
  for (const w of widths) {
    out += (bar ? "1" : "0").repeat(Number(w));
    bar = !bar;
  }
  return out;
}

export function code128(text: string): string {
  const digitsOnly = /^\d+$/.test(text) && text.length % 2 === 0;
  const values: number[] = [digitsOnly ? START_C : START_B];
  if (digitsOnly) {
    for (let i = 0; i < text.length; i += 2) values.push(Number(text.slice(i, i + 2)));
  } else {
    for (const ch of text) {
      const v = ch.charCodeAt(0) - 32;
      if (v < 0 || v > 94) throw new Error(`Code 128 B cannot encode "${ch}"`);
      values.push(v);
    }
  }
  const checksum = values.reduce((sum, v, i) => sum + v * (i === 0 ? 1 : i), 0) % 103;
  values.push(checksum);
  return values.map((v) => modules(PATTERNS[v])).join("") + modules(STOP);
}
