const http = require('http');
const port = 3000;
require('../../../builds/devel/pskruntime');
require('../../../builds/devel/httpinteract');
require('callflow');


const requestHandler = (request, response) => {
    switch(request.method) {
        case 'GET':
            getHandler(request, response);
            break;
        case 'POST':
            postHandler(request, response);
            break;
     }
};

function getHandler(request, response) {
    if (request.url === '/swarm') {
            const interact = require("interact");
            const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

            //var tokenName = "TOKEN_NAME_1";
            var tokenSymbol = "Voltage";

        response.statusCode = 201;
        response.setHeader('Content-Type', 'application/json');




            console.log("OK1");
            ris.startSwarm("measurement_example.accountManagement", "create", tokenSymbol, "user_id_from_classic_database").onReturn(function (err, accountId) {
                if (err) {
                    console.log(err);
                   response.end('ERR', err);

                } else {
                    console.log("New Account", accountId);
                    response.end('doneGET, id: ' + accountId);
                }
            });



        }
    else{
        response.statusCode = 404;
        response.end('Nott found!');
}
    }

function postHandler(request, response) {


    var myId="cdamian";
    var result = '';

    if (request.url === '/account') {
      request.on('data', function (data) {

            const interact = require("interact");

            const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

            const dataIn = JSON.parse(data);

            var accountId = dataIn.id;

            myId = accountId;

            console.log("received id: ", accountId);



            ris.startSwarm("measurement_example.accountManagement", "existingAccount", accountId).onReturn(function(err, valid){
                if(err){
                    console.log(err);

                }else{
                    console.log("ACCOUNT: ", valid?'valid!':'invalid!!');
                    result = valid;

                }
            });




        });

        request.on('end', function () {
            console.log("id(end)=", myId);
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            response.end(JSON.stringify(myId), result);
        });
    } else {
        response.statusCode = 404;
        response.end('Nott found!');
    }
}


const server = http.createServer(requestHandler);

server.listen(port, (err) =>{
    if (err) {
        return console.log('something bad happened', err)
    }
    console.log(`server is listening on ${port}`)
});
