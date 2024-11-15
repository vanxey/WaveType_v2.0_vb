import { expect, it, describe, beforeAll, afterAll } from 'vitest';
import { GET_SPECIFIC_USER, GET_ALL_USERS, CREATE_USER, UPDATE_USER, DELETE_USER } from '../views/db/crud_functions';
import { DB_CONNECT, DB_DISCONNECT } from '../views/db/db_connection';
import mongodb_users from '../test/test data/mongodb_users.json';
import "dotenv/config";

describe('Tests whether CRUD operations work properly', () => {
    
    // Connect to the database before all tests
    beforeAll(() => DB_CONNECT());

    // Disconnect from the database after all tests
    afterAll(() => DB_DISCONNECT());

    describe('GET_SPECIFIC_USER', () => {
        it('Should list specific user', async () => {
            const expectedUser = { slug: 'James-Hetfield', name: 'James Hetfield', score: 500 };
            const response = await GET_SPECIFIC_USER('James-Hetfield');

            expect(response.name).toEqual(expectedUser.name);
        });
    });

    describe('GET_ALL_USERS', () => {
        it('Should list all users', async () => {
            const expectedUsers = mongodb_users;
            const response = await GET_ALL_USERS();

            expect(response.length).toEqual(expectedUsers.length);
        });
    });

    describe('CREATE_USER', () => {
        it('Should create a new user', async () => {
            const newUser = { slug: 'User-1', name: 'John Doe', score: 123 };

            await CREATE_USER(newUser.slug, newUser.name, newUser.score);
            const user = await GET_SPECIFIC_USER(newUser.slug);

            expect(user.slug).toEqual(newUser.slug);

            await DELETE_USER(newUser.slug);
        });
    });

    describe('UPDATE_USER', () => {
        it('Should edit a user', async () => {
            const updatedUser = { slug: 'test', name: 'updated name', score: 34 };

            const response = await UPDATE_USER(updatedUser.slug, updatedUser);
            expect(response.name).toEqual(updatedUser.name);

            await UPDATE_USER(updatedUser.slug, { slug: 'test', name: 'test', score: 30 });
        });
    });

    describe('DELETE_USER', () => {
        it('Should delete a user', async () => {
            const userToDelete = { slug: 'delete-test', name: 'random', score: 123 };

            await CREATE_USER(userToDelete.slug, userToDelete.name, userToDelete.score);

            const initialUsers = await GET_ALL_USERS();

            await DELETE_USER(userToDelete.slug);

            const finalUsers = await GET_ALL_USERS();

            expect(finalUsers.length).toEqual(initialUsers.length - 1);
            
            await CREATE_USER(userToDelete.slug, userToDelete.name, userToDelete.score);
        }, { timeout: 10000 });
    });
});
