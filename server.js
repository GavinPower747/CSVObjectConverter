var express = require("express");
var Promise = require("bluebird")
var mongoose = Promise.promisifyAll(require("mongoose"));

var app = express();
var port = process.env.PORT || 8081;
var objectRouter = express.Router();
var db = mongoose.connect("mongodb://xxxxx:xxxxx@ds031631.mongolab.com:31631/objectanalysis");


objectRouter.route("/ObjectAnalysis")
  .get(function(req, res){
    var testObject = {
      FieldA: "String",
      FieldB: "1",
      FieldC: "27/10/2015"
    };
    
    testObject = formatObject(testObject, 
      function(object) {
          res.status(200).send(object);
      }
    );
  });

app.use("/api", objectRouter);
  
  function formatObject(unformattedObject, callback)
  {
    var formattedObject = {};
    var keys = Object.keys(unformattedObject);
    var counter = 0;
    
    (function populateObject() {
        var property = keys[counter];
        var value = unformattedObject[property];
        if(typeof value != "undefined")
        {
          if(/\d+[/]\d+[/]\d+/g.exec(value)) // test for any date
          {
                var formattedDate;
                if(/\d{4}[/]\d{2}[/]\d{2}/.exec(value))
                {
                  var array = value.split("/");
                  formattedDate = new Date()
                  formattedDate.setYear(parseInt(array[0]));
                  formattedDate.setMonth(parseInt(array[1]));
                  formattedDate.setDate(parseInt(array[2]));
                }
                else if(/[0-3]?[0-9][/][0-1]?[0-9][/]\d{4}/.exec(value))
                {
                  var array = value.split("/");
                  formattedDate = new Date()
                  formattedDate.setYear(parseInt(array[2]));
                  formattedDate.setMonth(parseInt(array[1]));
                  formattedDate.setDate(parseInt(array[0]));
                }
                else if(/[0-1]?[0-9][/][0-3]?[0-9][/]\d{4}/.exec(value))
                {
                  var array = value.split("/");
                  formattedDate = new Date()
                  formattedDate.setYear(parseInt(array[2]));
                  formattedDate.setMonth(parseInt(array[0]));
                  formattedDate.setDate(parseInt(array[1]));
                }
                
                  Object.defineProperty(formattedObject, property, {
                    value: formattedDate,
                    configurable: true,
                    writable: true
                  });
          }
          else
          {
            if(isNaN(parseInt(value)))
            {
                Object.defineProperty(formattedObject, property, {
                  value: value,
                  configurable: true,
                  writable: true
                });
            }
            else {
              Object.defineProperty(formattedObject, property, {
                value: parseInt(value),
                configurable: true,
                writable: true
              });
            }
          }
        }
      
      if(keys.length == counter)
        callback(formattedObject);
      else
      {
        populateObject();
      }
    })();
    
    
    
    
  }
  
  app.use('/api', objectRouter);
    
  app.listen(port, function() { 
    console.log("Listening on " + port);
  });
