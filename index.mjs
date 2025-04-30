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
    host: "samjacobs.site",
    user: "samjacob_vetFinal",
    password: "cst-336",
    database: "samjacob_vettrack",
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
        res.render('dashboard.ejs', { username: req.session.username });
});


app.get("/logout", (req, res) => {
    req.session.destroy();
    res.render('home.ejs');
}
);

app.get('/login', (req, res) => {
    res.render('login.ejs'); // Render the login page
});

app.post('/login', async (req, res) => {
    //using POST so info sent in body
    let username = req.body.username;
    let password = req.body.password;
    console.log("Here: "+username, password);

    //let hashpassword = "$2b$10$MJQarc6ymwsojxTIUAAeUOEAms4mgxHRAehMwg6rqvE.SZGY9jmp2"

    let hashedPassword;
    let sql = `SELECT * FROM user WHERE username = ?`;
    const [rows] = await conn.query(sql, [username]);
    if(rows.length > 0){ //username was found!
        hashedPassword = rows[0].password_hash;
        console.log("Found: "+hashedPassword);
    }
    console.log("Hashed: "+hashedPassword);

    const match = await bcrypt.compare(password, hashedPassword);
    
    if(match){
        req.session.userAuthenticated = true;
        req.session.username = rows[0].username;
        console.log("User: "+req.session.username);
        //req.session.firstName = rows[0].firstName;s
        //res.render('dashboard.ejs');
        res.redirect('/dashboard');
    }
    else{
        res.render('login.ejs',{"error":"Invalid username or password"});
    }
});

app.get('/visits', isAuthenticated, async(req, res) => {
    //change this to select visits
    let sql = `SELECT visit_id,visit_date,reason,animal_id FROM visit`;
    const [rows] = await conn.query(sql);
    console.log(rows);
    res.render('visits.ejs', {rows});
});

//display the list of animals
app.get('/animals', isAuthenticated, async(req, res) => {
    // change this to select animals
    let sql = `SELECT name, breed,dob,owner_id,animal_id FROM animal`;
    const [animals] = await conn.query(sql);
    console.log(animals);
    res.render('animals.ejs', {animals});
 });

app.get('/addVisits', isAuthenticated, async(req, res) => {
    //change this to select visits
    let sql = 'SELECT * FROM animal'
    const [animals] = await conn.query(sql);

    res.render('addVisits.ejs', {animals})
 }
);

app.post('/addVisits', isAuthenticated, async(req, res) => {
    let animal = req.body.animal;
    let date = req.body.date;
    let reason = req.body.reason;



    let sql = `INSERT INTO visit (animal_id,visit_date,reason) VALUES (?, ?,?)`;
    let sqlParams = [animal, date, reason];
    const [rows] = await conn.query(sql, sqlParams);

    res.redirect('/visits');
 });

app.get('/addAnimal', isAuthenticated, async(req, res) => {
    let sql = `SELECT * FROM owner`;
    const [owners] = await conn.query(sql);
    res.render('addAnimal.ejs', {owners}); 
});


app.post('/addAnimal', isAuthenticated, async(req, res) => {
    // change this to select animals
    let name = req.body.name;
    let breed = req.body.breed;
    let dob = req. body.dob;
    let owner = req.body.owner;
 
    let sql = `INSERT INTO animal (name, breed, dob, owner_id) VALUES (?)`;
    let sqlParams = [[name, breed, dob, owner]];
    const [rows] = await conn.query(sql, sqlParams);

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

 

 