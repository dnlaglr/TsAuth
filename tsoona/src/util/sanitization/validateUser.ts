import validator from 'validator';
import bcrypt from 'bcrypt';

import User from '../../models/userModel';
import Pool from '../../models/poolModel';

interface UserInput {
  username: string | null;
  email: string;
  password: string;
  userPoolID: string;
}

export async function validateRegistration(input: UserInput) : Promise<{ isValid: boolean; errors?: string[]; }> {
  const errors: string[] = [];

  if (!input.email) {
    errors.push('Email is required.');
  } else if (!validator.isEmail(input.email)) {
    errors.push('Invalid email.');
  } else {
    const userExists = await User.findOne({ email: input.email, userPoolID: input.userPoolID });
    
    if (userExists) {
      errors.push('There is already an account associated with this email.')
    }
  }

  if (!input.password) {
    errors.push('Password is required.');
  } else if (!validator.isStrongPassword(input.password, {
    minLength: 8,
    minUppercase: 1,
    minLowercase: 1,
    minNumbers: 1,
    returnScore: false
  })) {
    errors.push('Invalid password. Password must be at least 8 characters long and include at least 1 uppercase letter, 1 lowercase letter, and 1 number.');
  }

  if (!input.userPoolID) {
    errors.push('User pool is required.');
  } else {
    const poolExists = await Pool.exists({ _id: input.userPoolID });

    if (!poolExists) {
      errors.push('Invalid user pool.')
    }
  }

  return {
    isValid: errors.length === 0,
    errors: errors.length > 0 ? errors : undefined
  }
}

export async function validateLogin(input: UserInput) {

  const user = await User.findOne({ email: input.email, userPoolID: input.userPoolID });
  const isValidPassword = await bcrypt.compare(input.password, user!.password);

  return {
    isValid: isValidPassword && user !== null,
    User: user
  };
}