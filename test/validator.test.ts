import validation from '../src/validation';

const validEmails = [
    "local@domain.com",
    "local@domain.co.uk",
    "local@subdomain.domain.co.uk",
    "a".repeat(64) + "@domain.com",
    "a".repeat(64) + "@" + "b".repeat(249) + ".com"
]

const invalidEmails = [
    "local@domain",
    "local@domain..com",
    "local@.domain.com",
]


test('email validator against valid emails  ', () => {
    validEmails.forEach(email => {
        expect(validation(email)).toBeTruthy();
    });
});

/* test('email validator against invalid emails', () => {
    invalidEmails.forEach(email => {
        console.log(email)
        expect(validation(email)).toBeFalsy();
    });
}); */