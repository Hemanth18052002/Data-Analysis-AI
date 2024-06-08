const ground_d1 = document.querySelector('.d1');
const ground_d2 = document.querySelector('.d2');
const ground_d3 = document.querySelector('.d3');
const ground_d4 = document.querySelector('.d4');

ground_d2.style.display = 'none';
ground_d3.style.display = 'none';
ground_d4.style.display = 'none';

// DataCollection
const updateFile = document.querySelector('.updateFileName');
updateFile.addEventListener("change", updateFileName);
function updateFileName() {
    const fileInput = document.getElementById('fileInput');
    const fileNameSpan = document.getElementById('fileName');

    if (fileInput.files.length > 0) {
        const fileName = fileInput.files[0].name;
        fileNameSpan.textContent = fileName + ' click for preview';
    }
}

// Preview File
var file = fileInput;

function previewFile(file) {
    document.getElementById('loadingIndicator').style.display = 'block';
    setTimeout(function() {
        document.getElementById('loadingIndicator').style.display = 'none';
    }, 3000);

    console.log("File: ",file)
    const modal = document.querySelector('.myModal');
    modal.style.display = 'block';
    const modalContent = document.querySelector('.modalContent');
    const previewTable = document.querySelector('.previewTable');
    if (file.files.length > 0) {
        const file1 = file.files[0];
        const reader = new FileReader();
        reader.onload = function(event) {
            const contents = event.target.result;
            const rows = contents.split('\n');
            previewTable.innerHTML = '';

            rows.forEach(row => {
                const cells = row.split(',');
                const newRow = previewTable.insertRow();
                cells.forEach(cell => {
                    const newCell = newRow.insertCell();
                    newCell.textContent = cell;
                });
            });
            
        };
        console.log("Y");
        reader.readAsText(file1);
    }
}

// Close X
document.querySelector('.closeModal').addEventListener("click", closeModal);
function closeModal() {
    document.querySelector('.myModal').style.display = 'none';
}

// Download Button
document.querySelector('.downloadFile').addEventListener("click", function(){
    downloadFile(file);
});
function downloadFile(file) {
    if (file.files.length > 0) {
        const file1 = file.files[0];
        const url = URL.createObjectURL(file1);
        const a = document.createElement('a');
        a.href = url;
        a.download = file1.name;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        closeModal();
    }
}


// Data Collection Preview Button
const previewfile = document.querySelector('.previewFile');
previewfile.addEventListener("click", function(){
    previewFile(file);
});

// Data Collection Save and Next button
document.getElementById('DCNext').addEventListener('click', function() {
    var fileInput1 = document.getElementById('fileInput');
    var formData = new FormData();
    formData.append('file', fileInput1.files[0]);

    fetch('/infodesc', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.error) {alert(data.error);}
        else {
            var datai = '';
            datai = data.infot.replace(/\n/g, "<br>")
            var divinfo = document.getElementById('info');
            divinfo.innerHTML = "<h3>Info :</h3>"+datai;

            var formattedData = '<h3>Description :</h3>';
            var desc = Object.entries(data.desc)
            console.log(Object.keys(desc[0][1]));
            formattedData += "<br><table><thead><th>#</th>"
            for (const [key, value] of desc)
            {
                formattedData += "<th>"+key+"</th>";
            }
            formattedData += "<th>#</th></thead><tbody>"

            var keys = Object.keys(desc[0][1]);
            console.log(keys);
            for (let i = 0; i < keys.length; i++)
            {
                formattedData += "<tr><td><b>"+ keys[i] + "</b></td>"
                for (const [key, value] of desc)
                {
                    formattedData += "<td>"+ Math.round(value[keys[i]] * 10000) / 10000+"</td>"
                }
                formattedData += "<td><b>"+ keys[i] + "</b></td></tr>"
            }
            formattedData += "</tbody></table>"
            
            var adddivid = document.getElementById('desc');
            adddivid.innerHTML = formattedData;
            ground_d2.style.display = 'block';
            ground_d1.style.display = 'none';
            }
        })
    .catch(error => {
        console.error('Error:', error);
    });
});


// Data Inspection Preview Button
const previewbutton1 = document.querySelector('.pb1');
previewbutton1.addEventListener('click', function(){
    previewFile(file);
});

// Data Inspection Save and Next button
document.getElementById('DINext').addEventListener('click', function() {
    var fileInput = document.getElementById('fileInput');
    var file = fileInput.files[0];
    var formData = new FormData();
    formData.append('file', file);

    fetch('/RmNuDu', {
        method: 'POST',
        body: formData
    })
    .then(response => response.json())
    .then(data => {
        if (data.file_path) {
            ground_d3.style.display = 'block';
            document.getElementById('rmsuccess').innerHTML = "SuccessFully Removed NULLS & Duplicates"
        }
        else{console.error('Errori:', data.error);}
    })
    .catch(error => {console.error('Error:', error);});
    ground_d2.style.display = 'none';
});

// Data Cleaning Preview Button
const previewbutton2 = document.querySelector('.pb2');
previewbutton2.addEventListener('click', function(){
    const startingName = 'infodesc_';
    var path = '';
    const entriesArray = Array.from('./webdev_project/project/uploads');

    entriesArray.forEach(entry => {
        if (entry.isFile) {
            if (entry.name.startsWith(startingName)) {
                path = entry.fullPath;
                console.log(path);
            }
        }
    });

    // var file = "";
    fetch(path)
    .then(response => {response.text();})
    .then(csvData => {file = csvData;})
    .catch(error => {console.error('Error fetching the file:', error);});
    // console.log(file);
    previewFile(file);
});

// Data Cleaning Save and Next button
document.getElementById('DClNext').addEventListener('click', function() {
    ground_d4.style.display = 'block';
    ground_d3.style.display = 'none';
});