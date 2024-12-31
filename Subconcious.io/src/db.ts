import mongoose, { mongo } from "mongoose";
import { boolean } from "webidl-conversions";
const Schema = mongoose.Schema;
const ObjectId = mongoose.Schema.Types.ObjectId;

const User = new Schema({
    username: { type:String , unique:true},
    password: { type:String , required:true}
})

const Tag = new Schema({
    title: { type:String , required:true,unique:true}
})

const Link = new Schema({
    hash: { type:String , required:true},
    userId: {type:ObjectId, ref: 'users', unique:true}
})

const Content = new Schema({
    link: { type:String , required:true},
    title: { type:String , required:true},
    tags: [{type:ObjectId,  ref:'tags'}],
    userId: {type:ObjectId, ref: 'users'}
})

export const UserModel = mongoose.model('users',User);
export const ContentModel = mongoose.model('contents',Content);
export const LinkModel = mongoose.model('links',Link);
export const TagModel = mongoose.model('tags',Tag);