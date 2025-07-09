import {tldArray, tldSet, domainArray, domainSet} from '../dist';

test('TLD Isn\'t empty', () => {
    expect(tldArray.length).toBeGreaterThan(0);
});

test('TLD Set same size as array', () => {
    expect([...tldSet].length).toBe(tldArray.length);
})

test('Domain isn\'t empty', () => {
    expect(domainArray.length).toBeGreaterThan(0);
})

test('Domain Set same size as array', () => {
    expect([...domainSet].length).toBe(domainArray.length);
})