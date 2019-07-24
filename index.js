module.exports = $$.library(function(){
    require("./assets/Token.js");
    require("./assets/Account.js");

    require("./transactions/tokenManagement.js");
    require("./transactions/accountManagement.js");
});