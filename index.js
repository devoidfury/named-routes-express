var methods = require('methods'),
    named_routes_express = module.exports,

    regex_re = /\(.*?\)/,
    param_re = /\/:(.*)/;


// crudely parse a normal route path. needs work, currently supports
// only params; no stars or regex
named_routes_express.reverse_params = function reverse_params(string, results) {
    var arg_key = param_re.exec(string);

    results = results || {
        paths: [string],
        arity: 0,
        args: {}
    };

    if (arg_key) {
        results.paths = results.paths.slice(1).concat(string.split(':'+ arg_key));
        results.args[results.arity] = results.args[arg_key] = results.arity;
        results.arity++;

        if (results.paths[1] && param_re.test(results.paths[1]))
            reverse_params(results.paths[1], results);
    }

    return results;
};

// crudely parse a regex route path. needs work, currently supports
// regex with only capture matches
named_routes_express.reverse_regex = function reverse_regex(string) {
    var result = {
        paths: string.split(regex_re),
        arity: 0,
        args: {}
    };

    if (result.paths.length > 1)
        for(var i = 0; i < result.paths.length; i++)
            result.args[result.arity] = result.arity++;

    return result;
};

// main init
named_routes_express.patch = function(express) {
    if (express.supports_named_routes) return;

    express.supports_named_routes = true;

    var old_methods = { use: express.Router.use };

    express.Router.named_routes = {};
    methods.concat('all').forEach(function patch_method(method) {
        old_methods[method] = express.Router[method];

        express.Router[method] = function(path, name){
            var args = [].slice.call(arguments);

            // names are optional
            if (typeof name === 'string') {
                args.splice(1, 1);

                if (path instanceof RegExp) {
                    path = path.toString();
                    if (path[0] !== '/') path = '/' + path;
                    this.named_routes[name] = named_routes_express.reverse_regex(path);

                } else if (typeof path === 'string') {
                    if (path[0] !== '/') path = '/' + path;

                    this.named_routes[name] = named_routes_express.reverse_params(path);
                }
            }

            old_methods[method].apply(this, args);
            return this;
        };
    });

    // patch Router.use to propagate named routes into bigger application from smaller ones (or from used routers)
    express.Router.use = function(route, fn) {
        if ('string' != typeof route) {
            fn = route;
            route = '/';
        }

        var named_routes = fn.named_routes || (fn._router || {}).named_routes;
        if (named_routes) {
            // todo -- propagate named routes into bigger application from smaller ones (or from used routers)
        }

        return old_methods.use.call(this, route, fn);
    };

    // add app.reverse_route
    express.application.reverse_route = function(name, args) {
        var route = this._router.named_routes[name];

        if (!route) {
            throw new Error(name + ' reversal: route was not found');

        } else  if (Array.isArray(args)) { //reverse with array
            if (args.length !== route.arity)
                throw new Error(name + ' reversal: expected ' + route.arity + ' arguments, got ' + args.length + ' instead');

            // todo -- reverse with array

        } else if (args) { //reverse with object
            if (Object.keys(args).length !== route.arity)
                throw new Error(name + ' reversal: expected ' + route.arity + ' arguments, got ' + Object.keys(args).length + ' instead');

            // todo -- reverse with object

        } else if (route.arity) {
            throw new Error(name + ' reversal: expected ' + route.arity + ' arguments, got 0 instead');

        } else { // reverse with no args
            return route.paths[0];
        }
    };

    // add req.reverse_route
    express.request.reverse_route = function(name, args) {
        return this.app.reverse_route(name, args)
    };

    // patch reverse_route into locals, for template usage
    var old_init = express.application.init;
    express.application.init = function() {
        var self = this;
        old_init.apply(this, arguments);

        this.locals.reverse_route = function() {
            return self.reverse_route.apply(self, arguments);
        }
    }
};