import { DB_CONNECT, DB_DISCONNECT } from './db_connection.js';
import { User } from './user_schema.js';

export const CREATE_USER = async (slug, name, score) => {
    await DB_CONNECT();
    try {
        const user = new User({ slug, name, score });
        await user.save();
        return user;
    } finally {
        await DB_DISCONNECT();
    }
};

export const GET_ALL_USERS = async () => {
    await DB_CONNECT();
    try {
        return await User.find({}).exec();
    } finally {
        await DB_DISCONNECT();
    }
};

export const GET_SPECIFIC_USER = async (slug) => {
    await DB_CONNECT();
    try {
        return await User.findOne({ slug }).exec();
    } finally {
        await DB_DISCONNECT();
    }
};

export const UPDATE_USER = async (slug, reqBody) => {
    await DB_CONNECT();
    try {
        return await User.findOneAndUpdate({ slug }, reqBody, { new: true });
    } finally {
        await DB_DISCONNECT();
    }
};

export const DELETE_USER = async (slug) => {
    await DB_CONNECT();
    try {
        return await User.findOneAndDelete({ slug });
    } finally {
        await DB_DISCONNECT();
    }
};
