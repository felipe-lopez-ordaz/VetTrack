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

//user auth

app.set('trust proxy', 1) // trust first proxy
app.use(session({
  secret: 'cst336 csumb',
  resave: false,
  saveUninitialized: true
}))

function isAuthenticated(req, res, next){
    if(req.session.userAuthenticated)
        {
            next();
        }
        else
        {
            res.redirect("/");
        }
 }

//routes

app.get('/', (req, res) => {
    // first show home page, then show login page, then show dashboard
    res.render('home.ejs');
 });
 

app.get('/dashboard', isAuthenticated, (req, res) => {
    res.render("dashboard.ejs",{firstName:req.session.firstName});
});


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render('home.ejs');
}
);

app.post('/login', async (req, res) => {
    //using POST so info sent in body
    let username = req.body.username;
    let password = req.body.password;

    //let hashpassword = "$2b$10$MJQarc6ymwsojxTIUAAeUOEAms4mgxHRAehMwg6rqvE.SZGY9jmp2"

    let hashedPassword;
    let sql = 'SELECT * FROM admin WHERE username = ?';
    const [rows] = await conn.query(sql, [username]);
    if(rows.length > 0){ //username was found!
        hashedPassword = rows[0].password;
    }

    const match = await bcrypt.compare(password, hashedPassword);
    
    if(match){
        req.session.userAuthenticated = true;
        req.session.firstName = rows[0].firstName;
        res.render('home.ejs');
    }
    else{
        res.render('login.ejs',{"error":"Invalid username or password"});
    }
});


app.get('/visits', isAuthenticated, async(req, res) => {
    //change this to select visits
    let sql = "SELECT quoteId,quote,authorId,category,likes FROM quotes ORDER BY quoteId";
    const [rows] = await conn.query(sql);
    console.log(rows);
    res.render('visits.ejs', {rows});
});

//display the list of animals
app.get('/animals', isAuthenticated, async(req, res) => {
    // change this to select animals
    let sql = "SELECT authorId,firstName,lastName,dob,dod,biography,sex,portrait,country,profession FROM authors ORDER BY lastName";
    const [rows] = await conn.query(sql);
    console.log(rows);
    res.render('animals.ejs', {rows});
 });

app.get('/addVisits', isAuthenticated, async(req, res) => {
    //change this to select visits
    let sql = "SELECT authors.authorId, authors.firstName, authors.lastName FROM authors ORDER BY authors.lastName";
    let sql2 = "SELECT DISTINCT category FROM quotes";
    const [authors] = await conn.query(sql);
    console.log(authors);
    const [categories] = await conn.query(sql2);
    console.log(categories);
    res.render('addVisits.ejs', {authors,categories});
 }
);

app.post('/addVisits', isAuthenticated, async(req, res) => {
    // change this to select visits
    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let category = req.body.category;
    let likes = req.body.likes;
    console.log(quote, authorId,category,likes);
    let sql = `INSERT INTO quotes (quote, authorId,category,likes) VALUES (?, ?,?,?)`;
    let sqlParams = [quote, authorId, category, likes];
    const [rows] = await conn.query(sql, sqlParams);
    console.log(rows);
    res.redirect('/visits');
 });

app.get('/addAnimal', isAuthenticated, (req, res) => {
    res.render('addAnimal.ejs'); 
});


app.post('/addAnimal', isAuthenticated, async(req, res) => {
    // change this to select animals
    let fn = req.body.firstName;
    let ln = req.body.lastName;
    let dob = req.body.dob;
    let dod = req.body.dod;
    let sex = req.body.sex;
    let profession = req.body.profession;
    let country = req.body.country;
    let portrait = req.body.portrait;
    let bio = req.body.biography;
    console.log(fn, ln,dob,dod,sex, profession,country,portrait,bio);
    let sql = `INSERT INTO authors (firstName, lastName,dob,dod,sex,profession,country,portrait,biography) VALUES (?, ?,?,?,?,?,?,?,?)`;
    let sqlParams = [fn, ln,dob,dod,sex, profession,country,portrait,bio];
    const [rows] = await conn.query(sql, sqlParams);
    console.log(rows);
  res.redirect('/animals');
 });

 //GET
app.get('/editVisits', isAuthenticated, async (req, res) => {
    // change this to select visits
    let quoteId = req.query.quoteId;
    console.log(quoteId);
    
    let sql = "SELECT quoteId, quote, authorId, category, likes FROM quotes WHERE quoteId = ?";
    const [quoteInfo] = await conn.query(sql, [quoteId]);

    let sql2 = "SELECT authors.authorId, authors.firstName, authors.lastName FROM authors ORDER BY authors.lastName";
    const [authors] = await conn.query(sql2);
    
    let sql3 = "SELECT DISTINCT category FROM quotes";
    const [categories] = await conn.query(sql3);

    console.log(authors);
    console.log(categories);
    console.log(quoteInfo);

    // Pass all required data to the view
    res.render('editVisits.ejs', { quoteInfo, authors, categories });
});

app.get('/editAnimal', isAuthenticated, async(req, res) => {
    // change this to select animlas
    let authorId = req.query.authorId;
    console.log(authorId);
    let sql = "SELECT authorId,firstName,lastName,dob,dod,biography,sex,portrait,country,profession FROM authors WHERE authorId = ?";
    const [authorInfo] = await conn.query(sql, [authorId]);
    console.log(authorInfo);
    res.render('editAnimal.ejs',{authorInfo});
 });

 //POST
app.post('/editVisits',isAuthenticated, async(req, res) => {
    // change this to select visits
    let quoteId = req.body.quoteId;
    let quote = req.body.quote;
    let authorId = req.body.authorId;
    let category = req.body.category;
    let likes = req.body.likes;
    console.log(quoteId, quote, authorId, category, likes);
    let sql = `UPDATE quotes SET quote=?, authorId=?, category=?, likes=? WHERE quoteId=?`;
    //sqlParams order need to match sql statement
    let sqlParams = [quote, authorId, category, likes, quoteId,];
    const [quoteInfo] = await conn.query(sql, sqlParams);
    console.log(quoteInfo);
    res.redirect('/visits');
 });

app.post('/editAnimal', isAuthenticated, async(req, res) => {
    // change this to select animals
    let authorId = req.body.authorId;
    let fn = req.body.firstName;
    let ln = req.body.lastName;
    let dob = req.body.dob;
    let dod = req.body.dod;
    let bio = req.body.biography;
    let sex = req.body.sex;
    let country = req.body.country;
    let profession = req.body.profession;
    let portrait = req.body.portrait;
    console.log(authorId, fn, ln, dob, bio, sex, country, profession, portrait);
    let sql = `UPDATE authors SET firstName=?, lastName=?, dob=?, dod=?, biography=?, sex=?, portrait=?, country=?, profession=?  WHERE authorId=?`;
    //sqlParams order need to match sql statement
    let sqlParams = [fn, ln, dob, dod, bio, sex, portrait, country, profession, authorId];
    const [authorInfo] = await conn.query(sql, sqlParams);
    console.log(authorInfo);
    res.redirect('/animals');
 }
);

app.post('/deleteAnimal', isAuthenticated, async(req,res) => {
    let authorId = req.body.authorId;
    console.log(authorId);
    let sql = `DELETE FROM authors WHERE authorId = ?`;
    const[rows] = await conn.query(sql, [authorId]);
    console.log(rows);
    res.redirect('/animals');
}
);

app.get("/dbTest", async(req, res) => {
    let sql = "SELECT CURDATE()";
    const [rows] = await conn.query(sql);
    res.send(rows);
});

app.listen(3000, ()=>{
    console.log("Express server running")
})

 

 