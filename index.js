const AWS = require('aws-sdk');
const S3 = new AWS.S3({ apiVersion: '2006-03-01' });

exports.handler = (event, context, callback) => { 

  var s3_content_bucket = '';
  var s3_object_path = '';
  var s3_extjs_bucket = process.env.S3_EXTJS_BUCKET; 

  var media_content_types = ['image/jpg','image/jpeg','image/png','image/gif','image/tif','image/tiff','application/octet-stream'];

  if (Object.keys(event).length === 0 && event.constructor === Object){
    var request_response = {
      isBase64Encoded: false,
      statusCode: 200,       
      headers: {'Content-type':'application/json','Content-length': 400},        
      body: JSON.stringify(event, null, 2)             
    };  
    callback(null, request_response);
  } else {
    if (event.pathParameters === null) {
      s3_object_path = 'index.html';
    } else {
      s3_object_path = event.pathParameters.proxy
    }
    s3_content_bucket = event.stageVariables.site
    var s3_object_bucket = s3_content_bucket;
    if (event.resource == "/extjs/{proxy+}") {
      s3_object_bucket = s3_extjs_bucket;
    }
    
    var s3_params = { 
      Bucket: s3_object_bucket,
      Key: s3_object_path
    }

    S3.getObject(s3_params, function(err, data) {  
      if (err) {
        var request_response = {   
          statusCode: 404,
          headers: {'Content-type':'application/json'},            
          body: JSON.stringify({'error':err,'error_stack': err.stack})             
        };
        callback(null,request_response);           
      } else {
        if (media_content_types.indexOf(data.ContentType) === -1) {              
          var request_response = {
            isBase64Encoded: false,
            statusCode: 200,       
            headers: {'Content-type':data.ContentType,'Content-length':data.ContentLength},        
            body: data.Body.toString()             
          };       
          callback(null,request_response);         
        } else {
          var request_response = {
            isBase64Encoded: true,
            statusCode: 200,       
            headers: {'Content-type':data.ContentType, 'Content-length':data.ContentLength},
            body: data.Body.toString('base64')
          };      
          callback(null,request_response);         
        }
      }
    });
  }
}
