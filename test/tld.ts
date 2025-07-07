import { tldArray, tldSet } from '../src/data/tlds';

for (const tld of tldArray) {
    console.log(tld, tldSet.has(tld.toLowerCase()) ? 'is valid' : 'is invalid');
}