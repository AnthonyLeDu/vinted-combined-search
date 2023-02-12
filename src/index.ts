const vinted = require('vinted-api');
const rootSearchString = 'https://www.vinted.fr/vetements?';

type VintedSearch = { text: string, catalog?: number }; // TODO: add price and status_id[] criterias
type VintedUser = { id: number, profile_url: string };
type VintedItem = { user: VintedUser };
type VintedSearchResult = { items: VintedItem[], message: string, code: number };

function getItemsUsers(items: VintedItem[]): VintedUser[] {
  const users = items
    .map(item => item.user) // Get items users
    .filter((user, index, array) => array.indexOf(user) === index); // Remove duplicates
  return users
}

function sleep(milliseconds: number) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

async function runVintedSearch(searchString: string, attempt: number = 0): Promise<VintedSearchResult> {
  attempt += 1;
  const result: VintedSearchResult = await vinted.search(searchString);
  if (result.code === 106) {
    if (attempt > 10) throw new Error(`Unable to fetch from API: ${result.message}`);
    console.log('Waiting a bit...');
    sleep(10000);
    return runVintedSearch(searchString, attempt);
  }
  return result;
}

async function searchItems(searchRequest: VintedSearch): Promise<VintedItem[]> {
  const items = []
  let baseSearchURI = `${rootSearchString}search_text=${searchRequest.text}`;
  baseSearchURI += searchRequest.catalog ? `&catalog[]=${searchRequest.catalog}` : '';

  let page = 0;
  let result: VintedSearchResult;
  let fullSearchURI: string;
  do {
    page++; // Searching on the next page
    fullSearchURI = `${baseSearchURI}&page=${page}`;
    console.log(fullSearchURI);
    result = await runVintedSearch(fullSearchURI);
    items.push(...result.items);
    console.log(items.length);
  } while (result.items.length > 0);

  console.log(`${items.length} items found !`);
  return items;
}

async function findMatchingUsers(searchDatas: VintedSearch[]): Promise<VintedUser[]> {

  let isFirstSearch = true;
  let allMatchingUsers: { [key: number]: VintedUser } = {};
  for (const searchData of searchDatas) {
    console.log('======================================');
    console.log(searchData);
    console.log('======================================');
    const items: VintedItem[] = await searchItems(searchData);
    let users = getItemsUsers(items);

    if (isFirstSearch) {
      isFirstSearch = false;
    } else {
      // Keeping only users that match current and previous searches
      users = users.filter(user => Object.hasOwn(allMatchingUsers, user.id));
    }
    allMatchingUsers = Object.fromEntries(users.map(user => [user.id, user]));
  }

  const users: VintedUser[] = Object.values(allMatchingUsers); // Dropping the ids
  console.log(`${users.length} MATCHING USERS :`);
  users.map(user => console.log(`  - ${user.id} | ${user.profile_url}`));
  return users;
}

module.exports = findMatchingUsers;
