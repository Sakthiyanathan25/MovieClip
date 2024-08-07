const express = require('express');
const bcrypt = require('bcryptjs'); 
const jwt = require('jsonwebtoken');
const db = require('../config/db');
const { adminAuthorization } = require('../middleware/auth');
const { upload } = require('../config/cloudinary');


const router = express.Router();


router.post("/register", adminAuthorization, async (req, res) => {
    const { adminname, password } = req.body;
    const { admin } = req;
    const getQuery = `SELECT * FROM admin WHERE admin_name='${adminname}'`;

    try {
        const [result] = await db.query(getQuery);

        // Check if user already exists
        if (result.length > 0) {
            
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
       
        res.status(500).json({ errMsg: `Server Error: ${err.message}` });
    }
});

router.post("/login",async(req,res)=>{
    const { adminname, password } = req.body;
   

      const getQuery = `SELECT * FROM admin WHERE admin_name='${adminname}'`;

     
        
    try{
        const [result] = await db.query(getQuery)
        

        if (result.length===0) {
            res.status(400).send({errMsg:"Invalid Admin"});
        } else {
            // Check password 
              const checkPassword= await bcrypt.compare(password,result[0].admin_password)
              if (checkPassword===true){

                const payload={adminname:adminname}
                const jwtToken=jwt.sign(payload,process.env.ADMIN_SECRET_TOKEN)
                res.send({jwtToken})
                

              }else{
                res.status(400).send({errMsg:"Invalid Admin and Password"});
              }

            }
        
        }
    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }

})

router.get("/allmovies",adminAuthorization,async(req,res)=>{

   try{

    const { search_q = "" } = req.query;
    const {admin}=req

    const [AllMovies]=await db.query(`SELECT * FROM movie WHERE name LIKE '%${search_q}%'`)
   const [countUsers] = await db.query(`SELECT COUNT(*) AS totalusers FROM user`);
    const totalusers = countUsers[0].totalusers;

  
    res.send({AllMovies:AllMovies,admin,totalusers})}

    catch(err){
        res.status(500).send({errMsg:`Server Error : ${err}`})
    }
})


  
router.post(
    '/upload',
    adminAuthorization,
    upload.fields([
      { name: 'movieImage', maxCount: 1 },
      { name: 'movieTrailer', maxCount: 1 },
      { name: 'PosterUrl', maxCount: 1 },
      { name: 'DirectorImage', maxCount: 10 },
      { name: 'StarImage', maxCount: 15 },
      { name: 'MusicDirectorImage', maxCount: 10 },
      { name: 'Video', maxCount: 10 },
      { name: 'Thumbnail', maxCount: 10 },
      { name: 'OTTplatformImage', maxCount: 10 },
    ]),
    async (req, res) => {
      try {
        // Accessing files from req.files
        const movieImage = req.files['movieImage'] ? req.files['movieImage'][0] : null;
        const movieTrailer = req.files['movieTrailer'] ? req.files['movieTrailer'][0] : null;
        const PosterUrl = req.files['PosterUrl'] ? req.files['PosterUrl'][0] : null;
        const DirectorImage = req.files['DirectorImage'] ? req.files['DirectorImage'] : [];
        const MusicDirectorImage = req.files['MusicDirectorImage'] ? req.files['MusicDirectorImage'] : [];
        const StarImage = req.files['StarImage'] ? req.files['StarImage'] : [];
        const OTTplatformImage = req.files['OTTplatformImage'] ? req.files['OTTplatformImage'] : [];
        const Video = req.files['Video'] ? req.files['Video'] : [];
        const Thumbnail = req.files['Thumbnail'] ? req.files['Thumbnail'] : [];
  
        // Parsing JSON arrays from request body
        const Directors = req.body.directors ? JSON.parse(req.body.directors) : [];
        const MusicDirectors = req.body.musicDirectors ? JSON.parse(req.body.musicDirectors) : [];
        const Stars = req.body.stars ? JSON.parse(req.body.stars) : [];
        const Writer = req.body.writer ? JSON.parse(req.body.writer) : [];
        const Genre = req.body.genre ? JSON.parse(req.body.genre) : [];
        const Language = req.body.language ? JSON.parse(req.body.language) : [];
        const OTTPlatform = req.body.OTTPlatform ? JSON.parse(req.body.OTTPlatform) : [];
        const RelatedVideo = req.body.relatedVideo ? JSON.parse(req.body.relatedVideo) : [];
  
        const { name, description, runtime, certificate, category, releaseDate, imdbRating } = req.body;

        // Insert movie record and get the last inserted ID
        const movieSql = "INSERT INTO movie(name, image_url, video_url, poster_url, runtime, release_date, description, imdb_rating, category, certificate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";
const movieValues = [name, movieImage.path, movieTrailer.path, PosterUrl.path, runtime, releaseDate, description, imdbRating, category, certificate];
        const movieResult = await db.query(movieSql, movieValues);

        const [movieIDResult,fields] = await db.query(`SELECT * FROM movie WHERE name = '${name}'`);
        const MovieId=movieIDResult[0].movie_id
        
    
        // Insert Directors
        await Promise.all(Directors.map((dir, index) => {
            if (DirectorImage[index]) {
              const dirSql = "INSERT INTO director (movie_id, director_name, director_img_url) VALUES (?, ?, ?)";
              const dirValues = [MovieId, dir.name, DirectorImage[index].path];
              return db.query(dirSql, dirValues);
            }
          }));
      
          // Insert Music Directors
          await Promise.all(MusicDirectors.map((musicDir, index) => {
            if (MusicDirectorImage[index]) {
              const musicDirSql = "INSERT INTO music_director (movie_id, music_dir_name, music_dir_img_url) VALUES (?, ?, ?)";
              const musicDirValues = [MovieId, musicDir.name, MusicDirectorImage[index].path];
              return db.query(musicDirSql, musicDirValues);
            }
          }));

           // Insert Stars
    await Promise.all(Stars.map((star, index) => {
        if (StarImage[index]) {
          const starSql = "INSERT INTO stars (movie_id, star_name, star_img_url) VALUES (?, ?, ?)";
          const starValues = [MovieId, star.name, StarImage[index].path];
          return db.query(starSql, starValues);
        }
      }));
  
      // Insert OTT Platforms
      await Promise.all(OTTPlatform.map((OTT, index) => {
        if (OTTplatformImage[index]) {
          const OTTSql = "INSERT INTO ott_platform (movie_id, ott_url, ott_img_url) VALUES (?, ?, ?)";
          const OTTValues = [MovieId, OTT.link, OTTplatformImage[index].path];
          return db.query(OTTSql, OTTValues);
        }
      }));

      // Insert Related Videos
    await Promise.all(RelatedVideo.map((RelVideo, index) => {
        if (Video[index] && Thumbnail[index]) {
          const relVideoSql = "INSERT INTO related_video (movie_id, video_name, video_url, video_url_img) VALUES (?, ?, ?, ?)";
          const relVideoValues = [MovieId, RelVideo.title, Video[index].path, Thumbnail[index].path];
          return db.query(relVideoSql, relVideoValues);
        }
      }));
  
      // Insert Writers
      await Promise.all(Writer.map((writer) => {
        const writerSql = "INSERT INTO writter (movie_id, writter_name) VALUES (?, ?)";
        const writerValues = [MovieId, writer.name];
        return db.query(writerSql, writerValues);
      }));

      await Promise.all(Genre.map((genre) => {
        const genreSql = "INSERT INTO genre (movie_id, type) VALUES (?, ?)";
        const genreValues = [MovieId, genre.type];
        return db.query(genreSql, genreValues);
      }));
  
      // Insert Languages
      await Promise.all(Language.map((lan) => {
        const lanSql = "INSERT INTO language (movie_id, language, category) VALUES (?, ?, ?)";
        const lanValues = [MovieId, lan.language, lan.category];
        return db.query(lanSql, lanValues);
      }));

        // Store data in the database
        // You should add the logic to store the data in the database here
        
      res.status(200).json({
        message: 'Files uploaded successfully',
        movieImage,
        movieTrailer,
        PosterUrl,
        DirectorImage,
        MusicDirectorImage,
        StarImage,
        OTTplatformImage,
        Video,
        Thumbnail,
      }); 
     
  
      } catch (err) {
        
        res.status(500).json({ message: `Error: ${err.message}` });
      }
    }
  );

router.delete('/admin/delete/:id',adminAuthorization,async(req,res)=>{
  const {id}=req.params

  
  const queries = [
    'DELETE FROM director WHERE movie_id = ?',
    'DELETE FROM music_director WHERE movie_id = ?',
    'DELETE FROM stars WHERE movie_id = ?',
    'DELETE FROM ott_platform WHERE movie_id = ?',
    'DELETE FROM related_video WHERE movie_id = ?',
    'DELETE FROM genre WHERE movie_id = ?',
    'DELETE FROM language WHERE movie_id = ?',
    'DELETE FROM writter WHERE movie_id = ?',
    'DELETE FROM likes WHERE movie_id = ?',

    'DELETE FROM watch_list WHERE movie_id = ?',

    'DELETE FROM movie WHERE movie_id = ?'
  ];

  try {
    for (const query of queries) {
      await db.query(query, [id]);
     
    }
    
  } catch (error) {
    res.status(500).send('Error deleting movie and related data: ' + error.message);

  }
})

module.exports = router;