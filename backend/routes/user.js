const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { userAuthorization } = require('../middleware/auth');

const router = express.Router();

router.post("/register/", async (req, res) => {
    const { username, password } = req.body;
    const getQuery = `SELECT * FROM user WHERE username='${username}'`;
        // Execute query to get user from database
        
        
    try{
        const [result] = await db.query(getQuery)
        
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

router.post("/login/",async(req,res)=>{
    const { username, password } = req.body;

      const getQuery = `SELECT * FROM user WHERE username='${username}'`;
        // Execute query to get user from database
        
        
    try{
        const [result] = await db.query(getQuery)
     


        if (result.length===0) {
            res.status(400);
            res.send({errMsg:"Invalid User"});
        } else {
            // Check password 
              const checkPassword= await bcrypt.compare(password,result[0].password)
              if (checkPassword===true){

                const payload={username:username}
                const jwtToken=jwt.sign(payload,process.env.USER_SECRET_TOKEN)
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

router.get("/",userAuthorization,async(req,res)=>{
    const {username}=req
    
  try{
    const [result] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
    const userid=result[0].user_id
    const [allmovieresult]=await db.query(`SELECT m.*,
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
    const [popularMoviereuslt]=await db.query(`
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

router.get("/movies/:id", userAuthorization, async (req, res) => {
    const { id } = req.params;
    const { username } = req;

    try {
        const [userResult] = await db.query(
            `SELECT user_id FROM user WHERE username = ?`, [username]
        );
        const userid = userResult[0].user_id;

        const [movieResult] = await db.query(`
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

        const [genre] = await db.query(
            `SELECT type FROM genre WHERE movie_id = ?;`, [id]
        );

        const [stars] = await db.query(
            `SELECT star_name , star_img_url FROM stars WHERE movie_id = ?`, [id]
        );

        const [director] = await db.query(
            `SELECT director_name , director_img_url FROM director WHERE movie_id = ?`, [id]
        );

        const [writer] = await db.query(
            `SELECT writter_name FROM writter WHERE movie_id = ?`, [id]
        );

        const [musicdirector] = await db.query(
            `SELECT music_dir_name, music_dir_img_url FROM music_director WHERE movie_id = ?`, [id]
        );

        const [language] = await db.query(
            `SELECT language, category FROM language WHERE movie_id = ?`, [id]
        );

        const [relatedVideos] = await db.query(
            `SELECT video_name, video_url,video_url_img FROM related_video WHERE movie_id = ?`, [id]
        );

        const [ott] = await db.query(
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

router.post('/movies/:movieId/likes', userAuthorization, async (req, res) => {
    const { movieId } = req.params;
    const {username}=req
    try {
        const [result] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
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

  router.post('/movies/:movieId/watchList', userAuthorization, async (req, res) => {
    const { movieId } = req.params;
    const {username}=req
    try {
        const [result] = await db.query( `SELECT user_id FROM user WHERE username='${username}'`);
        const userid=result[0].user_id
      const existingLike = await db.query(`SELECT * FROM watch_list WHERE movie_id = ${movieId} AND user_id = ${userid}`);
      
      if (existingLike[0].length > 0) {
       
        await db.query(`DELETE FROM watch_list WHERE movie_id =  ${movieId} AND user_id =  ${userid}`);
        res.status(200).send({  watchList: false });
      } else {
        
        await db.query(`INSERT INTO watch_list (movie_id, user_id) VALUES (  ${movieId}, ${userid} )`);
        res.status(200).send({ watchList: true });
        
      }
    } catch (error) {
      
      res.status(500).send({ error: 'Server error' });
    }
});

  router.get('/search', userAuthorization, async (req, res) => {
    

    const { search_q = "" } = req.query;

    const { username } = req;
    

    try {
        // Get the user ID based on the username
        const [userResult] = await db.query(`SELECT user_id FROM user WHERE username = ?`, [username]);
        const userId = userResult[0].user_id;
        

        // Search movies based on the user input
        const [searchResult] = await db.query(`
        
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

        res.send({searchResult})
        // Send the search result back to the client
       
    } catch (error) {
        
        res.status(500).json({ error: 'Server error' });
    }
});

router.get('/userDetails', userAuthorization, async (req, res) => {

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
        
        res.status(500).json({ error: 'Server error' });
    }
});

module.exports = router;