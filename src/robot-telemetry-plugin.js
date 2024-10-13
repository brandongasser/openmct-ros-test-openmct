const objectProvider = {
    get: function (identifier) {
        return Promise.resolve({
            identifier: identifier,
            name: 'Robot',
            type: 'ros-test.telemetry-point',
            location: 'ROOT',
            telemetry: {
                values: [
                    {
                        key: 'value',
                        name: 'Value',
                        format: 'float',
                        hints: {
                            range: 1
                        }
                    },
                    {
                        key: 'utc',
                        source: 'timestamp',
                        name: 'Timestamp',
                        format: 'utc',
                        min: Date.now() - (10 * 1000),
                        max: Date.now(),
                        hints: {
                            domain: 1
                        }
                    }
                ]
            }
        });
    }
};

function retryConnecting(domain, callback) {
    const ws = new WebSocket(domain);
    ws.onerror = function() {
        setTimeout(function() {
            retryConnecting(domain, callback);
        }, 100);
    };
    ws.onopen = function() {
        callback(ws);
    };
    ws.onclose = function() {
        retryConnecting(domain, callback);
    };
}

function RobotTelemetry() {
    return function install(openmct) {
        openmct.objects.addRoot({
            namespace: 'ros-test.telemetry',
            key: 'robot'
        });

        openmct.types.addType('ros-test.telemetry-point', {
            name: 'Robot Telemetry Point',
            description: 'Telemetry point for the robot',
            cssClass: 'icon-telemetry'
        });

        openmct.objects.addProvider('ros-test.telemetry', objectProvider);

        let listener = {};

        retryConnecting('ws://localhost:8001', function (ws) {
            ws.onmessage = function (msg) {
                data = JSON.parse(msg.data);
                point = {
                    timestamp: data.timestamp, 
                    value: data.data
                };
                if (listener['robot']) {
                    listener['robot'](point);
                }
            };
        });

        const provider = {
            supportsSubscribe: function (domainObject) {
                return domainObject.type === 'ros-test.telemetry-point';
            },
            subscribe: function (domainObject, callback) {
                listener[domainObject.identifier.key] = callback;
                return function unsubscribe() {
                    delete listener[domainObject.identifier.key];
                };
            },
            supportsRequest: function (domainObject) {
                return domainObject.type === 'ros-test.telemetry-point';
            },
            request: function (domainObject, options) {
                return {};
            }
        };

        openmct.telemetry.addProvider(provider);
    };
};