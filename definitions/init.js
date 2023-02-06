var db = MAIN.db = MEMORIZE('data');

if (!db.config)
	db.config = {};

if (!db.items)
	db.items = [];

var config = db.config;

if (!config.name)
	config.name = 'UI Studio';

if (!config.cdn)
	config.cdn = '//cdn.componentator.com';

// Fixed settings
CONF.allow_custom_titles = true;
CONF.version = '1';
CONF.op_icon = 'ti ti-pencil-paintbrush';

// Loads configuration
LOADCONFIG(db.config);

// UI components
COMPONENTATOR('ui', 'exec,locale,aselected,page,viewbox,input,importer,box,validate,loading,selected,intranetcss,notify,message,errorhandler,empty,menu,ready,search,tangular-filesize,sounds,datagrid,unsaved,clipboard,approve,searchinput');

// Permissions
ON('ready', function() {
	for (var key in F.plugins) {
		var item = F.plugins[key];
		if (item.permissions)
			OpenPlatform.permissions.push.apply(OpenPlatform.permissions, item.permissions);
	}
});