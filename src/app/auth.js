import axios from "axios";

const getNewToken = (refreshToken) => {
  axios
    .post("http://14.169.150.105:3001/login/token", { refreshToken: refreshToken })
    .then((res) => {
        if(res.status == 200){
            localStorage.setItem("jwt", res.data.tokens.accessToken)
        }
    })
    .catch((e) => console.log(e));
};

module.exports = {
  getNewToken,
};
