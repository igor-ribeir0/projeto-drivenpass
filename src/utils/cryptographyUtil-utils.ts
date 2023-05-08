import Cryptr from 'cryptr';

const cryptr = new Cryptr("top_secret");

function encrypt(password: string) {
  return cryptr.encrypt(password);
}

function decrypt(encryptedPassword: string) {
  return cryptr.decrypt(encryptedPassword);
}

export const cryptographyUtil = {
  encrypt,
  decrypt,
};