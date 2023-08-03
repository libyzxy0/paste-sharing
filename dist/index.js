"use strict";
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
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const Paste_1 = require("./Paste");
const ejs_1 = __importDefault(require("ejs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 3000;
// Connect to the MongoDB database 
mongoose_1.default.set("strictQuery", false);
mongoose_1.default.connect(`${process.env.MONGO_URI}`, {
    dbName: "paste-sharing"
});
//Middlewares
app.use((0, cors_1.default)());
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json());
app.engine('html', ejs_1.default.renderFile);
app.set('view engine', 'html');
app.set('views', path_1.default.join(__dirname, 'views'));
app.use(express_1.default.static("src/public"));
app.get('/', (req, res) => {
    res.render('index');
});
app.post('/api/new-paste', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.body.name;
    const paste = req.body.paste;
    const password = req.body.password;
    const genID = (length) => Array.from({ length }, () => Math.random().toString(36).charAt(2)).join('');
    const id = genID(6);
    try {
        const newPaste = new Paste_1.Paste({
            name: name,
            paste: paste,
            password: password,
            createdAt: new Date(),
            id: id
        });
        yield newPaste.save();
        res.send({
            name: name,
            id: id,
            url: `https://paste.x-cnx.repl.co/${id}`,
            created: new Date(),
            expire: "Not available"
        });
    }
    catch (error) {
        res.status(500).send({ error: "Something went wrong" });
    }
}));
app.listen(port, () => console.log(`Server is running on http://localhost:${port}`));
