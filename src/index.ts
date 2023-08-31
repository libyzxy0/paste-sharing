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
  
   const currentDate: Date = new Date();
  const date = currentDate.toDateString();
  const time = currentDate.toLocaleTimeString();
  
  const exp: Date = new Date();
exp.setDate(exp.getDate() + 1);
let expire = exp.toDateString()
  
   const id = genID(6);
     try { 
     const newPaste: IPaste = new Paste({ 
       name: name, 
       paste: paste, 
       password: password, 
       createdAt: new Date().getDate(), 
       id: id
     });
     await newPaste.save(); 
     res.send({ 
       name: name, 
       id: id, 
       url: `https://paste.x-cnx.repl.co/${id}`, 
       created: `${date}:${time}`, 
       expire: `${expire}:${time}`
     });
   } catch (error) { 
      res.status(500).send({ error: "Something went wrong" })
    }
});

async function removePasteById(pasteId: string) {
  try {
    const paste = await Paste.findById(pasteId);

    if (!paste) {
      console.log('Paste not found.');
      return;
    }

    // Remove the paste
    await paste.deleteOne();

    console.log('Expire Paste removed successfully.');
  } catch (error) {
    console.error('Error removing paste:', error);
  }
}

async function expiryHandler() {
  const paste: IPaste[] = await Paste.find();
  const currentDate = new Date();
  const expirationDate = new Date(currentDate.getTime() - 24 * 60 * 60 * 1000); // Subtract 24 hours from the current date
  const exp = paste.filter((pasteItem: any) => new Date(pasteItem.createdAt) > expirationDate);
  if (exp.length !== 0) {
    for (let i = 0; i < exp.length; i++) {
      removePasteById(exp[i]._id);
    }
  } 
}

setInterval(expiryHandler, 5000);


app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));