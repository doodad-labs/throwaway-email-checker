import validation from './validation';

export default (email:string): boolean => {
    return validation(email);
}