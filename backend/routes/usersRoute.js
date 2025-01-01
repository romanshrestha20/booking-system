import express from 'express';

const router = express.Router();

// get all users
router.get('/', (req, res) => {
    res.send('Get all users'); 
});
// get user by id
router.get('/:id', (req, res) => {
    res.send('Get user by id');
});

// create user
router.post('/', (req, res) => {
    res.send('Create user');
});

// update user
router.put('/:id', (req, res) => {
    res.send('Update user');
});

// delete user
router.delete('/:id', (req, res) => {
    res.send('Delete user');
});

export default router;