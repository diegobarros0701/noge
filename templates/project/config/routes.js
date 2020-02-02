const router = require('express').Router();

router.get('/users', UserController.index);
router.get('/users/:id', UserController.show);
router.post('/users', UserController.create);
router.patch('/users/:id', UserController.patch);
router.delete('/users/:id', UserController.destroy);