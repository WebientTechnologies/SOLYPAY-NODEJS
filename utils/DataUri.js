const DataURIParser = require("datauri/parser");
const path = require('path');
const getDataUri = (file)=>{
        const parser = new DataURIParser();
        const extName = path.extname(file.originalname).toString();
       const uri =  parser.format(extName , file.buffer);
        return uri;

};      
module.exports = getDataUri;