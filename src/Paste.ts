import mongoose from 'mongoose'; 
  
export interface IPaste extends mongoose.Document { 
   name: string; 
   password: string;
   paste: string;
   createdAt: string;
   id: string; 
 } 
  
const pasteSchema = new mongoose.Schema({ 
   name: String, 
   paste: String, 
   password: String, 
   createdAt: String, 
   id: String,
 }); 
  
export const Paste = mongoose.model<IPaste>('Paste', pasteSchema);