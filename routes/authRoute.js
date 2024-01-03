import express from 'express';
import  {createUser, login, getAllUsers, getUser, deleteUser, updateUser, handleRefreshToken, logout}  from '../controller/userController.js';
import { authMiddleware, isAdmin } from '../middlewares/authMiddleware.js';
const router =express.Router();


router.post('/register',createUser);
router.post('/login',login);
router.get('/logout',logout);

router.get('/getUsers',getAllUsers);
router.get("/refresh", handleRefreshToken)
 
router.get('/:id',authMiddleware,isAdmin,  getUser);
router.delete('/:id',deleteUser);
router.put('/update',authMiddleware,   updateUser);





export {router};