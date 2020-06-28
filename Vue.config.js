module.exports = {
  pluginOptions: {
    electronBuilder: {
      nodeIntegration: true,
      builderOptions: {
        appId: 'com.leifgehrmann.allegro',
        productName: 'Allegro',
        directories: {
          buildResources: 'resources',
        },
      },
    },
  },
};
