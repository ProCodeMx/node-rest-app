//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS

let dbURL;

if (process.env.NODE_ENV == 'dev') {
    dbURL = 'mongodb://localhost:27017/cafe';
} else {
    dbURL = 'mongodb://vicksel:manuel93@ds119688.mlab.com:19688/udemy-nodejs';
}

process.env.MONGOURLDB = dbURL;