import express, { Request, Response } from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import { Paste, IPaste } from './Paste';
import ejs from 'ejs';
import path from 'path';
import dotenv from 'dotenv';
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

 // Connect to the MongoDB database 
mongoose.set("strictQuery", false); 
mongoose.connect(`${process.env.MONGO_URI}`, { 
  dbName: "paste-sharing" 
});

//Middlewares
app.use(cors())  
app.use(express.urlencoded({ extended: true }));  
app.use(express.json());
app.engine('html', ejs.renderFile);  
app.set('view engine', 'html');  
app.set('views', path.join(__dirname, 'views')); 
 app.use(express.static("src/public"));

app.get('/', (req: Request, res: Response) => { 
   res.render('index');
});

app.post('/api/new-paste', async (req: Request, res: Response) => { 
   const name: string = req.body.name; 
   const paste: string = req.body.paste;
   const password: string = req.body.password;
   const genID = (length: number) => Array.from({ length }, () => Math.random().toString(36).charAt(2)).join('');
   const id = genID(6);
     try { 
     const newPaste: IPaste = new Paste({ 
       name: name, 
       paste: paste, 
       password: password, 
       createdAt: new Date(), 
       id: id
     });
     await newPaste.save(); 
     res.send({ 
       name: name, 
       id: id, 
       url: `https://paste.x-cnx.repl.co/${id}`, 
       created: new Date(), 
       expire: "Not available"
     });
   } catch (error) { 
      res.status(500).send({ error: "Something went wrong" })
    }
});

app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));