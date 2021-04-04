require('dotenv').config()
const express = require('express');
const https =  require('https');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(req, res){
    res.sendFile(__dirname + "/index.html");
    
})

//catch the post form created on index.html

app.post('/', function(req, res){

    const query = req.body.cityName;
    const apiKey = process.env.API_KEY;
    const units = 'metric';
    const url = 'https://api.openweathermap.org/data/2.5/weather?q='+ query +'&units=' + units + '&appid=' + apiKey;

    https.get(url, function(response){
        //shows the http response
        console.log(response.statusCode);

        //get the json data and parse it
        response.on('data', function(data){
            const weatherData = JSON.parse(data);
            console.log(weatherData);

            //get certain informaion from the json object
            const temp = weatherData.main.temp;
            const weathrDescription = weatherData.weather[0].description;
            const icon = weatherData.weather[0].icon;
            imageURL ='http://openweathermap.org/img/wn/' + icon +'@2x.png';
            
            res.write('<p>The weather is currently ' +  weathrDescription + '</p>');
            res.write('<h1>It is ' + temp + '&deg degrees Celcius in ' + query + '<h1>');
            
            res.write('<img src=' + imageURL + '>'); 
            res.send();
        })
    });
})



app.listen(3000, function(){
    console.log('server is running');
});