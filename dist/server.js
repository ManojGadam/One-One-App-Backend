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
const userRepository_1 = require("./Repository/userRepository");
const app = (0, express_1.default)();
const port = 5000;
// Middleware to parse JSON request bodies
app.use(express_1.default.json());
app.post('/setUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, userRepository_1.setUserInfo)(req.body);
        res.send('User set successfully');
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.get('/getUser', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.getUserInfo)();
        res.json(data);
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.post('/setProvider', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log("in", req.body);
        yield (0, userRepository_1.setProvider)(req.body);
        res.send('Provider set successfully');
    }
    catch (ex) {
        console.log(ex);
    }
}));
app.get('/getProvider', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield (0, userRepository_1.getProvider)();
        res.json(data);
    }
    catch (ex) {
        console.log(ex);
    }
}));
// Start the server and listen on the specified port
app.listen(port, () => {
    // Log a message when the server is successfully running
    console.log(`Server is running on http://localhost:${port}`);
});
