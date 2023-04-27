const crypto = require('crypto');


function encryptScore(scoreString){
  // Generate a random secret key
  const secretKey = crypto.randomBytes(32);
  
  // Generate a random initialization vector
  const iv = crypto.randomBytes(16);

  // Encrypt the data on the first computer
  const cipher = crypto.createCipheriv('aes-256-cbc', secretKey, iv);
  let encrypted = cipher.update(scoreString, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  return [encrypted, secretKey.toString('hex'), iv.toString('hex')];
}

function decryptScore(scoreString, secret, vect){

  const decipher = crypto.createDecipheriv('aes-256-cbc', 
                                            Buffer.from(secret, 'hex'),
                                            Buffer.from(vect, 'hex'));

  let decrypted = decipher.update(scoreString, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  // The decrypted data is returned as a string
  return decrypted;
}

exports.encryptScore = encryptScore;
exports.decryptScore = decryptScore;







//TESTING
/*
encryptedMessage = encryptScore("Hello-World"); 
console.log(encryptedMessage);

decryptedMessage = decryptScore(encryptedMessage[0],encryptedMessage[1],encryptedMessage[2]);
console.log(decryptedMessage);
*/



