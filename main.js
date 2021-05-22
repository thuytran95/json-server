const jsonServer = require('json-server');
const server = jsonServer.create();
const router = jsonServer.router('db.json');
const middlewares = jsonServer.defaults();
const queryString = require('query-string');

// Set default middlewares (logger, static, cors and no-cache)
server.use(middlewares);

// Add custom routes before JSON Server router
server.get('/echo', (req, res) => {
  res.jsonp(req.query);
});

// To handle POST, PUT and PATCH you need to use a body-parser
// You can use the one used by JSON Server
server.use(jsonServer.bodyParser);
router.render = (req, res) => {
  // check get with pagination
  const totalcountHeader = res.get('X-Total-Count');

  // if yest, custom ouput
  if (req.method === 'GET' && totalcountHeader) {
    const queryParams = queryString.parse(req._parsedUrl.query);

    const result = {
      data: res.locals.data,
      pagination: {
        _page: Number.parseInt(queryParams._page) || 1,
        _limit: Number.parseInt(queryParams._limit) || 10,
        _totalRows: Number.parseInt(totalcountHeader)
      }
    };
    return res.jsonp(result);
  }

  // otherwise, keep default behavior
  res.jsonp(res.locals.data);
};

server.use((req, res, next) => {
  if (req.method === 'POST') {
    req.body.createdAt = Date.now();
  } else if (req === 'PATCH') {
    req.body.updatedAt = Date.now();
  }
  // Continue to JSON Server router
  next();
});

// Use default router
server.use('/', router);

//  use alternate localhost and the port Heroku assigns to $PORT
const port = process.env.PORT || 3000;
server.listen(port, () => {
  console.log(`JSON Server is running at ${port}`);
});
