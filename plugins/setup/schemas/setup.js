NEWSCHEMA('Setup', function(schema) {

	schema.define('name', String, true);
	schema.define('totalapi', String);
	schema.define('allow_tms', Boolean);
	schema.define('secret_tms', String);
	schema.define('op_reqtoken', String);
	schema.define('op_restoken', String);
	schema.define('token', String);

	schema.action('permissions', {
		name: 'Check permissions',
		action: function($) {
			if (!UNAUTHORIZED($, 'setup'))
				$.success();
		}
	});

	schema.action('save', {
		name: 'Save configuration',
		action: function($, model) {
			COPY(model, MAIN.db.config);
			LOADCONFIG(model);
			MAIN.db.save();
			$.success();
		}
	});

	schema.action('read', {
		name: 'Read configuration',
		action: function($) {
			$.callback(MAIN.db.config);
		}
	});

	schema.action('account', {
		name: 'Read account data',
		action: async function($) {
			$.callback($.user.json ? $.user.json() : $.user);
		}
	});

});