NEWSCHEMA('Library', function(schema) {

	schema.action('list', {
		name: 'List of items',
		action: function($) {
			$.callback(MAIN.db.items);
		}
	});

	schema.action('save', {
		name: 'Save item',
		input: 'data:Object',
		publish: 'id,name,group,icon,color,dtcreated,size,published,type,version,token',
		action: function($, model) {

			var data = model.data;
			var filename = PATH.public('/data/' + data.id + '_editor.json');
			var buffer = Buffer.from(JSON.stringify(data, null, '\t'), 'utf8');

			F.Fs.writeFile(filename, buffer, NOOP);

			var item = MAIN.db.items.findItem('id', data.id);
			if (item) {
				item.dtupdated = NOW;
			} else {
				item = {};
				item.id = data.id;
				item.token = GUID();
				item.dtupdated = NOW;
				item.dtcreated = NOW;
				MAIN.db.items.push(item);
			}

			item.size = buffer.length;
			item.name = data.name;
			item.version = data.version;
			item.icon = data.icon;
			item.color = data.color;
			item.type = data.type;
			item.category = data.category;
			item.group = data.group;
			item.inputs = data.inputs;
			item.outputs = data.outputs;
			item.description = data.description;

			MAIN.db.save();
			$.success();
			$.publish(item);
		}
	});

	schema.action('publish', {
		name: 'Publish item',
		input: 'data:Object',
		publish: 'id,name,group,icon,color,dtcreated,size,published,type,version,token',
		action: function($, model) {

			var data = model.data;
			var filename = PATH.public('/data/' + data.id + '.json');
			F.Fs.writeFile(filename, JSON.stringify(data), NOOP);

			var item = MAIN.db.items.findItem('id', data.id);
			if (item) {
				item.published = NOW;
				item.dtupdated = NOW;
				MAIN.db.save();
				$.publish(item);
			}

			$.success();
		}
	});

	schema.action('remove', {
		name: 'Remove item',
		params: 'id:String',
		publish: 'id,name,group,icon,color,dtcreated,size,published,type,version,token',
		action: function($) {
			var params = $.params;
			var index = MAIN.db.items.findIndex('id', params.id);
			if (index !== -1) {
				var item = MAIN.db.items[index];
				var path = PATH.public('/data/') + params.id;
				F.Fs.unlink(path + '.json', NOOP);
				F.Fs.unlink(path + '_editor.json', NOOP);
				MAIN.db.items.splice(index, 1);
				MAIN.db.save();
				$.success();
				$.publish(item);
			} else
				$.invalid(404);
		}
	});

	schema.action('export', {
		name: 'List of builds',
		action: function($) {
			var output = [];
			MAIN.db.items.wait(function(item, next) {

				if (item.published) {

					F.Fs.readFile(PATH.public('data/' + item.id + '.json'), function(err, response) {

						if (response) {
							var meta = JSON.parse(response.toString('utf8'), (key, val) => key !== 'components' && key !== 'children' ? val : null);
							output.push({ id: meta.id, icon: meta.icon, description: meta.description, type: meta.type, author: meta.author, version: meta.version, inputs: meta.inputs, outputs: meta.outputs });
						}

						next();
					});

				} else
					next();

			}, function() {
				$.callback(output);
			});
		}
	});

});