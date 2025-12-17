const fileInput = document.getElementById('vcfFile');
const groupsDiv = document.getElementById('groups');
const downloadBtn = document.getElementById('download');
const summaryDiv = document.getElementById('summary');
const outputName = document.getElementById('outputName');

let originalFileName = 'output.vcf';
let groups = {};

fileInput.addEventListener('change', () => {
  const file = fileInput.files[0];
  if(!file) return;

  originalFileName = file.name;
  const reader = new FileReader();
  reader.onload = e => parseVCF(e.target.result);
  reader.readAsText(file);
});

function parseVCF(text){
  groups = {};
  groupsDiv.innerHTML = '';

  const cards = text.split(/BEGIN:VCARD/i).slice(1);

  cards.forEach(card => {
    const fnMatch = card.match(/FN[^:]*:(.+)/i);
    const telMatch = card.match(/TEL[^:]*:(.+)/i);
    if(!fnMatch || !telMatch) return;

    const name = fnMatch[1].trim();
    const baseName = name.replace(/\s+\d+$/, '');

    let phone = telMatch[1].replace(/[^0-9+]/g,'');
    if(!phone.startsWith('+')) phone = '+' + phone;

    if(!groups[baseName]) groups[baseName] = [];
    groups[baseName].push(phone);
  });

  renderGroups();
}

function renderGroups(){
  let summaryText = [];
  groupsDiv.innerHTML = '';

  Object.keys(groups).forEach(name => {
    const count = groups[name].length;
    summaryText.push(`${name}: ${count} nomor`);

    const div = document.createElement('div');
    div.className = 'group';

    div.innerHTML = `
      <h3>${name} <span class="small">(${count})</span></h3>
      <input type="text" value="${name}" class="group-name">
      <div class="small">Nomor tambahan (1 baris 1 nomor)</div>
      <textarea class="extra"></textarea>
      <div class="row">
        <button type="button" class="btn-alt up">Tambah Atas</button>
        <button type="button" class="btn down active">Tambah Bawah</button>
      </div>
    `;

    const upBtn = div.querySelector('.up');
    const downBtn = div.querySelector('.down');

    upBtn.onclick = () => {
      upBtn.classList.add('active');
      downBtn.classList.remove('active');
    };

    downBtn.onclick = () => {
      downBtn.classList.add('active');
      upBtn.classList.remove('active');
    };

    groupsDiv.appendChild(div);
  });

  summaryDiv.textContent = 'Terdeteksi → ' + summaryText.join(' | ');
}

downloadBtn.addEventListener('click', () => {
  let output = '';

  document.querySelectorAll('.group').forEach(groupEl => {
    const name = groupEl.querySelector('.group-name').value.trim();
    const extra = groupEl.querySelector('.extra').value
      .split(/
/)
      .map(n => n.replace(/[^0-9+]/g,''))
      .filter(Boolean)
      .map(n => n.startsWith('+') ? n : '+' + n);

    const base = groups[name] || [];
    const isTop = groupEl.querySelector('.up').classList.contains('active');
    const all = isTop ? [...extra, ...base] : [...base, ...extra];

    all.forEach((num, i) => {
      output += `BEGIN:VCARD
VERSION:3.0
FN:${name} ${i+1}
TEL:${num}
END:VCARD
`;
    });
  });

  if(!output){
    alert('Tidak ada data untuk didownload');
    return;
  }

  const blob = new Blob([output], {type:'text/vcard;charset=utf-8'});
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = outputName.value.trim() || originalFileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
});
    const extra = groupEl.querySelector('.extra').value
      .split(/\n/)
      .map(n => n.replace(/[^0-9+]/g,''))
      .filter(Boolean)
      .map(n => n.startsWith('+') ? n : '+' + n);

    const base = groups[name] || [];
    const isTop = groupEl.querySelector('.up').classList.contains('active');
    const all = isTop ? [...extra, ...base] : [...base, ...extra];

    all.forEach((num, i) => {
      output += `BEGIN:VCARD\nVERSION:3.0\nFN:${name} ${i+1}\nTEL:${num}\nEND:VCARD\n`;
    });
  });

  const blob = new Blob([output], {type:'text/vcard'});
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = outputName.value.trim() || originalFileName;
  a.click();
});
