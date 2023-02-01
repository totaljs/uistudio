exports.icon = 'ti ti-book-open';
exports.name = '@(Library)';
exports.position = 1;
exports.permissions = [{ id: 'library', name: 'Library' }, { id: 'library_create', name: 'Library: Create' }];
exports.visible = user => user.sa || user.permissions.includes('library');

exports.install = function() {

	ROUTE('+API    /api/    -library              *Library   --> list');
	ROUTE('+API    /api/    +library_save         *Library   --> save');
	ROUTE('+API    /api/    +library_publish      *Library   --> publish');
	ROUTE('+API    /api/    +library_remove/id    *Library   --> remove');

	ROUTE('POST /render/');
	ROUTE('GET  /render/{id}/', render);

};

NEWPUBLISH('render', 'id:String,name:String,version:String,group:String,icon:Icon,color:Color,dtcreated:Date,dtupdated:Date,size:Number');

function render(id) {

	var $ = this;
	var item = MAIN.db.items.findItem('id', id);
	if (item) {
		CONF.allow_tms && PUBLISH('render', item);
		$.view('publish');
	} else
		$.invalid(404);

}