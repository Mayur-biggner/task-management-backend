import createError from 'http-errors';
import express, { json, urlencoded } from 'express';
import { dirname, join } from 'path';
import cookieParser from 'cookie-parser';
import logger from 'morgan';
import dotenv from "dotenv";
import cors from "cors";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import { nullByteCheck } from "./middlewares/nullByteDetection.js";
import xmlparser from "express-xml-bodyparser";
import { handleXmlParsingErrors } from "./middlewares/xxeDetection.js";
import indexRouter from './routes/index.js';
import { fileURLToPath } from 'url';
import connectMongoDB from './connections/db/mongoose.js';
import seedRoles from './connections/seeders/roles.seeder.js';
import seedPermissions from './connections/seeders/permissions.seeder.js';
import seedRolePermissions from './connections/seeders/role_has_permissions.seeder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


var app = express();
dotenv.config();

app.use(logger('dev'));
app.use(json());
app.use(urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(join(__dirname, 'public')));

// Middleware
app.use(cors());
app.use(helmet({
    crossOriginResourcePolicy: false,
    crossOriginEmbedderPolicy: false,
    crossOriginOpenerPolicy: false,
}));              // Secure headers
app.use(xmlparser({
    explicitArray: false,
    normalizeTags: true,
    trim: true,
    xmlParseOptions: {
        disallowEntities: true, // Explicitly disable entities
        rejectUnauthorized: true
    }
}));
app.use(nullByteCheck);       // Null byte detection
// Middleware to handle XML parsing errors
app.use(handleXmlParsingErrors)
// Middleware to handle JSON parsing errors
app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
        return res.status(400).json({ error: "Invalid JSON format." });
    }
    next(err);
});

const limiter = rateLimit({
    windowMs: 5 * 1000,
    max: 5,
    message: { error: "Too many requests, try again later." },
});

app.use('/api', indexRouter);

// catch 404 and forward to error handler
// Fallback 404
app.use((req, res) => {
    return res.status(404).json({ error: "Not Found" });
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

connectMongoDB()
    .then(() => {
        seedRoles();
        seedPermissions();
        seedRolePermissions();
        console.log("MongoDB connected successfully");
    })
    .catch((error) => {
        console.error("MongoDB connection error:", error);
    });

export default app;
