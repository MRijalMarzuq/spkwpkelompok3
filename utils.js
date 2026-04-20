function formatNumber(num) {
    if (num === null || num === undefined || num === "") return "";
    let parsed = parseFloat(num);
    if (isNaN(parsed)) return num;
    return parsed.toLocaleString('id-ID', { maximumFractionDigits: 3 });
}

function unformatNumber(str) {
    if (str === null || str === undefined || str === "") return NaN;
    str = str.toString().trim();
    if (str.includes(',')) {
        // Format Indonesia: koma = desimal, titik = ribuan
        str = str.replace(/\./g, '').replace(',', '.');
    } else {
        let dotCount = (str.match(/\./g) || []).length;
        if (dotCount > 1) {
            // Lebih dari 1 titik = pasti pemisah ribuan (misal 3.500.000)
            str = str.replace(/\./g, '');
        } else if (dotCount === 1) {
            let parts = str.split('.');
            // Jika bagian setelah titik tepat 3 digit = pemisah ribuan
            if (parts[1].length === 3) {
                str = str.replace(/\./g, '');
            }
            // Jika tidak (misal "6.1", "0.3") = titik desimal, biarkan
        }
    }
    return parseFloat(str);
}

function formatCell(cell) {
    let text = cell.innerText.trim();
    let val = unformatNumber(text);
    if (!isNaN(val) && text !== "") {
        cell.innerText = formatNumber(val);
    }
    validateData();
}

function validateData() {
    const btn = document.getElementById('btnHitung');
    const table = document.getElementById('spkTable');
    if (!table || table.rows.length <= 3) {
        if (btn) btn.disabled = true;
        return;
    }

    let isComplete = true;
    outer:
    for (let r = 1; r < table.rows.length; r++) {
        if (r === 2) continue; // baris Tipe (dropdown), skip
        let cells = table.rows[r].cells;
        for (let c = 0; c < cells.length; c++) {
            // Skip kolom Aksi (kolom terakhir)
            if (c === cells.length - 1) continue;
            // Skip sel yang mengandung select atau button
            if (cells[c].querySelector('select') || cells[c].querySelector('button')) continue;
            // Skip kolom nama (c=0) untuk semua baris karena berisi teks
            if (c === 0) continue;

            let text = cells[c].innerText.trim();
            if (text === "" || text === "-") { isComplete = false; break outer; }
            let num = unformatNumber(text);
            if (isNaN(num)) { isComplete = false; break outer; }
        }
    }

    if (btn) btn.disabled = !isComplete;
}

document.addEventListener('input', function(e) {
    if (e.target.hasAttribute('contenteditable')) validateData();
});
