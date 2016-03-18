var fs = require('fs');
var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors')
var _ = require('lodash');
var pdc = require('pdc');
var app = express();

var converterTo = function(content, to, callback) {
  if (!content) {
    return callback(new Error('参数错误'))
  }

  var filename = Math.random().toString(36).substring(2);
  var cb = function(suffix) {
    return function(err, result) {
      if (err) {
        console.log(err);
        return callback(new Error('转化文件失败'));
      }
      callback(null, (filename + suffix));
    };
  };

  var folderStat = null;
  try {
    folderStat = fs.statSync(__dirname + '/.tmp');
  } catch (e) {}
  if (!folderStat || !folderStat.isDirectory()) {
    fs.mkdirSync(__dirname + '/.tmp');
  }

  switch (to) {
    case 'pdf':
      pdc(content, 'markdown', 'pdf', ['-t', 'latex', '-o', '.tmp/' + filename + '.pdf', '--latex-engine=xelatex', '--template=template.tex'], cb('.pdf'));
      break;
    case 'docx':
      pdc(content, 'markdown', 'docx', ['-o', '.tmp/' + filename + '.docx'], cb('.docx'));
      break;
    case 'epub':
      pdc(content, 'markdown', 'epub', ['-o', '.tmp/' + filename + '.epub'], cb('.epub'));
      break;
    default:
      callback(new Error('转化格式错误'))
  }
};

if (process.env.CORS_ORIGIN) {
  app.use(cors({
    origin: process.env.CORS_ORIGIN
  }));
} else {
  app.use(cors());
}

app.get('/', function (req, res) {
  res.send('Hello, word!');
});

// 文件下载
app.get('/download/:file(*)', function (req, res) {
  res.download(__dirname + '/.tmp/' + req.params.file, req.query && req.query.name ? req.query.name : null);
});

// 转化 markdown 为 pdf
app.post('/markdownConverterPdf', bodyParser.urlencoded({extended: false}), function (req, res, done) {
  if (!req.body || !req.body.content) {
    return done('请求参数错误')
  }

  converterTo(req.body.content, 'pdf', function(err, result) {
    if (err) {
      return done('转化文件失败')
    }

    return res.send({name: result});
  });
});

// 转化 markdown 为 word
app.post('/markdownConverterWord', bodyParser.urlencoded({extended: false}), function (req, res, done) {
  if (!req.body || !req.body.content) {
    return done('请求参数错误')
  }

  converterTo(req.body.content, 'docx', function(err, result) {
    if (err) {
      return done('转化文件失败')
    }

    return res.send({name: result});
  });
});

// 转化 markdown 为 epub
app.post('/markdownConverterEpub', bodyParser.urlencoded({extended: false}), function (req, res, done) {
  if (!req.body || !req.body.content) {
    return done('请求参数错误')
  }

  converterTo(req.body.content, 'epub', function(err, result) {
    if (err) {
      return done('转化文件失败')
    }

    return res.send({name: result});
  });
});


// 错误处理
app.use(function (err, req, res, done) {
  return res.status(400).json({error: err});
});

// 500
app.use(function (err, req, res, done) {
  console.error(err);
  if (req.xhr || req.isApi) {
    res.status(500).json({
      error: '系统出错！'
    });
  } else {
    res.status(500).render('500', {
      code: 500,
      message: '系统出错！'
    });
  }
});

// 404
app.use(function (req, res) {
  console.warn('' + req.originalUrl + ' does not exist.');
  if (req.xhr || req.isApi) {
    res.status(404).json({
      error: '请求地址不存在！'
    });
  } else {
    res.status(404).render('404', {
      code: 404,
      message: '当前页面不存在！'
    });
  }
});

app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});
