"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TagModel = exports.LinkModel = exports.ContentModel = exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Schema = mongoose_1.default.Schema;
const ObjectId = mongoose_1.default.Schema.Types.ObjectId;
const User = new Schema({
    username: { type: String, unique: true },
    password: { type: String, required: true }
});
const Tag = new Schema({
    title: { type: String, required: true, unique: true }
});
const Link = new Schema({
    hash: { type: String, required: true },
    userId: { type: ObjectId, ref: 'users', unique: true }
});
const Content = new Schema({
    link: { type: String, required: true },
    title: { type: String, required: true },
    tags: [{ type: ObjectId, ref: 'tags' }],
    userId: { type: ObjectId, ref: 'users' }
});
exports.UserModel = mongoose_1.default.model('users', User);
exports.ContentModel = mongoose_1.default.model('contents', Content);
exports.LinkModel = mongoose_1.default.model('links', Link);
exports.TagModel = mongoose_1.default.model('tags', Tag);
