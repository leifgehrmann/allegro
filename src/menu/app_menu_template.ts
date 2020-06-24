export const appMenuTemplate = {
  label: 'Allegro',
  submenu: [
    {role: 'about'},
    {type: 'separator'},
    {
      label: 'Preferences...',
      click: () => {
        // Do Nothing
      }
    },
    {type: 'separator'},
    {role: 'services', submenu: []},
    {type: 'separator'},
    {role: 'hide'},
    {role: 'unhide'},
    {type: 'separator'},
    {role: 'quit'}
  ]
};
