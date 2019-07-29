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
        case 'PUT':
            putHandler(request, response);
            break;
     }
};

function getHandler(request, response) {
    if (request.url === '/sites') {
            const interact = require("interact");
            const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

            //var tokenName = "TOKEN_NAME_1";
            var tokenSymbol = "Voltage";

        response.statusCode = 201;
        response.setHeader('Content-Type', 'application/json');




            console.log("OK1");
            ris.startSwarm("measurement_example.siteManagement", "create", tokenSymbol, "cdamian").onReturn(function (err, siteId) {
                if (err) {
                    console.log(err);
                   response.end('ERR', err);

                } else {
                    console.log("New Account", siteId);
                    response.end('doneGET, id: ' + siteId);
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
    var result = 'initial';

    if (request.url === '/sites') {
      request.on('data', function (data) {

            const interact = require("interact");
            const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');
            const dataIn = JSON.parse(data);
            var siteId = dataIn.id;
            myId = siteId;
            console.log("received id: ", siteId);

            ris.startSwarm("measurement_example.siteManagement", "existingSite", siteId).onReturn(function(err, owner){
                if(err){
                    response.end('Error!');
                }else{
                    console.log("ACCOUNT: valid", " Owner: ",owner);//valid?'valid!':'invalid!!',
                    result = owner;

                    response.end(result);
                }
            });

        });


      request.on('end', function () {
            console.log("id(end)=", result);
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');

        });

    } else {
        response.statusCode = 404;
        response.end('Nott found!');
    }
}

function putHandler(request, response) {

    if (request.url === '/sites') {
        request.on('data', function (data) {
            const dataIn = JSON.parse(data);
            //console.log(dataIn);

            if(!dataIn.hasOwnProperty('id') || !dataIn.hasOwnProperty('owner')){
                response.statusCode = 402;
                response.end("Request must be id + owner!");
            }
            else {
                const interact = require("interact");
                const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

                var siteId = dataIn.id;
                var newOwner = dataIn.owner;

                console.log("received id: ", siteId, " newOwner: ", newOwner);

                ris.startSwarm("measurement_example.siteManagement", "updateSiteProperty", siteId, 'test', newOwner).onReturn(function (err, data) {
                    if (err) {
                        response.end('Error!');
                    } else {
                        console.log("Site updated!", data);//valid?'valid!':'invalid!!',
                        response.statusCode = 200;
                        response.end('owner updated');
                    }
                });

            }
        });

        //
        // request.on('end', function () {
        //     console.log("id(end)=", result);
        //     response.statusCode = 201;
        //     response.setHeader('Content-Type', 'application/json');
        //
        // });

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
