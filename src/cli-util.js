module.export = {
  proxySpawned: function proxySpawned(spawned, outputPrefix, continueWhenFailed, onDone) {
    if (outputPrefix) {
      outputPrefix = '[' + outputPrefix + '] ';
    }
    spawned.stdout.on( 'data', data => {
      const text = data.toString();
      if (text)
        console.log( outputPrefix + data.toString() );
    });

    spawned.stderr.on( 'data', data => {
      const text = data.toString();
      if (text)
        console.error( outputPrefix + data.toString() );
    });

    spawned.on( 'close', code => {
      if (onDone) onDone(code);
      if (!continueWhenFailed && code > 0) {
        process.exit(1);
      }
    });
  }
}
