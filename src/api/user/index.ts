import express from 'express';
import passport from 'passport';
import {
  addFollow,
  createUser,
  editUser,
  getTimeline,
  getUserById,
  getUserByUsername,
  getUsers,
  loginUser,
  removeFollow,
  setUserPass
} from './controller';

const router = express.Router();

router.post('/login', async (req, res) => {
  try {
    const data = await loginUser(req.body);
    res.status(200).json({ data });
  } catch (error) {
    res.status(400).json({ msg: String(error) });
  }
});

router.post('/register', async (req, res) => {
  try {
    const user = await createUser(req.body);
    if(user) {
      res.status(201).json({ msg: 'User created' });
    }else{
      res.status(400).json({ msg: 'User NOT created' });
    }
  } catch (error) {
    res.status(400).json({ msg: String(error) });
  }
});

router.get('/:userID/profile', async (req, res) => {
  try {
    const user = await getUserById(req.params.userID);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.get('/search/:username', async (req, res) => {
  try {
    const user = await getUserByUsername(req.params.username);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ error: String(error) });
  }
});

// middleware USUARIOS LOGUEADOS
router.use(passport.authenticate('jwt', {session: false}));

router.put('/password/reset', async (req, res) => {
  try {
    const user = await setUserPass(req.body.userID, req.body.pass, req.body.newPass);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.get('/:userID/timeline', async (req, res) => {
  try {
    const posts = await getTimeline(req.params.userID);
    res.status(200).json({ data: posts });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.put('/:userID/profile', async (req, res) => {
  try {
    const user = await editUser(req.params.userID, req.body);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.post('/:userID/follow', async (req, res) => {
  try {
    const user = await addFollow(req.body.id, req.params.userID);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.delete('/:userID/follow', async (req, res) => {
  try {
    const user = await removeFollow(req.body.id, req.params.userID);
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await getUsers();
    res.status(200).json({ data: users });
  } catch (error) {
    res.status(500).json({ msg: String(error) });
  }
});

export default router;
