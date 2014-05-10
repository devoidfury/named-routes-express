# named-routes-express

WIP, not quite finished.

Allows 'naming' routes to allow reverse lookups. This lets you decouple the functionality from
the URL scheme. Inspired by [express-named-routes](https://github.com/RGBboy/express-named-routes), with a better syntax.

### Usage

#### Install
`npm install named-routes-express`

#### Set up express and routes
```js
var express = require('express'),
    named_routes = require('named-routes-express'),
    routes = require('./your_routes');

// Patch the new functionality into express.
// Must be done before the app instace is created.
named_routes.patch(express);

var app = express();

// the second argument (string) is the route key to resolve
app.get('/', 'homepage', routes.homepage);

// but it's optional, so it shouldn't break existing codebases
app.get('/about-us', routes.about);
```

####


### License - MIT
Copyright (c) 2014 Tom Hunkapiller

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies
of the Software, and to permit persons to whom the Software is furnished to do
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
