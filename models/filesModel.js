/*
CREATE TABLE Files (
        Id serial NOT NULL PRIMARY KEY,
        User_id INTEGER NOT NULL REFERENCES users(Id) ON DELETE CASCADE,
        Name varchar(255),
        Image oid,
        Describe varchar(1000),
        Created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        Deleted_at TIMESTAMPTZ

);

INSERT INTO image (name, raster)
    VALUES ('beautiful image', lo_import('/etc/motd'));

INSERT INTO image (name, raster)  -- то же, что выше, но с предопределённым OID
    VALUES ('beautiful image', lo_import('/etc/motd', 68583));

SELECT lo_export(image.raster, '/tmp/motd') FROM image
    WHERE name = 'beautiful image';
*/

const db = require('../config/database').pool;

module.exports={
// CRUD model script will be defined here
  insertFile:async function(user_id, reqfile, uploadDetails, callback){
   try {
//   console.log(uploadDetails)
    var sql = 'INSERT INTO files (user_id, name, image, describe, created_at ) VALUES($1, $2, lo_import($3), $4, NOW()) RETURNING id'; 
    db.query(sql, [user_id,
                   reqfile.originalname,
                   reqfile.path,
                   uploadDetails.describe],function (err, data) {
    if (err) throw err;
      return callback(data);
    });
   } catch(e){
     console.log(e);
   }
   
  },

  selectFile:async function(user_id,file_id,callback){
    try{

    const sql = "SELECT lo_export(files.image,$1), name FROM files WHERE id=($2)";

    TmpFileNameSend = __dirname+'/../public/uploads/'+user_id+'_send_'+ Date.now();
    TmpFileNameSend = TmpFileNameSend.toString();
//      console.log(TmpFileNameSend);
//      console.log(sql);

    db.query( sql, [TmpFileNameSend, file_id], (err, data) => {
    if (err) throw err;
//      console.log(data)
      dt = {tmpfilename: TmpFileNameSend ,name: data.rows[0].name}
      return callback(dt);
    });
    } catch(e){
      console.log(e);
    }


  },
  fetchFiles:async function(user_id,callback){
//    console.log("filesModel fetchFiles user_id=",user_id)
    var sql="SELECT id, name, describe, to_char(created_at,'YYYY-MM-DD HH24:MI:SS') AS created_at_f FROM files WHERE user_id=($1) and (deleted_at IS NULL)";
    db.query( sql, [user_id,], (err, data, fields) => {
    if (err) throw err;
      //console.log(data)
      return callback(data);
    });  
  },
  fetchFilesAsync: async function(user_id,callback){
    try {
//    console.log("filesModel fetchFiles user_id=",user_id)
    var sql='SELECT id, name, describe, created_at FROM files WHERE user_id=($1) and (deleted_at IS NULL)';
    db.query( sql, [user_id,], (err, data, fields)=>{
    if (err) throw err;
      //console.log("SELECT id, name ",data.rows)
      return callback(data.rows);
    }); 
    } catch(e) {
     console.log(e);
    }
  },

  editFiles:function(editId, callback){
    var sql=`SELECT * FROM files WHERE id=${editId}`;
    db.query(sql, (err, data, fields) => {
      if (err) throw err;
//      console.log(data.rows[0])
      return callback(data.rows[0]);
    });
  },

  UpdateFiles:function(updateData,updateId,callback){
    var sql = `UPDATE users SET fullname=($1), emailaddress=($2), city=($3), country=($4) WHERE id= ($5)`;

//      console.log(sql)
//      console.log(updateData)
      var jsonData = JSON.stringify(updateData);

//      console.log(updateData.fullname)
//      console.log(updateId)
      db.query(sql, [updateData.fullname, 
                     updateData.emailaddress, 
                     updateData.city, 
                     updateData.country, 
                     updateId], (err, data) => {
      if (err) throw err; 
        return callback(data);
     });
  },
  deleteFile:function(deleteId,callback){
//    console.log(deleteId);
    var sql = 'DELETE FROM files WHERE id = $1';
    db.query(sql, [deleteId], function (err, data) {
    if (err) throw err;
     return callback(data);
  });
  }
}
