import * as bcrypt from 'bcryptjs';

export const getHashedPassword = (password: string) => {
  const saltCount = 10;
  const hash = bcrypt.hashSync(password, saltCount);
  return hash;
};

export const passwordMatches = (password: string, hash: string) => {
  const unhash = bcrypt.compareSync(password, hash);
  return unhash;
};
