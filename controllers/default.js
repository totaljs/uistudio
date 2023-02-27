exports.install = function() {

	ROUTE('+GET   /*', index);
	ROUTE('+POST  /upload/', upload, 1024 * 100);
	ROUTE('FILE   /download/*.*', download);
	ROUTE('FILE   /data/*.json', jsondata);

	CORS();

};

async function apps() {
	var self = this;

	if (CONF.token && self.query.token && self.query.token === CONF.token) {
		var data = {};
		data.name = CONF.name;
		data.items = await CALL('Library --> export').promise(self);
		self.json(data);
	} else
		self.invalid('Invalid token');
}

function index() {

	var self = this;
	var plugins = [];

	if (self.query.token) {
		apps.call(self);
		return;
	}

	for (var key in F.plugins) {
		var item = F.plugins[key];
		if (self.user.sa || !item.visible || item.visible(self.user)) {
			var obj = {};
			obj.id = item.id;
			obj.routes = item.routes;
			obj.position = item.position;
			obj.name = TRANSLATOR(self.user.language || '', item.name);
			obj.icon = item.icon;
			obj.import = item.import;
			plugins.push(obj);
		}
	}

	plugins.quicksort('position');
	self.view('index', plugins);
}

function upload() {

	var self = this;
	var arr = [];
	var hostname = self.hostname();

	self.files.wait(function(file, next) {
		var id = UID();
		file.fs('files', id, function(err, meta) {
			meta.url = hostname + '/download/' + FUNC.checksum(id) + '.' + meta.ext;
			arr.push(meta);
			next();
		});
	}, () => self.json(arr));
}

function download(req, res) {
	var id = req.split[1];
	id = id.substring(0, id.lastIndexOf('.'));
	var fileid = id.substring(0, id.lastIndexOf('-'));
	if (FUNC.checksum(fileid) === id)
		res.filefs('files', fileid, true);
	else
		res.throw404();
}

function jsondata(req, res) {
	res.nocache();
	res.continue();
}