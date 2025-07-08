import throwaway from '../dist';

const emails: [string, boolean][] = [
    ["local@domain.com", true],
    ["local@domain.con", false],
    ["local@domain.co.uk", true],
    ["local@subdomain.domain.co.uk", true],
    [`${"a".repeat(64)}@domain.com`, true],
    [`a@${"b".repeat(253-5)}.com`, true],
    [".local@domain.com", false],
    ["local.@domain.com", false],
    ["$local@domain.com", true],
    ["lo..cal@domain.com", false],
    ["lo.cal@domain.com", true],
    ["local@domain..com", false],
    ["local@domain.c", false],
    ["local@domain.co", true],
    ["local@domain.lop", false],
    ["local@domain.lol", true],
    ["email@gmail.com", true],
    ["firstname.lastname@gmail.com", true],
    ["email@subdomain.gmail.com", true],
    ["firstname+lastname@gmail.com", true],
    ["email@123.123.123.123", false],
    ["\"email\"@gmail.com", true],
    ["1234567890@gmail.com", true],
    ["email@example-one.com", true],
    ["_______@gmail.com", true],
    ["email@example.name", true],
    ["email@example.museum", true],
    ["email@example.co.jp", true],
    ["firstname-lastname@gmail.com", true],
    ["oower\"$wr@2342.as", true],
    ["much.”more\\ unusual”@gmail.com", true],
    ["very.unusual.”@”.unusual.com@gmail.com", false],
]

test('TLD Validation', () => {
    emails.forEach(emails => {
        if (emails[1]) {
            expect(throwaway(emails[0], true, true)).toBeTruthy();
        } else {
            expect(throwaway(emails[0], true, true)).toBeFalsy();
        }
    });
});