exports.icon = 'ti ti-book-open';
exports.name = '@(Library)';
exports.position = 1;
exports.permissions = [{ id: 'library', name: 'Library' }, { id: 'library_create', name: 'Library: Create' }];
exports.visible = user => user.sa || user.permissions.includes('library');

exports.install = function() {

	ROUTE('+API    /api/    -library                *Library   --> list');
	ROUTE('+API    /api/    +library_save           *Library   --> save');
	ROUTE('+API    /api/    +library_clone/{id}     *Library   --> clone');
	ROUTE('+API    /api/    +library_publish        *Library   --> publish');
	ROUTE('+API    /api/    +library_remove/{id}    *Library   --> remove');

	ROUTE('POST  /render/');
	ROUTE('GET   /render/{id}/', render);
	ROUTE('GET   /play/', play);

	ROUTE('+GET  /download/{id}/', download);
	ROUTE('+GET  /download/', download);

	ROUTE('FILE  /db.json', db);

};

NEWPUBLISH('render', 'id:String,name:String,version:String,group:String,icon:Icon,color:Color,dtcreated:Date,dtupdated:Date,size:Number');

function play() {
	var $ = this;
	if ($.query.url) {
		$.view('play');
	} else
		$.invalid('@(Missing "url" argument)');
}

function render(id) {

	var $ = this;
	var item = MAIN.db.items.findItem('id', id);
	if (item) {
		CONF.allow_tms && PUBLISH('render', item);
		$.view('publish');
	} else
		$.invalid(404);

}

function download(id) {
	var $ = this;

	if (id) {
		var item = MAIN.db.items.findItem('id', id);
		if (item)
			$.file('/data/' + id + '_editor.json', item.name + '.json');
		else
			$.invalid(404);
	} else {

		var arr = [];
		for (var item of MAIN.db.items)
			arr.push(item.id + '_editor.json');

		var filename = PATH.tmp(Date.now().toString(36) + '.zip');

		SHELL('zip {0} {1}'.format(filename, arr.join(' ')), function(err) {
			if (err)
				$.invalid(err);
			else
				$.file('~' + filename, 'export.zip');
		}, PATH.public('data'));
	}
}

function db(req, res) {

	F.Fs.readdir(PATH.public('components'), function(err, response) {

		var obj = {};
		var arr = (CONF.components || '').split(',').trim();

		for (let i = 0; i < arr.length; i++) {
			if (arr[i])
				obj['cdn' + i] = arr[i];
		}

		if (response) {
			for (let m of response)
				obj[m] = '/components/{0}/editor.html';
		}

		res.json(obj);
	});

}
