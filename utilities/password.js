const bcrypt = require("bcryptjs");
const bcryptHash = (password) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(10, (er, salt) => {
      bcrypt.hash(password, salt, (err, hash) => {
        if (err) {
          reject(err);
        } else {
          resolve(hash);
        }
      });
    });
  });

const bcryptCompare = (hashedPassword, password) =>
  new Promise((resolve, reject) => {
    bcrypt.compare(password, hashedPassword, (err, res) => {
      if (err) {
        reject(err);
      } else {
        resolve(res);
      }
    });
  });

const hashPassword = async (password) => {
  if (!password) {
    return false;
  }
  const hash = await bcryptHash(password);
  return {
    hashedPassword: hash,
  };
};

const comparePassword = async (password, hashedPassword) => {
  if (!password) {
    return false;
  }
  const isMatch = await bcryptCompare(hashedPassword, password);
  return isMatch;
};

module.exports = { bcryptHash, bcryptCompare, hashPassword, comparePassword };
