/**
 * Created by domenicovacchiano on 07/07/16.
 */

var serviceSchema = require('./service-registry-schema')();
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

    var db = require('micro-node-mongo-lib').mongodb({
        name: config.name,
        user: config.user,
        password: config.password,
        host: config.host,
        port: config.port
    }),
        ServiceModel = db.model('services', serviceSchema);

    return {
        register: async function (service, callback) {
            try {
                const found = await this.find(service.serviceId, service.endpointId);
                let serviceItem;
                if (!found) {
                    serviceItem = new ServiceModel({
                        serviceId: service.serviceId,
                        endpointId: service.endpointId,
                        serviceHost: service.serviceHost,
                        servicePort: service.servicePort,
                        serviceProtocol: service.serviceProtocol,
                        endpointPath: service.endpointPath,
                        endpointUrl: service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort + "/" + service.endpointPath,
                        domain: service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort,
                        ts: Date().toString()
                    }
                    );
                } else {
                    found.serviceHost = service.serviceHost,
                    found.servicePort = service.servicePort,
                    found.serviceProtocol = service.serviceProtocol,
                    found.endpointPath = service.endpointPath,
                    found.endpointUrl = service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort + "/" + service.endpointPath,
                    found.domain = service.serviceProtocol + "://" + service.serviceHost + ":" + service.servicePort,
                    found.ts = Date().toString();
                    serviceItem = found;
                }
                serviceItem.save(function (err, item) {
                    callback(err, item);
                });
            } catch (error) {
                callback(error, null);
            }

        },
        unregister: function (serviceId, endpointId, callback) {
            db.collections.services.remove({
                serviceId: serviceId,
                endpointId: endpointId
            }, function (err, item) {
                callback(err, item);
            });
        },
        find: async function (serviceId, endpointId) {
            var serviceItem = await ServiceModel.findOne({
                serviceId: serviceId,
                endpointId: endpointId
            });
            return serviceItem;
        },
        findViaEndpointId: async function (endpointId) {
            var serviceItem = await ServiceModel.findOne({
                endpointId: endpointId
            });
            return serviceItem;
        }
    };
}

module.exports = ServiceRegistry;