const vinted = require('vinted-api');

const oss117Caire = 'https://www.vinted.fr/vetements?search_text=oss%20117%20caire&search_id=8304782759&catalog[]=2333';
const godfatcher3 = 'https://www.vinted.fr/vetements?search_text=le%20parrain%203&search_id=8305150145&catalog[]=2333';
const matrix = 'https://www.vinted.fr/vetements?search_text=matrix&search_id=8305199706&catalog[]=2333';

function getUniqueUsers(items) {
  const users = items
    .map(item => item.user) // Get items users
    .filter((user, index, array) => array.indexOf(user) === index); // Remove duplicates
  return users
}

async function vintedSearchItems(searchString) {
  try {
    const result = await vinted.search(searchString);
    return result.items;
  } catch (error) {
    console.log(error);
    return []
  }
}

async function findMatchingUsers(searchStrings) {
  let allMatchingUsers = [];
  for (const searchString of searchStrings) {
    const items = await vintedSearchItems(searchString);
    console.log(items.length); // Always 48 max, seems the API is limiting the number of results
    const users = getUniqueUsers(items);
    allMatchingUsers = allMatchingUsers.filter(user => users.includes(user)); // Keep only matching users in final results
  }
  allMatchingUsers = allMatchingUsers.filter((user, index, array) => array.indexOf(user) === index); // Remove duplicates
  return allMatchingUsers;
}

const searchStrings = [
  oss117Caire,
  godfatcher3,
  matrix,

]

findMatchingUsers(searchStrings);
