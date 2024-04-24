import { Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { validateLogin, validateRegistration } from '../util/sanitization/validateUser';
import { createToken } from '../util/tokens/tokenUtil';

import User from '../models/userModel';
import Pool from '../models/poolModel';

export async function registerUser(request: Request, response: Response) {
  try {
    const { username, email, password, userPoolID } = request.body;
    const { isValid, errors } = await validateRegistration(request.body);

    if (isValid) {
      const hashedPassword = await bcrypt.hash(password, 10);

      const newUser = new User({
        username,
        email,
        password: hashedPassword,
        userPoolID: userPoolID
      });

      await newUser.save();
      await Pool.updateOne(
        { _id: userPoolID }, 
        { $push: { users: newUser._id } }
      )

      const token = createToken({ userID: newUser._id, email, userPoolID });

      return response.status(201).json({
        token,
        user: { userID: newUser._id, username: username, email: newUser.email, }
      });

    } else {
      return response.status(400).json({
        message: 'Invalid user input',
        errors: errors
      });
    }
  } catch (err) {
    console.log(err)
    return response.status(500).json({
      message: 'Internal server error'
    })
  }
}

export async function loginUser(request: Request, response: Response) {
  try {
    const { email, userPoolID } = request.body;
    const { isValid, User } = await validateLogin(request.body);
    
    if (isValid) {
      const token = createToken({ userID: User!._id, email, userPoolID });
      
      return response.status(201).json({
        token,
        user: { userID: User!._id, email }
      });
    } else {
      return response.status(401).json({
        message: 'Invalid credentials'
      });
    }

  } catch(err) {
    console.log(err)
    return response.status(500).json({
      message: 'Internal server error'
    });
  }
}