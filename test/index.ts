import validation from '../src';

const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;
const twoDotsRegex = /\.{2,}/g;
const domainRegex = /([\da-z.-]+)(\.)((?!.*\.$)[a-z.]{2,6})/g;
const localPartRegex = /.+(?=@)/;
const dotsOnEdgesRegex = /^[.]|[.]$/g;
const quotedRegEx = /^"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"$/g;
const quotedElementsRegEx = /"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"/g;
const unquotedRegex = /^[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+|^(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+/g;

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

function npmjs_com_shelf_is_valid_email_address(email: string): boolean {
    if (email.match(twoDotsRegex)) {

        return false;

    }

    const domainPart = email.replace(localPartRegex, '');

    if (!domainPart.match(domainRegex)) {

        return false;

    }

    const localPartMatch = email.match(localPartRegex);

    if (!localPartMatch) {

        return false;

    }

    const localPart = localPartMatch[0];

    if (localPart.match(dotsOnEdgesRegex)) {

        return false;

    }

    const quotedParts = email.match(/".+?"/g);

    if (quotedParts && !quotedParts.every(item => item.match(quotedRegEx)?.length)) {

        return false;

    }

    const unquotedPart = quotedParts ? localPart.replaceAll(quotedElementsRegEx, '') : localPart;

    if (unquotedPart === '') {

        return true;

    }

    const unquotedPartMatch = unquotedPart && unquotedPart.match(unquotedRegex);

    if (unquotedPartMatch === null ||

        unquotedPartMatch?.reduce((acc, item) => acc.replace(item, ''), unquotedPart)

            .length) {

        return false;

    }

    return true;
}

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

console.log('Valid\t| throwaway\t| email-validator  | is-valid-email-address\t| Email')
console.log('--------|---------------|------------------|----------------------------|--------------------------------------------------');

let ourScore = 0;
let emailValidatorScore = 0;
let shelfValidatorScore = 0;

emails.forEach(email => {
    const ourValid = validation(email[0]);
    const emailValidator = npmjs_com_email_validator(email[0]);
    const shelfValidator = npmjs_com_shelf_is_valid_email_address(email[0]);

    if (ourValid === email[1]) ourScore++;
    if (emailValidator === email[1]) emailValidatorScore++;
    if (shelfValidator === email[1]) shelfValidatorScore++;

    console.log(
        email[1] ? '✅\t|' : '❌\t|', 
        ourValid === email[1] ? '✅\t\t|' : '❌\t\t|',
        emailValidator === email[1] ? '✅\t\t   |' : '❌\t\t   |',
        shelfValidator === email[1] ? '✅\t\t\t\t|' : '❌\t\t\t\t|', 
        
        (ourValid === email[1] ? '' : '\x1b[31m') + email[0].slice(0, 50) + (email[0].length > 50 ? '...' : ''), 
        '\x1b[0m'
    );
});

console.log(`\nResults:`);
console.log(`Our validation: \t${ourScore}/${emails.length} (${(ourScore / emails.length * 100).toFixed(2)}%)`);
console.log(`email-validator: \t${emailValidatorScore}/${emails.length} (${(emailValidatorScore / emails.length * 100).toFixed(2)}%)`);
console.log(`is-valid-email-address: ${shelfValidatorScore}/${emails.length} (${(shelfValidatorScore / emails.length * 100).toFixed(2)}%)`);