import { tldArray, isTldValid } from '../src/data/tlds';

for (const tld of tldArray) {
    console.log(tld, isTldValid(tld) ? 'is valid' : 'is invalid');
}