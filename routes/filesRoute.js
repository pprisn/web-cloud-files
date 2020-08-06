var express = require('express');
var router = express.Router();

module.exports=(passport)=> {
  var auth  = require('../controllers/authController');
  var fctrl = require('../controllers/filesController');
  router.get('/dashboard', auth.LoggedOut, (req,res,next)=>{fctrl.ls(req,res,next)});
  router.get('/dashboard/upload/form', auth.LoggedOut, (req,res,next)=>{fctrl.uploadForm(req,res,next)});
  router.post("/dashboard/upload/create", auth.LoggedOut, (req,res,next)=>{fctrl.uploadCreate(req,res,next)});
  router.get("/dashboard/sendfile/:id", auth.LoggedOut, (req,res,next)=>{fctrl.responseFile(req,res,next)});
  router.get("/dashboard/reportxml", auth.LoggedOut, (req,res,next)=>{fctrl.responseXml(req,res,next)});
  router.get("/dashboard/reportxlsx", auth.LoggedOut, (req,res,next)=>{fctrl.responseXlsx(req,res,next)});
  router.get("/dashboard/delete/:id", auth.LoggedOut, (req,res,next)=>{fctrl.deleteFile(req,res,next)});
  return router;        
}
