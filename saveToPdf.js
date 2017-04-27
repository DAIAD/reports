var page = require('webpage').create();
var system = require('system');

if (system.args.length < 10 || system.args.length > 10) {
  console.log('Usage: saveToPdf.js URL API locale username password userKey from to output');
  phantom.exit();
}
else {
  const address = system.args[1];
  const api= system.args[2];
  const locale = system.args[3];
  const username = system.args[4];
  const password = system.args[5];
  const userKey = system.args[6];
  const from = system.args[7];
  const to = system.args[8];
  const output = system.args[9];
  
  const dpi = 96;

  const data = {
    username:username,
    password:password,
    userKey: userKey,
    from:from,
    to:to,
    locale:locale,
    api:api
  };

  const pageWidth = 8.3*dpi;
  const pageHeight = 11.7*dpi;
  
  page.viewportSize = { width: pageWidth, height: pageHeight };
  page.clipRect = { top: 0, left: 0, width: pageWidth, height: pageHeight };
  page.paperSize = {
    format: 'A4',
    orientation: 'portrait',
    margin: '2.5cm',
    footer: {
      height: '1.25cm',
      contents: phantom.callback(function(pageNum, numPages) {
        if (numPages > 1) {
          return "<div style='font-size:0.8em'><span style='color:#666; float:right'>" + pageNum + "/" + numPages + "</span></div>";
        }
        else {
          return "";
        }
      })
      }
  };

  page.onConsoleMessage = function(msg) {
    console.log(msg);
  }

  var errors = [];
  page.onError = function(msg, trace) {
    errors.push(msg);
    console.log('\n' + msg);
  }

  const settings = {
    operation: "POST",
    encoding: "utf8",
    headers: {
      "Content-Type": "application/json"
    },
    data: JSON.stringify(data)
  };

  page.open(address, settings, function(status) {
    console.log('\nOpened page with status:', status);
    if (status !== 'success') {
      console.error('Unable to execute POST request');
      phantom.exit();
    } 
    if (errors.length > 0) {
      console.log('\nFound ' + errors.length + ' error(s)');
    } 

    window.setTimeout(function() {
      page.render(output);
      console.log('\nRendered PDF successfully!');
      phantom.exit();
    }, 1000);
  });
}
