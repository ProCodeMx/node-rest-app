//PUERTO
process.env.PORT = process.env.PORT || 3000;

//ENTORNO
process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

//BASE DE DATOS
let dbURL;

if (process.env.NODE_ENV == 'dev') {
    dbURL = 'mongodb://localhost:27017/cafe';
} else {
    dbURL = process.env.MONGO_URI;
}

process.env.MONGOURLDB = dbURL;

//VENCIMIENTO DEL TOKEN
process.env.TOKEN_EXPIRATION = process.env.TOKEN_EXPIRATION || '1d';

//SEED
process.env.TOKEN_SEED = process.env.TOKEN_SEED || 'rkt-29-04-2018';

//GOOGLE AUTH

process.env.CLIENT_ID = process.env.CLIENT_ID || "853004092159-8beaaseul8psf4jbff3ad8jnc50f3tp0.apps.googleusercontent.com";