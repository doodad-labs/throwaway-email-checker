import { isTldValid } from '../src/data/tlds';

const tlds = [
    'com',
    'org',
    'net',
    'co.uk',
    'io',
    'ai',
    'xyz',
    'info',
]

test('TLD Validation', () => {
    tlds.forEach(tld => {
        expect(isTldValid(tld)).toBeTruthy();
    });
});