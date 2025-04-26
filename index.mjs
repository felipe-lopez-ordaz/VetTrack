import express from 'express';
import mysql from 'mysql2/promise';
import bcrypt from 'bcrypt';
import session from 'express-session';


const app = express();

app.set('view engine', 'ejs');
app.use(express.static('public'));

//for Express to get values using POST method
app.use(express.urlencoded({extended:true}));

//setting up database connection pool
const pool = mysql.createPool({
    host: "felipe-lopez-ordaz.site",
    user: "felipelo_webuser",
    password: "cst-336",
    database: "felipelo_quotes",
    connectionLimit: 10,
    waitForConnections: true
});
const conn = await pool.getConnection();

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'cst3336 csumb',
  resave: false,
  saveUninitialized: true,
}))


app.get('/', async(req, res) => {
    res.render('login.ejs')
});


app.post('/login', async (req, res) => {
    let username = req.body.username;
    let password = req.body.password;

    let hashedPassword;
    //let hashedPassword = "$2b$10$AmamkEJ5T2Dl9G6ZsoyU9eYNnGD1nYZoTS3gAHX0iNp8ctsZJ/uPW";

    let sql = `SELECT *
               FROM admin
               WHERE username = ?`;
     const [rows] = await conn.query(sql, [username]); 
     if (rows.length > 0) { //username was found!
        hashedPassword = rows[0].password;
     }          

    const match = await bcrypt.compare(password, hashedPassword);

    if (match) {
        req.session.userAuthenticated = true;
        res.render('dashboard.ejs', {"username": username});
    } else {
        res.render('login.ejs', {"error":"Wrong credentials!"})
    }
 });

app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});


app.get('/dashboard', async(req, res) => {

    if(req.session.userAuthenticated){
        res.render('/dashboard')
    }
    else{
        res.redirect("/");
    }
});





app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.render (rows);
});//dbTest

app.listen(3000, ()=>{
    console.log("Express server running")
})