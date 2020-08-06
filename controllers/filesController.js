var filesModel=require('../models/filesModel');
var fs = require("fs");
var builder = require('xmlbuilder');
var Excel = require('exceljs'); 

//var multer = require('multer');

async function readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFileSync(path, 'binary', function (err, data) {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  }
// Показать список файлов пользователя
module.exports={
// CRUD select all files whith usr_id in request 
    ls:(req,res)=>{
//        console.log('req.session.passport.user.id',req.session.passport.user.id);
        const username = req.session.passport.user.fullname+' '+req.session.passport.user.emailaddress;
        const user_id = req.session.passport.user.id;
        filesModel.fetchFiles(user_id, function(data){
//        console.table(data.rows)
        res.render('dashboard', {user:username, fetchData:data.rows }); 
    });

    },
    uploadForm:(req, res)=>{
//        console.log('uploadForm user_id =', req.session.passport.user.id)
        const username = req.session.passport.user.fullname+' '+req.session.passport.user.emailaddress;
        res.render('upload', {user:username});
    },

  uploadCreate: async function (req, res, next) {
    let filedata = req.file;
    if(!filedata) res.send("Ошибка, файл не выбран");
    try {
//	     console.log('req.file',req.file);
             data= fs.readFileSync(filedata.path,'utf8');
             console.log('sync readFile',filedata.path);
             const user_id = req.session.passport.user.id;
             const uploadDetails= req.body;
             await filesModel.insertFile(user_id,req.file, uploadDetails, function(data){
//             console.log('result_insertFile=', data)
             });
             res.send("Файл загружен "+filedata.path);
     } catch(error) {
       console.log(error);
       res.send(`Ошибка,${error}`);     
   }
  },
  deleteFile:function(req,res){
    const deleteId=req.params.id;
    filesModel.deleteFile(deleteId,function(data){
      res.redirect('/files/dashboard');
//      console.log(data.affectedRows + " record(s) updated");
  });
 },
 responseFile:async(req, res)=>{
   const file_id = req.params.id;
   try{
             const user_id = req.session.passport.user.id;
             await filesModel.selectFile(user_id,file_id, function(data){
//             console.log('result_sendFile=', data)
             res.download(data.tmpfilename, data.name);
             });
      
      } catch(error) {
         console.log(error);
         res.send(`Ошибка,${error}`);     
      }

 }, 
 responseXml:async(req, res)=>{
     try{
            const user_id = req.session.passport.user.id;
            let data = await filesModel.fetchFilesAsync(user_id, (data)=>{
//            console.log('filesModel.fetchFilesAsync',data);
             var xml = builder.create('filestore');
             dr = data
             //console.log('dr',dr[0].id);

             for(var i=0; i< dr.length; i++) {
             xml.ele('file')
		.ele('name',dr[i].name).up()
                .ele('describe',dr[i].describe).end();
             }
             var xmldoc = xml.toString({ pretty: true });
//	     console.log(xmldoc);
              dirPath = __dirname+'/../public/uploads/'+user_id+'_xml_'+ Date.now();
              fs.writeFile(dirPath, xmldoc, function(err) {
              if(err) { return console.log(err); } 
//            console.log("The file was saved!");
              res.download(dirPath, 'ListFiles.xml');
               //res.render('index');
             });


            });
      }catch(error) {
         console.log(error);
         res.send(`Ошибка,${error}`);     
      }

 }, 
 responseXlsx:async(req, res)=>{
   try{
     const user_id = req.session.passport.user.id;
     dirPath = __dirname+'/../public/uploads/'+user_id+'_'+ Date.now()+'.xlsx';
     filesModel.fetchFiles(user_id, function(data){
       console.log('data in fetchFiles',data)
       let workbook = new Excel.Workbook()
       let worksheet = workbook.addWorksheet('Dashboard')

      
      //  worksheet.columns = [
      //  {header: 'Index', key: 'index'},
      //  {header: 'Id', key: 'id'},
      //  {header: 'File name', key: 'name'},
      //  {header: 'Describe', key: 'describe'},
      //  {header: 'Created_at', key: 'created_at'}
      //  ]
      //  worksheet.columns.forEach(column => {
      //      column.width = column.header.length < 12 ? 12 : column.header.length
      //  });

         header = ["Id","File name","Describe","Created_at"]
       // Add new row
       let titleRow = worksheet.addRow(['Каталогк файлов пользователя '+req.session.passport.user.emailaddress]);
       // Set font, size and style in title row.
       titleRow.font = { name: 'Comic Sans MS', family: 4, size: 16, underline: 'double', bold: true };

       //Add Image
       //let logo = workbook.addImage({
       //  base64: logoFile.logoBase64,
       //  extension: 'png',
       // });
       //worksheet.addImage(logo, 'E1:F3');
       //worksheet.mergeCells('A1:D2');

       //Add Header Row
       let headerRow = worksheet.addRow(header);
       // Cell Style : Fill and Border
       headerRow.eachCell((cell, number) => {
         cell.fill = {
           type: 'pattern',
           pattern: 'solid',
           fgColor: { argb: 'FFFFFF00' },
           bgColor: { argb: 'FF0000FF' }
         }
         cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } }
        })

        // Make the header bold.
        // Note: in Excel the rows are 1 based, meaning the first row is 1 instead of 0.
        //worksheet.getRow(3).font = {bold: true}

        // Blank Row
        //Add row with current date
        data.rows.forEach(d => {
           worksheet.addRow(Object.values(d));
        });


        let subTitleRow = worksheet.addRow(['Date : ' +new Date()]);
        workbook.xlsx.writeFile(dirPath);
        setTimeout(() => { res.download(dirPath, 'Dashboard.xlsx');}, 2000);
//      console.log(data.rows);
        
     });
     }catch(error) {
         console.log(error);
         res.send(`Ошибка,${error}`);     
}
},
}

  
