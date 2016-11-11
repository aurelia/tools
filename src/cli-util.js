module.exports = {
  proxySpawned: function proxySpawned(spawned, outputPrefix, continueWhenFailed, onDone) {
    if (outputPrefix) {
      outputPrefix = '[' + outputPrefix + '] ';
    }
    spawned.stdout.on( 'data', data => {
      const text = data.toString().trim();
      if (text)
        console.log( outputPrefix || '' + text );
    });

    spawned.stderr.on( 'data', data => {
      const text = data.toString().trim();
      if (text)
        console.error( outputPrefix || '' + text );
    });

    spawned.on( 'close', code => {
      if (onDone) onDone(code);
      if (!continueWhenFailed && code > 0) {
        process.exit(1);
      }
    });
  }
}
