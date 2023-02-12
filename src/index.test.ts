const vintedCombinedSearch = require('./index.js');
console.log(vintedCombinedSearch);

const searchDatas: {text: string, catalog?: number}[] = [
  { text: 'star%20wars%20solo', catalog: 2333 },
  { text: 'rogue%20one', catalog: 2333 },
  // { text: '"parrain+3"', catalog: 2333 },
  // { text: 'terminator%202', catalog: 2333 },
  // { text: 'oss%20117%20caire', catalog: 2333 },
  // { text: 'matrix', catalog: 2333 },
  // { text: 'inconnus', catalog: 2333 },
  // { text: 'turing+tumble' },
]

vintedCombinedSearch(searchDatas);