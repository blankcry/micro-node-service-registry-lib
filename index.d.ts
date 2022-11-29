declare module 'micro-node-service-registry-lib' {
  export default function (config: object): ServiceRegistry;

  export interface ServiceRegistry {
    register(object: object, callback: (error: Error, param: ServiceAttributes) => void): void;
    unregister(id: string, name: string, callback: (error: Error, param: ServiceAttributes) => void): void;
    find(name: string, endpointId: string): Promise<ServiceAttributes>;
    findViaEndpointId(endpointId: string): Promise<ServiceAttributes>;
  }

  interface ServiceAttributes {
    'serviceId': string;
    'serviceHost': string;
    'servicePort': number;
    'serviceProtocol': HTTPProtocol;
    'endpointId': string;
    'endpointPath': string;
    'endpointUrl': string;
    'domain': string;
    'ts':Date;
  }

  interface ServiceConfig {
    serviceId: string;
    serviceHost: string;
    servicePort: number;
    endpointId: string,
    endpointPath: string,
    serviceProtocol: HTTPProtocol
  }

  type HTTPProtocol = 'http' | 'https';
}
