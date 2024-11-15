import { expect, it, describe, vi, beforeEach } from 'vitest';
import { DB_CONNECT, DB_DISCONNECT } from '../views/db/db_connection'; 
import mongoose from 'mongoose';

vi.mock('mongoose', () => ({
    __esModule: true,
    default: {
        connect: vi.fn(() => Promise.resolve()),
        disconnect: vi.fn(() => Promise.resolve()),
    },
}));

describe('Database Connection Functions', () => {
    beforeEach(() => {
        vi.clearAllMocks();
    });

    it('DB_CONNECT should establish a database connection', async () => {
        await DB_CONNECT();
        expect(mongoose.connect).toHaveBeenCalledTimes(1);
        expect(mongoose.connect).toHaveBeenCalledWith(expect.any(String)); 
    });

    it('DB_DISCONNECT should close the database connection', async () => {
        await DB_DISCONNECT(); 
        expect(mongoose.disconnect).toHaveBeenCalledTimes(1); 
    });
});

