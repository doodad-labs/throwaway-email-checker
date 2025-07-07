import validation from '../src/validation';

const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;


function npmjs_com_email_validator(email: string): boolean {
    if (!email)

        return false;



    if (email.length > 254)

        return false;



    var valid = tester.test(email);

    if (!valid)

        return false;



    // Further checking of some things regex can't handle

    var parts = email.split("@");

    if (parts[0].length > 64)

        return false;



    var domainParts = parts[1].split(".");

    if (domainParts.some(function (part) { return part.length > 63; }))

        return false;

    return true;
}

const emails: [string, boolean][] = [
    ["local@domain.com", true],
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


    ["email@example.com", true],
    ["firstname.lastname@example.com", true],
    ["email@subdomain.example.com", true],
    ["firstname+lastname@example.com", true],
    ["email@123.123.123.123", true],
    ["\"email\"@example.com", true],
    ["1234567890@example.com", true],
    ["email@example-one.com", true],
    ["_______@example.com", true],
    ["email@example.name", true],
    ["email@example.museum", true],
    ["email@example.co.jp", true],
    ["firstname-lastname@example.com", true],

    ["much.”more\\ unusual”@example.com", true],
    ["very.unusual.”@”.unusual.com@example.com", false],
]

console.log('Is Valid\t| Working\t| Email')

emails.forEach(email => {
    const valid = validation(email[0]);
    console.log(email[1] ? '✅\t|' : '❌\t|', valid === email[1] ? '✅\t\t|' : '❌\t\t|', (valid === email[1] ? '' : '\x1b[31m') + email[0].slice(0, 50) + (email[0].length > 50 ? '...' : ''), '\x1b[0m');
});