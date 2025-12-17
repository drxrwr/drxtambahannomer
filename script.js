const fileInput = document.getElementById('vcfFile');
const groupsDiv = document.getElementById('groups');
const downloadBtn = document.getElementById('download');
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
Object.keys(groups).forEach(name => {
const div = document.createElement('div');
div.className = 'group';


div.innerHTML = `
<h3>${name}</h3>
<input type="text" value="${name}" class="group-name">
<div class="small">Nomor tambahan (1 baris 1 nomor)</div>
<textarea class="extra"></textarea>
<div class="row">
<button class="btn-alt up">Tambah Atas</button>
<button class="btn down">Tambah Bawah</button>
</div>
`;


groupsDiv.appendChild(div);
});
}


downloadBtn.addEventListener('click', () => {
});
