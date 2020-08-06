
module.exports={
LoggedOut:function( req, res, next){
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()) {
//      console.log("AUTH !!! LoggedIn where user isAut id=",req.session.passport.user.id);
    return next();
  }
  res.redirect("/users/login");
  },

LoggedIn:function( req, res,next){
  if (req.isAuthenticated()) {
//    console.log("AUTH !!! LoggedIn where user isAut id=",req.session.passport.user.id);
    return res.redirect("/files/dashboard");
  }
  next();
  },
isAuth:function(req,res, callback){
//  console.log(req.session.passport.user)
  var userid = req.session.passport.user.id
  if (req.isAuthenticated())  return callback(userid);
  else return callback(0); 
}

};

