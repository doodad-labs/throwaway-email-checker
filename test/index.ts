import validation from '../src/validation';

const validEmails = [
    "local@domain.com",
    "local@domain.co.uk",
    "local@subdomain.domain.co.uk",
    "a".repeat(64) + "@domain.com",
    "a" + "@" + "b".repeat(253-5) + ".com"
]

validEmails.forEach(email => {
    console.log(validation(email), email)
});