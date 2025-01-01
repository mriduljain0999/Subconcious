import express, { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { z } from 'zod';
import cors from 'cors';
import * as dotenv from 'dotenv'
import { UserModel, ContentModel, TagModel, LinkModel } from './db';
import { random } from './randonStringGen';
import { authMiddleware } from './authMiddleware';
import axios from 'axios'
import tf from '@tensorflow/tfjs'


dotenv.config();

const secret = process.env.JWT_SECRET;
const port  = process.env.PORT;
const database_url = process.env.MONGODB_URL;


const app = express();
app.use(express.json());
app.use(cors({
    origin: 'https://subconcious.vercel.app', // Allow only your frontend
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed methods
    credentials: true // Include cookies if required
  }));

enum ResponseStatus {
    Success = 200,
    Error = 411,
    Exist = 403,
    ServerError = 500
}

interface AuthenticationRequest extends Request{
    userId?:String
}

const cosineSimilarity = (a:any, b:any) => {
    const dotProduct = tf.dot(a, b).dataSync()[0];
    const normA = tf.norm(a).dataSync()[0];
    const normB = tf.norm(b).dataSync()[0];
    return dotProduct / (normA * normB);
};

// @ts-ignore
app.post('/api/v1/embed', async (req:Request, res:Response) => {
    try {
        const { sentence1, sentence2 } = req.body;

        if (!sentence1 || !sentence2) {
            return res.status(400).json({ message: "Provide both sentences for comparison." });
        }

        const HF_API_URL = "https://api-inference.huggingface.co/models/jinaai/jina-embeddings-v2-base-en";
        const HF_API_KEY = "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"; 

        const response = await axios.post(
            HF_API_URL,
            { inputs: [sentence1, sentence2] },
            {
                headers: {
                    "Authorization": `Bearer ${HF_API_KEY}`,
                    "Content-Type": "application/json",
                },
            }
        );

        const embeddings = response.data;
        const tensorA = tf.tensor(embeddings[0]);
        const tensorB = tf.tensor(embeddings[1]);
        const similarity = cosineSimilarity(tensorA, tensorB);

        res.status(200).json({ similarity });
    } catch (error: any) {
        if (error.response) {
            console.error("Error response from Hugging Face API:", error.response.data);
            res.status(500).json({ message: error.response.data });
        } else if (error.request) {
            console.error("Error in request:", error.request);
            res.status(500).json({ message: "Error in making the request." });
        } else {
            console.error("Error:", error.message);
            res.status(500).json({ message: "Internal server error" });
        }
    }
});

app.post('/api/v1/signup', async function(req, res) {
    try {
        const userData = await UserModel.find({ username: req.body.username });
        console.log(userData);
        if (userData.length > 0) {
            res.status(ResponseStatus.Exist).json({
                status: false,
                message: "User already exists!"
            });
            return;
        }

        const signupBody = z.object({
            username: z.string().min(3).max(10),
            password: z.string().min(8).max(20)
                .regex(/[A-Z]/).regex(/[a-z]/).regex(/[^A-Za-z0-9]/)
        });

        const result = signupBody.safeParse(req.body);
        if (result.success) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            await UserModel.create({
                username: req.body.username,
                password: hashedPassword
            });
            res.status(ResponseStatus.Success).json({
                status: true,
                message: 'Signed up successfully'
            });
            return;
        } else {
            res.status(ResponseStatus.Error).json({
                status: false,
                message: result.error.issues[0].message
            });
            return;
        }
    } catch (e) {
        res.status(ResponseStatus.ServerError).json({
            status: false,
            message: "Error signing up!"
        });
        return;
    }
});

app.post('/api/v1/signin', async function(req, res) {
    try {
        const userData = await UserModel.findOne({ username: req.body.username });
        if (!userData) {
            res.status(ResponseStatus.Exist).json({
                status: false,
                message: "Incorrect Email/Password"
            });
            return;
        }
        const data = await bcrypt.compare(req.body.password, userData.password);
        if (!data) {
            res.status(ResponseStatus.Exist).json({
                status: false,
                message: "Incorrect Email/Password"
            });
            return;
        }
        const token = jwt.sign({ id: userData._id }, secret as string);
        res.status(ResponseStatus.Success).json({ token,message:`${req.body.username} logged in` });
    } catch (e) {
        res.status(ResponseStatus.ServerError).json({
            status: false,
            message: "Error signing in"
        });
        return;
    }
});

app.post('/api/v1/content',authMiddleware, async function(req:AuthenticationRequest, res) {
    try{
        const { title, link,tags } = req.body;
        await ContentModel.create({
            title,
            link,
            userId: req.userId,
            tags
        })
        res.status(ResponseStatus.Success).json({
            message:"Content created successfully"
        })
        return;
    }
    catch(e){
        res.status(ResponseStatus.Error).json({
            message:e
        })
        return;
    }

});

app.get('/api/v1/content',authMiddleware,async function(req:AuthenticationRequest,res){
    const content = await ContentModel.find({
        userId:req.userId
    }).populate({
        path: 'tags',
        select:'title'
    }).populate({
        path:'userId',
        select:'username'
    })
    res.send(content);
})

app.get('/api/v1/tags',async function(req,res){
    const tags = await TagModel.find();
    res.send(tags);
})

app.post('/api/v1/tags',async function(req,res){
    const title = req.body.title;
    
    const tagData:any = await TagModel.find({ title });
        if (tagData.length > 0) {
            res.status(ResponseStatus.Exist).json({
                tagId:tagData[0]._id,
                title:req.body.title,
                status:false,
                message: "Tag already exists!"
            });
            return;
        }

    const response = await TagModel.create({
        title
    });
    res.status(ResponseStatus.Success).json({
        tagId:response._id,
        status:true
    });
})

app.delete('/api/v1/content',authMiddleware,async function(req:AuthenticationRequest,res){
    try{
        const content = await ContentModel.deleteOne({
            _id:req.body.contentId,
            userId:req.userId
        })
        res.status(ResponseStatus.Success).json({message:"Content deleted successfully"});
    }
    catch(e){
        res.status(ResponseStatus.Error).json({message:"Error deleting content"});
    }
})

app.post('/api/v1/brain/share',authMiddleware,async function(req:AuthenticationRequest,res){
    try{
        if(req.body.share){
            const link = await LinkModel.create({
                hash:random(15),
                userId:req.userId
            })
            res.send(link)
            return;
        }
        else{
            const linkDel = await LinkModel.deleteOne({
                userId:req.userId
            })

            if(linkDel.deletedCount){
                res.send("Link deleted successfully")
                return;
            }
            res.send("No such link exists!")
            return;
        }
    }catch(e){
        res.send("Error creating shareable link!");
        return;
    }
})

app.get('/api/v1/brain/:shareLink', async function (req, res) {
    try {
        const { shareLink } = req.params;
        const link = await LinkModel.findOne({
            hash: shareLink,
        });
        if (link) {
            const brain = await ContentModel.find({
                userId:link.userId
            }).populate({
                path: 'tags',
                select:'title'
            }).populate({
                path:'userId',
                select:'username'
            })
            res.send(brain);
        } else {
            res.send("error"); 
            return;
        }
    } catch (e) {
        res.send("error")
        return;
    }
});


async function main() {
    await mongoose.connect(database_url as string);
    app.listen(port);
    console.log("Running on port 3000");
}
main();
