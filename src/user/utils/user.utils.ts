import * as bcrypt from 'bcrypt';
const { SALT_OR_ROUND } = process.env;

const hashPassword = async (password: string) => {
  const hash = await bcrypt.hash(password, SALT_OR_ROUND || 10);
  return hash;
};

export { hashPassword };
