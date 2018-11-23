import { Transaction } from './transaction';

export const TRANSACTIONS: Transaction[] = [
    { id: 1, fileId: 3, action: 'add', user: 'Noemie', date: '20/11/2018'},
    { id: 2, fileId: 3, action: 'add', user: 'Elise', date: '20/11/2018'},
    { id: 3, fileId: 5, action: 'add', user: 'Lyna', date: '21/11/2018'},
    { id: 4, fileId: 2, action: 'delete', user: 'Charles', date: '21/11/2018'},
    { id: 5, fileId: 5, action: 'delete', user: 'Cedric', date: '21/11/2018'},
    { id: 6, fileId: 1, action: 'add', user: 'Marouen', date: '22/11/2018'},
    { id: 7, fileId: 4, action: 'delete', user: 'Noemie', date: '22/11/2018'}
];