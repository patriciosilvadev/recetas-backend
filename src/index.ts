import express from 'express';
import { connectDatabase } from './databaseUtils';
import userRouter from './api/user/';
import postRouter from './api/post/';
import commentRouter from './api/comment/';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import passport from 'passport';
import { jwtStrategy } from './api/middelwares/auth';
import fs from 'fs';

dotenv.config();
const app = express();

app.set('port', process.env.PORT || 3000);

app.use(morgan('combined'));
app.use(morgan('combined', {
    stream: fs.createWriteStream('/API/log/request.log', {flags: 'a'})
}));
app.use(cors());
app.use(express.json());
app.use(passport.initialize());
passport.use(jwtStrategy);

app.use('/static', express.static('/public'));

app.use('/user', userRouter);

app.use('/post', postRouter);

app.use('/comment', commentRouter);

app.get('/', async (req, res) => {
  res.json('OK');
});

connectDatabase()
  .then(() => {
    app.listen(3000, () => console.log('Listen on port 3000'));
  })
  .catch((error) => {
    console.error('Algo ha fallado', error);
  });
