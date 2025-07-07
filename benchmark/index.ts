import { randomBytes } from 'crypto';
import { run, bench, summary } from 'mitata';

import validation from '../src/validation';

summary(() => {
    bench('Our Email Validator', function* () {

        yield {
            [0]() {
                return `${randomBytes(16).toString('hex')}@${randomBytes(16).toString('hex')}.com`;
            },

            bench(email: string) {
                validation(email);
            },
        };
    });

    bench('npmjs.com/email-validator', function* () {

        const tester = /^[-!#$%&'*+\/0-9=?A-Z^_a-z{|}~](\.?[-!#$%&'*+\/0-9=?A-Z^_a-z`{|}~])*@[a-zA-Z0-9](-*\.?[a-zA-Z0-9])*\.[a-zA-Z](-?[a-zA-Z0-9])+$/;

        yield {
            [0]() {
                return `${randomBytes(16).toString('hex')}@${randomBytes(16).toString('hex')}.com`;
            },

            bench(email: string) {

                if (!email)

                    return false;

                    

                if(email.length>254)

                    return false;



                var valid = tester.test(email);

                if(!valid)

                    return false;



                // Further checking of some things regex can't handle

                var parts = email.split("@");

                if(parts[0].length>64)

                    return false;



                var domainParts = parts[1].split(".");

                if(domainParts.some(function(part) { return part.length>63; }))

                    return false;



                return true;

            },
        };
    });

    bench('npmjs.com/@shelf/is-valid-email-address', function* () {

        const twoDotsRegex = /\.{2,}/g;

        const domainRegex = /([\da-z.-]+)(\.)((?!.*\.$)[a-z.]{2,6})/g;

        const localPartRegex = /.+(?=@)/;

        const dotsOnEdgesRegex = /^[.]|[.]$/g;

        const quotedRegEx = /^"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"$/g;

        const quotedElementsRegEx = /"[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~(),:;<>@[\]\\ ]+"/g;

        const unquotedRegex = /^[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|[A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.]+|(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+|^(?:[\\][A-Za-z0-9+\-!#$%&'*/=?^_`{|}~.(),:;<>@[\]\\ "])+/g;

        yield {
            [0]() {
                return `${randomBytes(16).toString('hex')}@${randomBytes(16).toString('hex')}.com`;
            },

            bench(email: string) {

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

            },
        };
    });

})



run()