require("../bin/www");
var User = require('../database/user');
var request = require("request");

var base_url = "http://localhost:3002"; // In order to change this port, also change in npm test script at package.json


describe("Authentication", function() {
    describe("Signup", function() {

        it("Signup return status to 200 & JWT should be defined in response", function(done) {
            request.post({url:base_url+'/users/signup',
                    form: {email:'imdadul.huq3@gmail.com',password:'123'}},
                function(err,response,body){
                    expect(response.statusCode).toBe(200);
                    expect(JSON.parse(body).jwt).toBeDefined();
                    console.log(':-) Signup works!')
                    done();
                })
        });
    });
    describe("Login", function() {
        afterEach(function () { // Clean up signup data now.
            User.remove({},function (err) {
                if(err)
                    console.log('Data for authentication could not be removed.')
                console.log('Data for authentication has been removed.')
                exit(1)
            })
        })
        it("Login return status to be 200 & JWT should be defined in response", function(done) {
            request.post({url:base_url+'/users/login',
                    form: {email:'imdadul.huq3@gmail.com',password:'123'}},
                function(err,response,body){
                    expect(response.statusCode).toBe(200);
                    expect(JSON.parse(body).jwt).toBeDefined();
                    console.log(':-) Login works!')
                    done();
                })
        });
    });
});
