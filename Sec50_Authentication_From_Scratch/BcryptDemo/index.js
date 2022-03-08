const bcrypt = require("bcrypt");

const hashPassword = async (pw) => {
  const salt = await bcrypt.genSalt(12);
  const hash = await bcrypt.hash(pw, salt);
  //const hash = await bcryp.hash(pw, 12)
  // console.log(salt);
  // console.log(hash);
};

hashPassword("monkey");

const login = async (pw, hashedPw) => {
  const result = await bcrypt.compare(pw, hashedPw);
  if (result) {
    console.log("LOGGED YOU IN! SUCCESFULL MATCH");
  } else {
    console.log("INCORRECT");
  }
};

login("monkey", "$2b$12$hlqFhcDU/6e5dUuUoST.leLHq0kM/avx3MNbOKFpeGZ29Oko.owK2");
