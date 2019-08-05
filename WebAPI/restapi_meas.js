const http = require('http');
const port = 3000;
require('../../../../builds/devel/pskruntime');
require('../../../../builds/devel/httpinteract');
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

const interact = require("interact");
 const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

function getHandler(request, response) {
    //console.log("request URL = ",request.url);
    var url = request.url.split("/");
    console.log(url);
    // URL /sites
    if(url[1] === 'sites') {
        // Mesurement Site Creation
        if (url.length == 2) {
            var creationTime = Date();
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');
            ris.startSwarm("measurement_example.siteManagement", "create", creationTime, "cdamian").onReturn(function (err, siteId) {
                if (err) {
                    console.log(err);
                    response.end('ERR', err);
                } else {
                    console.log("New Site: ", siteId);
                    response.end('/' + siteId);
                }
            });
        }
        // Measurement Site Info (owner and timestamp)
        else if (url.length > 2 ) {
            var siteId = url[2];
            ris.startSwarm("measurement_example.siteManagement", "existingSite", siteId).onReturn(function (err, site) {
                if (err) {
                    response.end('Error!');
                } else {
                    console.log("ACCOUNT: valid", " Owner: ", site.owner, "Creation Timestamp: ", site.time);//valid?'valid!':'invalid!!',
                    if(url.length > 3) {
                        response.end(JSON.stringify(site[url[3]]));
                    }
                    else{
                        response.end(JSON.stringify(site));
                    }


                }
            });
        }
    }
    // URL /values
    else if(url[1] === 'values') {
                      // /values request without id
                      if (url.length == 2) {
                          console.log("Wrong request!");
                          response.end('Wrong request! Accepted /values/id');
                      }
                      // values request
                      else if (url.length > 2) {
                          var siteId = url[2];
                          ris.startSwarm("measurement_example.siteManagement", "getSiteValues", siteId).onReturn(function(err, values){
                              if(err){
                                  response.end('Error!');
                              }else{
                                  if(values===""){
                                      response.end("Nothing saved!");//
                                  }
                                  else {
                                      result = JSON.parse(values);
                                      if(url.length > 3) {
                                          console.log(" result: ", result.values[url[3]]);
                                          response.end(JSON.stringify(result.values[url[3]]));// + "\n" + result.timestamp);
                                      }
                                          console.log(" result: ", result);
                                      response.end(values);// + "\n" + result.timestamp);

                                  }
                           }
                          });
                      }
    }
    else{
       response.statusCode = 404;
       response.end('Nott found!');
    }
}

function postHandler(request, response) {


    var myId="cdamian";
    var result = 'initial';
/*
    if (request.url === '/sites') {
      request.on('data', function (data) {

            // const interact = require("interact");
            // const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');
            const dataIn = JSON.parse(data);
            var siteId = dataIn.id;
            myId = siteId;
            console.log("received id: ", siteId);

          ris.startSwarm("measurement_example.siteManagement", "getSiteValues", siteId).onReturn(function(err, values){
              if(err){
                  response.end('Error!');
              }else{
                  console.log("ACCOUNT: valid", " Values: ",values);//valid?'valid!':'invalid!!',

                  result = JSON.parse(values);
                  console.log(" result: ",result);
                  response.end(values);// + "\n" + result.timestamp);


              }
          });

        });

      request.on('end', function () {
            console.log("id(end)=", result);
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');

        });

    }else if (request.url === '/values') {
        request.on('data', function (data) {

            // const interact = require("interact");
            // const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');
            const dataIn = JSON.parse(data);
            var siteId = dataIn.id;
            myId = siteId;
            console.log("received id: ", siteId);

            ris.startSwarm("measurement_example.siteManagement", "getSiteValues", siteId).onReturn(function(err, values){
                if(err){
                    response.end('Error!');
                }else{
                    console.log("ACCOUNT: valid", " Values: ",values);//valid?'valid!':'invalid!!',

                    result = JSON.parse(values);
                    console.log(" result: ",result);
                    response.end(values);// + "\n" + result.timestamp);


                }
            });

        });

        request.on('end', function () {
            console.log("id(end)=", result);
            response.statusCode = 201;
            response.setHeader('Content-Type', 'application/json');

        });

    }
    else {
        response.statusCode = 404;
        response.end('Nott found!');
    }
    */

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
                // const interact = require("interact");
                // const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');

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

    }

    else if (request.url === '/values') {
        request.on('data', function (data) {
            const dataIn = JSON.parse(data);
           // dataIn.values.newProp = 'timestamp';

             dataIn.timestamp =Date();
            //console.log(dataIn);

            if(!dataIn.hasOwnProperty('id') || !dataIn.hasOwnProperty('values')){
                response.statusCode = 402;
                response.end("Request must be id + owner!");
            }
            else {
                // const interact = require("interact");
                // const ris = interact.createRemoteInteractionSpace('testRemote', 'http://127.0.0.1:8080', 'local/agent/example');


                var siteId = dataIn.id;
                delete dataIn.id;
                var newValues = JSON.stringify(dataIn);

                console.log("received id: ", siteId, " newValues: ", newValues);

                ris.startSwarm("measurement_example.siteManagement", "updateSiteValues", siteId, newValues).onReturn(function (err, data) {
                    if (err) {
                        response.end('Error!');
                    } else {
                        console.log("Site updated!", data);//valid?'valid!':'invalid!!',
                        response.statusCode = 200;
                        response.end('Values updated');
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
    console.log(`server is listening on ${port}`);

});
