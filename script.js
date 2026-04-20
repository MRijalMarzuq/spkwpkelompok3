// --- MAIN LOADER SCRIPT ---
const jsFiles = [
    'data.js',
    'utils.js',
    'excel.js',
    'table.js',
    'wp.js'
];

jsFiles.forEach(file => {
    let scriptTag = document.createElement('script');
    scriptTag.src = file;
    scriptTag.async = false;
    document.head.appendChild(scriptTag);
});
