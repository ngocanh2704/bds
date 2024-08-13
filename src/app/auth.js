import axios from "axios";

const getNewToken = (refreshToken) => {
  axios
    .post("https://api.connecthome.vn/login/token", { refreshToken: refreshToken })
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
