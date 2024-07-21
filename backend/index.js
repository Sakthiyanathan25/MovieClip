const db = require("./db");
const express= require("express");
const cors = require('cors');
const multer=require('multer')
const path = require('path');

const bodyParser = require('body-parser');
const dotenv=require('dotenv').config()
var cloudinary = require('cloudinary').v2;
 
const app=express();

 const storage = multer.diskStorage({
    destination: (req, file, cb) => {

        cb(null, path.resolve(__dirname, 'uploads/'));
    },
    filename: (req, file, cb) => {
        
        cb(null,"X"+ Date.now() + '-' + file.originalname);
    }
});

const upload=multer({storage:storage})


app.use((req, res, next) => {
    res.setHeader('Permissions-Policy', 'ch-ua-form-factor=(none)');
    next();
  });
const bcrypt= require("bcrypt")
const jwt =require("jsonwebtoken")

// cloudinary config
cloudinary.config({ 
    cloud_name: process.env.CLOUDINY_API_NAME, 
    api_key: process.env.CLOUDINY_API_KEY, 
    api_secret: process.env.CLOUDINY_API_SECRET
  });

app.use(cors());
app.use(express.json());

db.query("SELECT 1")
    .then(data=>{
        console.log("db  connection succeeded")
        console.log(process.env.PORT)
        app.listen(process.env.PORT,()=>{console.log("Server is Running in localhost:5001")}
        )
    })
    .catch(err=> console.log(`db Connection Failed .\n` +err))
  



//Users 

const UserAuthorization =(req,res,next)=>{
    let jwtToken;
    const autHeader = req.headers["authorization"]
    console.log(autHeader)
    
    if (autHeader!==undefined){
        jwtToken=autHeader.split(" ")[1]
    }
    else{
        res.status(401).send({errMsg:"Invalid Jwt Token"})
    }
    if(jwtToken !== undefined){
        jwt.verify(jwtToken,"MY_SECRET_TOKEN",async(err,payload)=>{
            if (err) {
                res.status(401);
                res.send("Invalid JWT Token");
              } else {
                req.username = payload.username;
                console.log(req.username)
                next();}
        })
    }
}

app.post("/register/", async (req, res) => {
    const { username, password } = req.body;
    const getQuery = `SELECT * FROM user WHERE username='${username}'`;
        // Execute query to get user from database
        
        
    try{
        const [result,fields] = await db.query(getQuery)
        console.log(result)
        // Check if user already exists
        if (result.length>0) {
            res.status(400).send({errMsg:"User Already exist"});
        } else {
            // Check password length
            if (password.length < 6) {
                res.status(400).send({errMsg:"Password is too short"});
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 15);
                // Insert user into database
                const registerQuery = `INSERT INTO user(username,password) values('${username}','${hashedPassword}')`;
                await db.query(registerQuery);
                res.status(200).send({success:"User registered successfully"});
            }
        
        }
    }catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }
}

)

app.post("/login/",async(req,res)=>{
    const { username, password } = req.body;

      const getQuery = `SELECT * FROM user WHERE username='${username}'`;
        // Execute query to get user from database
        
        
    try{
        const [result,fields] = await db.query(getQuery)
     


        if (result.length===0) {
            res.status(400);
            res.send({errMsg:"Invalid User"});
        } else {
            // Check password 
              const checkPassword= await bcrypt.compare(password,result[0].password)
              if (checkPassword===true){

                const payload={username:username}
                const jwtToken=jwt.sign(payload,"MY_SECRET_TOKEN")
                res.send({jwtToken})

              }else{
                res.status(400).send({errMsg:"Invalid Username and Password"});
              }

            }
        
        }
    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }

})

app.get("/",UserAuthorization,async(req,res)=>{
    const {username}=req
    
  try{
    const [result,fields] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
    const userid=result[0].user_id
    const [allmovieresult,allMovieFiels]=await db.query(`SELECT m.*,
    COUNT(l.like_id) AS total_likes,
    CASE WHEN liked_movies.movie_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
FROM movie m
LEFT JOIN likes l ON m.movie_id = l.movie_id
LEFT JOIN (
 SELECT DISTINCT movie_id
 FROM likes
 WHERE user_id = '${userid}'
) AS liked_movies ON m.movie_id = liked_movies.movie_id
GROUP BY m.movie_id;`)
    const [popularMoviereuslt,popularMovieFields]=await db.query(`
    SELECT m.*,
       COUNT(l.like_id) AS total_likes,
       CASE WHEN liked_movies.movie_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
FROM movie m
LEFT JOIN likes l ON m.movie_id = l.movie_id
LEFT JOIN (
    SELECT DISTINCT movie_id
    FROM likes
    WHERE user_id = '${userid}'
) AS liked_movies ON m.movie_id = liked_movies.movie_id
WHERE m.imdb_rating >= 8.0
GROUP BY m.movie_id;

    `)
    
    res.send({allmovies:allmovieresult,popularMovie:popularMoviereuslt})
  }
    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }
})

app.get("/movies/:id", UserAuthorization, async (req, res) => {
    const { id } = req.params;
    const { username } = req;

    try {
        const [userResult, userFields] = await db.query(
            `SELECT user_id FROM user WHERE username = ?`, [username]
        );
        const userid = userResult[0].user_id;

        const [movieResult, movieFields] = await db.query(`
        SELECT m.*,
        COUNT(l.like_id) AS total_likes,
        CASE WHEN l.movie_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked,
        CASE WHEN w.movie_id IS NOT NULL THEN TRUE ELSE FALSE END AS in_watchlist
 FROM movie m
 LEFT JOIN likes l ON m.movie_id = l.movie_id AND l.user_id = ?
 LEFT JOIN watch_list w ON m.movie_id = w.movie_id AND w.user_id = ?
 WHERE m.movie_id = ?
 GROUP BY m.movie_id;
        `, [userid,userid, id]);

        const [genre, genrefield] = await db.query(
            `SELECT type FROM genre WHERE movie_id = ?;`, [id]
        );

        const [stars, starsfield] = await db.query(
            `SELECT star_name , star_img_url FROM stars WHERE movie_id = ?`, [id]
        );

        const [director, directorfield] = await db.query(
            `SELECT director_name , director_img_url FROM director WHERE movie_id = ?`, [id]
        );

        const [writer, writterfield] = await db.query(
            `SELECT writter_name FROM writter WHERE movie_id = ?`, [id]
        );

        const [musicdirector, musicdirectorFields] = await db.query(
            `SELECT music_dir_name, music_dir_img_url FROM music_director WHERE movie_id = ?`, [id]
        );

        const [language, languageField] = await db.query(
            `SELECT language, category FROM language WHERE movie_id = ?`, [id]
        );

        const [relatedVideos, relatedVideosFields] = await db.query(
            `SELECT video_name, video_url,video_url_img FROM related_video WHERE movie_id = ?`, [id]
        );

        const [ott, ottFields] = await db.query(
            `SELECT ott_img_url, ott_url FROM ott_platform WHERE movie_id = ?`, [id]
        );

        res.send({
            movieResult: movieResult,
            genre: genre,
            stars: stars,
            director: director,
            writer: writer,
            musicdirector: musicdirector,
            ott: ott,
            relatedVideos: relatedVideos,
            language: language
        });
    } catch (err) {
        res.status(500).send({ errMsg: `Server Error : ${err}` });
    }
});

app.post('/movies/:movieId/likes', UserAuthorization, async (req, res) => {
    const { movieId } = req.params;
    const {username}=req
    try {
        const [result,fields] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
        const userid=result[0].user_id
      const existingLike = await db.query(`SELECT * FROM likes WHERE movie_id = ${movieId} AND user_id = ${userid}`);
      
      if (existingLike[0].length > 0) {
       
        await db.query(`DELETE FROM likes WHERE movie_id =  ${movieId} AND user_id =  ${userid}`);
        res.status(200).send({  liked: false });
      } else {
        
        await db.query(`INSERT INTO likes (movie_id, user_id) VALUES (  ${movieId}, ${userid} )`);
        res.status(200).send({ liked: true });
        console.log("true")
      }
    } catch (error) {
      console.error('Error handling like:', error);
      res.status(500).send({ error: 'Server error' });
    }
});

  app.post('/movies/:movieId/watchList', UserAuthorization, async (req, res) => {
    const { movieId } = req.params;
    const {username}=req
    try {
        const [result,fields] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
        const userid=result[0].user_id
      const existingLike = await db.query(`SELECT * FROM watch_list WHERE movie_id = ${movieId} AND user_id = ${userid}`);
      
      if (existingLike[0].length > 0) {
       
        await db.query(`DELETE FROM watch_list WHERE movie_id =  ${movieId} AND user_id =  ${userid}`);
        res.status(200).send({  watchList: false });
      } else {
        
        await db.query(`INSERT INTO watch_list (movie_id, user_id) VALUES (  ${movieId}, ${userid} )`);
        res.status(200).send({ watchList: true });
        console.log("true")
      }
    } catch (error) {
      console.error('Error handling watchList:', error);
      res.status(500).send({ error: 'Server error' });
    }
});

  app.get('/search', UserAuthorization, async (req, res) => {
    

    const { search_q = "" } = req.query;

    const { username } = req;
    

    try {
        // Get the user ID based on the username
        const [userResult,fields] = await db.query(`SELECT user_id FROM user WHERE username = ?`, [username]);
        const userId = userResult[0].user_id;
        

        // Search movies based on the user input
        const [searchResult,SearchFIeld] = await db.query(`
        
        SELECT 
    m.*,
    COUNT(l.like_id) AS total_likes,
    CASE WHEN liked_movies.movie_id IS NOT NULL THEN TRUE ELSE FALSE END AS liked
FROM 
    movie m
LEFT JOIN 
    likes l ON m.movie_id = l.movie_id
LEFT JOIN (
    SELECT DISTINCT movie_id
    FROM likes
    WHERE user_id = '${userId}'
) AS liked_movies ON m.movie_id = liked_movies.movie_id
WHERE 
    m.name LIKE '%${search_q}%'
GROUP BY 
    m.movie_id;`


);

console.log(searchResult)
        res.send({searchResult})
        // Send the search result back to the client
       
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/user', UserAuthorization, async (req, res) => {

    const { username } = req;

    try {
    
        const [userResult,fields] = await db.query(`SELECT * FROM user WHERE username = '${username}'`);
        const userId=userResult[0].user_id
        const [likedMovies, likedMoviesFields] = await db.query(`
    SELECT 
        movie.name,
        movie.movie_id,
        movie.image_url
    FROM 
        movie
    LEFT JOIN 
        likes ON movie.movie_id = likes.movie_id
    WHERE 
        likes.user_id = ?;
`, [userId]);

const [WatchList, WatchListFields] = await db.query(`
    SELECT 
        movie.name,
        movie.movie_id,
        movie.image_url
    FROM 
        movie
    LEFT JOIN 
        watch_list ON movie.movie_id = watch_list.movie_id
    WHERE 
        watch_list.user_id = ?;
`, [userId]);

        
        res.send({userDetails:userResult,likedMovies,WatchList})
    } catch (error) {
        console.error('Error handling like:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

//Admin
const Authorization =(req,res,next)=>{
    let jwtToken;
    const autHeader = req.headers["authorization"]
    
    if (autHeader!==undefined){
        jwtToken=autHeader.split(" ")[1]

    }
    else{
        res.status(401).send({errMsg:"Invalid Jwt Token"})
    }
    if(jwtToken !== undefined){
        jwt.verify(jwtToken,"MY_SECRET_ADMIN_TOKEN",async(err,payload)=>{
            if (err) {
                res.status(401);
                res.send("Invalid JWT Token");
              } else {
                req.admin = payload.adminname;
                next();}
        })
    }
}

app.post("/admin-register/", Authorization, async (req, res) => {
    const { adminname, password } = req.body;
    const { admin } = req;
    const getQuery = `SELECT * FROM admin WHERE admin_name='${adminname}'`;

    try {
        const [result, fields] = await db.query(getQuery);
        console.log('Query result:', result);

        // Check if user already exists
        if (result.length > 0) {
            console.log("User already exists");
            res.status(400).json({ errMsg: "User already exists" });
        } else {
            // Check password length
            if (password.length < 6) {
                res.status(400).json({ errMsg: "Password is too short" });
            } else {
                // Hash the password
                const hashedPassword = await bcrypt.hash(password, 15);
                // Insert user into database
                const registerQuery = `INSERT INTO admin(admin_name, admin_password, referral_admin) values('${adminname}', '${hashedPassword}', '${admin}')`;
                await db.query(registerQuery);
                res.status(200).json({ msg: "User registered successfully" });
            }
        }
    } catch (err) {
        console.error('Database error:', err); // Log database error
        res.status(500).json({ errMsg: `Server Error: ${err.message}` });
    }
});


app.post("/admin-login/",async(req,res)=>{
    const { adminname, password } = req.body;
   

      const getQuery = `SELECT * FROM admin WHERE admin_name='${adminname}'`;
        // Execute query to get user from database
      console.log(adminname)  
        
    try{
        const [result,fields] = await db.query(getQuery)
        

        if (result.length===0) {
            res.status(400).send({errMsg:"Invalid Admin"});
        } else {
            // Check password 
              const checkPassword= await bcrypt.compare(password,result[0].admin_password)
              if (checkPassword===true){

                const payload={adminname:adminname}
                const jwtToken=jwt.sign(payload,"MY_SECRET_ADMIN_TOKEN")
                res.send({jwtToken})
                console.log(jwtToken)

              }else{
                res.status(400).send({errMsg:"Invalid Admin and Password"});
              }

            }
        
        }
    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }

})

app.get("/admin",Authorization,async(req,res)=>{

   try{

    const { search_q = "" } = req.query;

    const [AllMovies,AllMovieField]=await db.query(`SELECT * FROM movie WHERE name LIKE '%${search_q}%'`)
    console.log(AllMovies)
    res.send({AllMovies:AllMovies})}

    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }
})


app.post("/admin/upload",Authorization,upload.fields([
    { name: "movieImage", maxCount: 1 },
    { name: "movieTrailer", maxCount: 1 },
    { name:"PosterUrl" , maxCount: 1},
    { name:"directorImage",maxCount:10}
]), async (req, res) => {
    try {
        // Accessing files from req.files
        const movieImage = req.files['movieImage'] ? req.files['movieImage'][0] : null;
        const movieTrailer = req.files['movieTrailer'] ? req.files['movieTrailer'][0] : null;
        const PosterUrl=req.files['PosterUrl']? req.files['PosterUrl'][0]:null

        if (!movieImage || !movieTrailer) {
            return res.status(400).json({ message: 'BothmovieImage and movieTrailer files are required.' });
        }
        console.log(req.body.Director)
        const directors = req.body.Director
        const directorImages = req.files['directorImage'] || [];
        
        directors.forEach((director, index) => {
            // Assign exactly one image to each director
            director.directorImage = directorImages[index] ? directorImages[index].filename : null;
        });



        /*req.director.forEach(director => {
          upload.single('directorImage')
          const directorImage= req.files['directorImage'] ? req.files['directorImage'][0]:null;
          if (!directorImage){
            console.log(directorImage)
          }
        }); */
        res.json({
            message: 'Files uploaded successfully',
            movieImage,
            movieTrailer
        });
        
        
        console.log('movieImage:', movieImage);
        console.log('movieTrailer:', movieTrailer);
        console.log('directors:', directors);
        console.log('PosterUrl',PosterUrl)

    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ message: `Error: ${err.message}` });
    
    }
});


