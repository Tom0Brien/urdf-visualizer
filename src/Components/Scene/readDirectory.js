function readDirectory(items, files) {
  const promises = [];
  for (const item of items) {
    const entry = item.webkitGetAsEntry();
    promises.push(
      new Promise((resolve) => {
        traverseFileTree(entry, files, resolve);
      })
    );
  }

  return Promise.all(promises);
}

function traverseFileTree(item, files, finalResolve) {
  function traverseFileTreeImpl(item) {
    // Item is file
    if (item.isFile) {
      return new Promise((resolve) => {
        item.file((file) => {
          files[file.name] = file;
          resolve();
        });
      });
    }

    // Item is directory

    // Create a reader and read its contents
    const reader = item.createReader();

    return new Promise((resolve) => {
      const promises = [];

      const readNextEntries = () => {
        reader.readEntries((entries) => {
          if (entries.length === 0) {
            Promise.all(promises).then(() => resolve());
          } else {
            for (const entry of entries) {
              promises.push(traverseFileTreeImpl(entry));
            }
            readNextEntries();
          }
        });
      };
      readNextEntries();
    });
  }

  traverseFileTreeImpl(item).then(() => finalResolve());
}

export default readDirectory;
