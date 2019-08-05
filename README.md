<h1> Measurement PSK-example</h1>

This an example on how to use PrivateSky System in order to save and read any measurement or computed data. Is dedicated to be used with any technology that can acces web-services as client.

The folder is located in psk-examples folder. Represents an Web API that can be uset to send/receive measured or computed values to privateSky Blockchain system.

The data is grouped as a collection of sites (measurement points) described as following JSON:
{ 
  "id":"generated_by_system",
  "time":"timestamp with the site creation time & date",
  "owner":"the owner of the site",
  "values":{
            "param 1":"value1",
            "param 2":"value2",
            "param 3":"value3",
            ......,
            },
  "user":"the user who updates the values"
}


The API has the following functionalities:

GET:
    /sites - creates a measurement site, having an owner, id and a timestamp of the creation date
           - returns a body with id of the site
          /sites/{id} - returns the information about the respective site {owner, timestamp}
          /sites/{id}/{parameter} - returns the value of the corresponding parameter
    /values 
          /{id} - returns a body with the latest values of the corresponding site
          /{id}/{paramater} - returns the value of the corresponding parameter
          
          
PUT:
    /sites - can be used to change the owner of a site. The request must contain the id and the new owner name: {"id":"xyz","owner":"newOwnerName"}
    /values - is used to add a new set of values for the same measurement site.
