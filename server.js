const express = require('express');

const {Client} = require('pg');
const {connection_string} = require('./config.json');
const client = new Client({
    connectionString: connection_string
});
const port = 3000;

client.connect();
const app = express();

app.use(express.json());

app.get('/aircraft', (req, res, next)=>{
    client.query(`SELECT * FROM aircraft`)
    .then((result)=>{
        res.send(result.rows);
    })
    .catch((error)=>{
        next({status:400, message:"Bad Request"});
    })
});

app.get('/aircraft/:id', (req, res, next)=>{
    client.query(`SELECT * FROM aircraft WHERE aircraft_id = ${req.params.id}`)
    .then((result)=>{
        res.send(result.rows);
    })
    .catch((error)=>{
        next({status:400, message:"Bad Request"});
    })
});

app.post('/aircraft', (req, res, next)=>{
    let aircraft = {};
    aircraft.name = req.body.name;
    aircraft.type = req.body.type;
    aircraft.topSpeed = req.body.topSpeed;

    if(aircraft.name === undefined || aircraft.type === undefined || aircraft.topSpeed === undefined){
        next({status:400, message:"Bad Request"});
        return;
    }

    client.query(`INSERT INTO aircraft(aircraft_name, aircraft_type, top_speed) VALUES ('${aircraft.name}','${aircraft.type}','${aircraft.topSpeed}')`)
    .then(()=>{
        res.send(aircraft);
    })
    .catch((error)=>{
        next({status: 400, message:"Bad Request"})
    })
});

app.delete('/aircraft/:id', (req, res, next)=>{
    client.query(`SELECT * FROM aircraft WHERE aircraft_id=${req.params.id}`)
    .then((result)=>{
        client.query(`DELETE FROM aircraft WHERE aircraft_id=${req.params.id}`)
        .then(()=>{
            res.send(result.rows);
        })
        .catch((error)=>{
            next({status:400, message:"Bad Request"});
        })
    })
    .catch((error)=>{
        next({status:400, message:"Bad Request"});
    })
});

app.patch('/aircraft/:id', (req, res, next)=>{
    let query = "";
    let aircraft = {};
    aircraft.aircraft_name = req.body.name;
    aircraft.aircraft_type = req.body.type;
    aircraft.top_speed = req.body.topSpeed;

    let first = true;
    for(let key in aircraft){
        if(aircraft[key] !== undefined){
            if(first){
                query += ` ${key}='${aircraft[key]}' `;
                first = false;
            }else{
                query += `, ${key}='${aircraft[key]}' `;
            }
        }
    }

    console.log(query)
    

    client.query(`UPDATE aircraft SET ${query} WHERE aircraft_id=${req.params.id}`)
    .then(()=>{
        client.query(`SELECT * FROM aircraft WHERE aircraft_id=${req.params.id}`)
        .then((result)=>{
            res.send(result.rows);
        })
        .catch((error)=>{
            next({status:400, message:"Bad Request"});
            return;
        })
    })
    .catch({status:400, message:"Bad Request"})
});



app.use((err, req, res, next)=>{                //error handler
    res.status(err.status).send(err.message);
});



app.listen(port, ()=>{
    console.log(`Listening on port ${port}`);
    console.log(connection_string);
});