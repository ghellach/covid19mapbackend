const express = require('express');
const app = express();
const dotenv = require('dotenv');
const axios = require('axios');
const cors = require('cors');

dotenv.config();

app.listen(3000, () => {
    console.log('App up and running');
});

app.use(cors());


app.post('/general', async (req, res) => {
    const reqOptions = {
        method: 'GET',
        url: 'https://coronavirus-monitor.p.rapidapi.com/coronavirus/worldstat.php',
        data: '',
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPIKEY
        },
        json: true
    };


    const request = await axios(reqOptions).then(function (response) {
        res.json(response.data);
    })
});

app.post('/all', async (req, res) => {
    const reqOptions = {
        method: 'GET',
        url: 'https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php',
        data: '',
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPIKEY
        },
        json: true
    };

    const countries = require('./data/countries');

    const request = await axios(reqOptions).then(function (response) {
        response.data.countries_stat.forEach(row => {
            countries.forEach(country => {
                if(country.name.toLowerCase() === row.country_name.toLowerCase()) {
                    row['color'] = 'red';
                    row['lat'] = country.latlng[0].toFixed(10);
                    row['lng'] = country.latlng[1].toFixed(10);
                    row['cases'] = row['cases'].replace(",", "");
                    if(row.cases < 0) {
                        row['radius'] = 4;
                    }
                    else if(row.cases < 30) {
                        row['radius'] = 5;
                    }
                    else if(row.cases < 100) {
                        row['radius'] = 8
                    }
                    else if(row.cases < 150) {
                        row['radius'] = 10;
                    }
                    else if(row.cases < 200) {
                        row['radius'] = 15;
                    }
                    else if(row.cases < 500) {
                        row['radius'] = 20;
                    }
                    else if(row.cases < 800) {
                        row['radius'] = 25;
                    }
                    else if(row.cases < 1000) {
                        row['radius'] = 30;
                    }
                    else if(row.cases < 10000) {
                        row['radius'] = 40;
                    }
                    else if(row.cases < 20000) {
                        row['radius'] = 45;
                    }
                    else{
                        row['radius'] = 60;
                    }
                }
            })
        })
        res.json(response.data);
    })
});

app.post('/one/:country', (req, res) => {
    const reqOptions = {
        method: 'GET',
        url: 'https://coronavirus-monitor.p.rapidapi.com/coronavirus/cases_by_country.php',
        data: '',
        headers: {
            "x-rapidapi-host": "coronavirus-monitor.p.rapidapi.com",
            "x-rapidapi-key": process.env.RAPIDAPIKEY
        },
        json: true
    };


    axios(reqOptions).then(function (response) {
        response.data['countries_stat'].forEach(row => {
            if(row.country_name.toLowerCase() === req.params.country.toLowerCase()) {
                return res.json(row);
            }
        });
        res.status(400).json({
            err: 'country not found or no data available'
        });
    });

});
