FUNC.checksum = function(id) {
	return id + '-' + HASH(id + CONF.secret_files).toString(36);
};