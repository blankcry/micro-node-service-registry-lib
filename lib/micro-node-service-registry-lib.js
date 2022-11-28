/**
 * Created by domenicovacchiano on 07/07/16.
 */

 var serviceSchema=require('./service-registry-schema')();
 /*
  config={
      "name":"db_name",
      "user":"db_user",
      "password":"db_password",
      "host":"db_server_host",
      "port":db_server_port,
      "connectionPool":connection pool number
      "schema":"object_schema"
  }
  */
 
 function ServiceRegistry(config) {
 
     var db=require('micro-node-mongo-lib').mongodb({
             name:config.name,
             user:config.user,
             password:config.password,
             host:config.host,
             port:config.port
         }),
         ServiceModel = db.model('services', serviceSchema);
 
     return{
         register:async function (service,callback) {
             try {
                 const found = await this.find(service.serviceId,service.endpointId);
                 let serviceItem;
                 if (!found){
                     serviceItem = new ServiceModel({
                             serviceId:service.serviceId,
                             serviceHost:service.serviceHost,
                             servicePort:service.servicePort,
                             serviceProtocol:service.serviceProtocol,
                             endpointId:service.endpointId,
                             endpointPath:service.endpointPath,
                             endpointUrl: service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort + "/" + service.endpointPath ,
                             domain: service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort,
                             ts:Date().toString()
                         }
                     );
                 } else {
                     found.ts=Date().toString();
                     serviceItem=found;
                 }
                 serviceItem.save(function (err, item) {
                     callback(err,item);
                 });
             } catch (error) {
                callback(error, null);
             }
 
         },
         unregister:function (serviceId, endpointId,callback) {
             db.collections.services.remove({
                 serviceId: serviceId,
                 endpointId:endpointId
             },function (err,item) {
                 callback(err,item);
             });
         },
         find: async function (serviceId, endpointId) {
             var serviceItem = await ServiceModel.findOne({
                 serviceId: serviceId,
                 endpointId:endpointId
             });
             return serviceItem;
         }
     };
 }
 
 module.exports=ServiceRegistry;