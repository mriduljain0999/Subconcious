"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const zod_1 = require("zod");
const cors_1 = __importDefault(require("cors"));
const dotenv = __importStar(require("dotenv"));
const db_1 = require("./db");
const randonStringGen_1 = require("./randonStringGen");
const authMiddleware_1 = require("./authMiddleware");
const axios_1 = __importDefault(require("axios"));
const tfjs_1 = __importDefault(require("@tensorflow/tfjs"));
dotenv.config();
const secret = "halleluiyauser";
const port = 3000;
const database_url = "mongodb+srv://mriduljain012:ahnw9kt8H5@cluster0.th8on.mongodb.net/100xSubconcious";
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
var ResponseStatus;
(function (ResponseStatus) {
    ResponseStatus[ResponseStatus["Success"] = 200] = "Success";
    ResponseStatus[ResponseStatus["Error"] = 411] = "Error";
    ResponseStatus[ResponseStatus["Exist"] = 403] = "Exist";
    ResponseStatus[ResponseStatus["ServerError"] = 500] = "ServerError";
})(ResponseStatus || (ResponseStatus = {}));
const cosineSimilarity = (a, b) => {
    const dotProduct = tfjs_1.default.dot(a, b).dataSync()[0];
    const normA = tfjs_1.default.norm(a).dataSync()[0];
    const normB = tfjs_1.default.norm(b).dataSync()[0];
    return dotProduct / (normA * normB);
};
// @ts-ignore
app.post('/api/v1/embed', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { sentence1, sentence2 } = req.body;
        if (!sentence1 || !sentence2) {
            return res.status(400).json({ message: "Provide both sentences for comparison." });
        }
        const HF_API_URL = "https://api-inference.huggingface.co/models/jinaai/jina-embeddings-v2-base-en";
        const HF_API_KEY = "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";
        const response = yield axios_1.default.post(HF_API_URL, { inputs: [sentence1, sentence2] }, {
            headers: {
                "Authorization": `Bearer ${HF_API_KEY}`,
                "Content-Type": "application/json",
            },
        });
        const embeddings = response.data;
        const tensorA = tfjs_1.default.tensor(embeddings[0]);
        const tensorB = tfjs_1.default.tensor(embeddings[1]);
        const similarity = cosineSimilarity(tensorA, tensorB);
        res.status(200).json({ similarity });
    }
    catch (error) {
        if (error.response) {
            console.error("Error response from Hugging Face API:", error.response.data);
            res.status(500).json({ message: error.response.data });
        }
        else if (error.request) {
            console.error("Error in request:", error.request);
            res.status(500).json({ message: "Error in making the request." });
        }
        else {
            console.error("Error:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    }
}));

app.get('/', function(req,res){
    res.send("hello")
})

app.post('/api/v1/signup', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield db_1.UserModel.find({ username: req.body.username });
            console.log(userData);
            if (userData.length > 0) {
                res.status(ResponseStatus.Exist).json({
                    status: false,
                    message: "User already exists!"
                });
                return;
            }
            const signupBody = zod_1.z.object({
                username: zod_1.z.string().min(3).max(10),
                password: zod_1.z.string().min(8).max(20)
                    .regex(/[A-Z]/).regex(/[a-z]/).regex(/[^A-Za-z0-9]/)
            });
            const result = signupBody.safeParse(req.body);
            if (result.success) {
                const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 10);
                yield db_1.UserModel.create({
                    username: req.body.username,
                    password: hashedPassword
                });
                res.status(ResponseStatus.Success).json({
                    status: true,
                    message: 'Signed up successfully'
                });
                return;
            }
            else {
                res.status(ResponseStatus.Error).json({
                    status: false,
                    message: result.error.issues[0].message
                });
                return;
            }
        }
        catch (e) {
            res.status(ResponseStatus.ServerError).json({
                status: false,
                message: "Error signing up!"
            });
            return;
        }
    });
});
app.post('/api/v1/signin', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const userData = yield db_1.UserModel.findOne({ username: req.body.username });
            if (!userData) {
                res.status(ResponseStatus.Exist).json({
                    status: false,
                    message: "Incorrect Email/Password"
                });
                return;
            }
            const data = yield bcrypt_1.default.compare(req.body.password, userData.password);
            if (!data) {
                res.status(ResponseStatus.Exist).json({
                    status: false,
                    message: "Incorrect Email/Password"
                });
                return;
            }
            const token = jsonwebtoken_1.default.sign({ id: userData._id }, secret);
            res.status(ResponseStatus.Success).json({ token, message: `${req.body.username} logged in` });
        }
        catch (e) {
            res.status(ResponseStatus.ServerError).json({
                status: false,
                message: "Error signing in"
            });
            return;
        }
    });
});
app.post('/api/v1/content', authMiddleware_1.authMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { title, link, tags } = req.body;
            yield db_1.ContentModel.create({
                title,
                link,
                userId: req.userId,
                tags
            });
            res.status(ResponseStatus.Success).json({
                message: "Content created successfully"
            });
            return;
        }
        catch (e) {
            res.status(ResponseStatus.Error).json({
                message: e
            });
            return;
        }
    });
});
app.get('/api/v1/content', authMiddleware_1.authMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const content = yield db_1.ContentModel.find({
            userId: req.userId
        }).populate({
            path: 'tags',
            select: 'title'
        }).populate({
            path: 'userId',
            select: 'username'
        });
        res.send(content);
    });
});
app.get('/api/v1/tags', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const tags = yield db_1.TagModel.find();
        res.send(tags);
    });
});
app.post('/api/v1/tags', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        const title = req.body.title;
        const tagData = yield db_1.TagModel.find({ title });
        if (tagData.length > 0) {
            res.status(ResponseStatus.Exist).json({
                tagId: tagData[0]._id,
                title: req.body.title,
                status: false,
                message: "Tag already exists!"
            });
            return;
        }
        const response = yield db_1.TagModel.create({
            title
        });
        res.status(ResponseStatus.Success).json({
            tagId: response._id,
            status: true
        });
    });
});
app.delete('/api/v1/content', authMiddleware_1.authMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const content = yield db_1.ContentModel.deleteOne({
                _id: req.body.contentId,
                userId: req.userId
            });
            res.status(ResponseStatus.Success).json({ message: "Content deleted successfully" });
        }
        catch (e) {
            res.status(ResponseStatus.Error).json({ message: "Error deleting content" });
        }
    });
});
app.post('/api/v1/brain/share', authMiddleware_1.authMiddleware, function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (req.body.share) {
                const link = yield db_1.LinkModel.create({
                    hash: (0, randonStringGen_1.random)(15),
                    userId: req.userId
                });
                res.send(link);
                return;
            }
            else {
                const linkDel = yield db_1.LinkModel.deleteOne({
                    userId: req.userId
                });
                if (linkDel.deletedCount) {
                    res.send("Link deleted successfully");
                    return;
                }
                res.send("No such link exists!");
                return;
            }
        }
        catch (e) {
            res.send("Error creating shareable link!");
            return;
        }
    });
});
app.get('/api/v1/brain/:shareLink', function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { shareLink } = req.params;
            const link = yield db_1.LinkModel.findOne({
                hash: shareLink,
            });
            if (link) {
                const brain = yield db_1.ContentModel.find({
                    userId: link.userId
                }).populate({
                    path: 'tags',
                    select: 'title'
                }).populate({
                    path: 'userId',
                    select: 'username'
                });
                res.send(brain);
            }
            else {
                res.send("error");
                return;
            }
        }
        catch (e) {
            res.send("error");
            return;
        }
    });
});
function main() {
    return __awaiter(this, void 0, void 0, function* () {
        yield mongoose_1.default.connect(database_url);
        alert("database connected")
        app.listen(port);
        console.log("Running on port 3000");
    });
}
main();
