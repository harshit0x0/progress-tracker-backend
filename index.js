import mongoose from 'mongoose';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

// {
//     origin: "https://6638537ed79e9e6a4051f20f--silver-axolotl-635802.netlify.app"
// }

const app = express();
app.use(cors());
app.use(express.json())

const dbURL = process.env.dbURL;
mongoose.connect(dbURL);
mongoose.connection.on("error", console.error.bind(console, "connection error:"));
mongoose.connection.once("open", () => {
    console.log("database connected");
})

const dataSchema = new mongoose.Schema({
    date: Date,
    hours: Number,
    limit: Number
})

const Data = mongoose.model('Data', dataSchema);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`listening on port ${PORT} with cors enabled`);
})

app.get('/api', async (req, res) => {
    const results = await Data.find();
    res.json(results);
})

app.get('/', async (req, res) => {
    const results = await Data.find();
    res.send(results);
})

app.post('/send', async (req, res) => {
    const newData = new Data(req.body);
    await newData.save();
    console.log(req.body);
    res.redirect('/');
})

app.post('/update', async (req, res) => {
    await Data.findOneAndDelete({ _id: req.body.id });
    console.log(req.body.id);
    res.redirect('/');
})