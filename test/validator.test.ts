import throwaway from '../dist';

// email, test 1, test 2, test 3, test 4
const emails: [string, boolean, boolean, boolean, boolean][] = [
    ["local@domain.com", true, true, true, true],
    ["local@domain.con", false, false, true, false],
    ["local@domain.co.uk", true, true, true, true],
    ["local@subdomain.domain.co.uk", true, true, true, true],
    [`${"a".repeat(64)}@domain.com`, true, true, true, true],
    [`a@${"b".repeat(253-5)}.com`, true, true, true, true],
    [".local@domain.com", false, false, false, false],
    ["local.@domain.com", false, false, false, false],
    ["$local@domain.com", true, true, true, true],
    ["lo..cal@domain.com", false, false, false, false],
    ["lo.cal@domain.com", true, true, true, true],
    ["local@domain..com", false, false, false, false],
    ["local@domain.c", false, false, false, false],
    ["local@domain.co", true, true, true, true],
    ["local@domain.lop", false, false, true, false],
    ["local@domain.lol", true, true, true, true],
    ["email@gmail.com", true, true, true, true],
    ["firstname.lastname@gmail.com", true, true, true, true],
    ["email@subdomain.gmail.com", true, true, true, true],
    ["firstname+lastname@gmail.com", true, true, true, true],
    ["email@123.123.123.123", false, false, true, false],
    ["\"email\"@gmail.com", true, true, true, true],
    ["1234567890@gmail.com", true, true, true, true],
    ["email@example-one.com", true, true, true, true],
    ["_______@gmail.com", true, true, true, true],
    ["email@example.name", true, true, true, true],
    ["email@example.museum", true, true, true, true],
    ["email@example.co.jp", true, true, true, true],
    ["firstname-lastname@gmail.com", true, true, true, true],
    ["oower\"$wr@2342.as", true, true, true, true],
    ["much.”more\\ unusual”@gmail.com", true, true, true, true],
    ["very.unusual.”@”.unusual.com@gmail.com", false, false, false, false],
]

test('Full Email Validation', () => {
    emails.forEach(emails => {
        if (emails[1]) {
            expect(throwaway(emails[0], true, true)).toBeTruthy();
        } else {
            expect(throwaway(emails[0], true, true)).toBeFalsy();
        }
    });
});

test('TLD Email Validation', () => {
    emails.forEach(emails => {
        if (emails[2]) {
            expect(throwaway(emails[0], true, false)).toBeTruthy();
        } else {
            expect(throwaway(emails[0], true, false)).toBeFalsy();
        }
    });
});

test('NO TLD Email Validation', () => {
    emails.forEach(emails => {
        if (emails[3]) {
            expect(throwaway(emails[0], false, true)).toBeTruthy();
        } else {
            expect(throwaway(emails[0], false, true)).toBeFalsy();
        }
    });
});