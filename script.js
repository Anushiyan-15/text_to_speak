// //    function speak(){
// //             const input = document.getElementById('text').value;
// //             const uternance = new SpeechSynthesisUtterance(input);
// //             speechSynthesis.speak(uternance);
// //         }

// // function speak() {
// //     const textInput = document.getElementById('text').value;
// //     const fileInput = document.querySelector('input[type="file"]').files[0];

// //     // Function to speak a string
// //     function speakText(text) {
// //         if (!text) {
// //             alert("Please enter text or upload a file!");
// //             return;
// //         }
// //         const utterance = new SpeechSynthesisUtterance(text);
// //         utterance.lang = 'en-US'; // You can change the language
// //         window.speechSynthesis.speak(utterance);
// //     }

// //     // If a file is selected, read it
// //     if (fileInput) {
// //         const reader = new FileReader();
// //         reader.onload = function(e) {
// //             const fileText = e.target.result;
// //             speakText(fileText);
// //         }
// //         reader.readAsText(fileInput);
// //     } else {
// //         // Otherwise, speak the text input
// //         speakText(textInput);
// //     }
// // }


// async function speak() {
//     const textInput = document.getElementById('text').value;
//     const fileInput = document.getElementById('fileInput').files[0];

//     function speakText(text) {
//         if (!text) {
//             alert("Please enter text or upload a file!");
//             return;
//         }
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.lang = 'en-US';
//         window.speechSynthesis.speak(utterance);
//     }

//     if (fileInput) {
//         const fileName = fileInput.name;
//         const ext = fileName.split('.').pop().toLowerCase();

//         if (ext === "txt" || ext === "csv" || ext === "json") {
//             const reader = new FileReader();
//             reader.onload = e => speakText(e.target.result);
//             reader.readAsText(fileInput);
//         }
//         else if (ext === "pdf") {
//             const arrayBuffer = await fileInput.arrayBuffer();
//             const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
//             let text = "";
//             for (let i = 1; i <= pdf.numPages; i++) {
//                 const page = await pdf.getPage(i);
//                 const content = await page.getTextContent();
//                 text += content.items.map(item => item.str).join(" ") + "\n";
//             }
//             speakText(text);
//         }
//         else if (ext === "docx") {
//             const reader = new FileReader();
//             reader.onload = async e => {
//                 const result = await mammoth.extractRawText({arrayBuffer: e.target.result});
//                 speakText(result.value);
//             }
//             reader.readAsArrayBuffer(fileInput);
//         }
//         else {
//             alert("File format not supported. Supported: txt, csv, json, pdf, docx");
//         }
//     } else {
//         speakText(textInput);
//     }
// }


async function speak() {
    const textInput = document.getElementById('text').value;
    const fileInput = document.getElementById('fileInput').files[0];
    const display = document.getElementById('textDisplay');

    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    async function speakLines(text) {
        const lines = text.split(/\r?\n/).filter(l => l.trim() !== '');
        display.innerHTML = lines.map(line => `<div>${line}</div>`).join('');

        for (let i = 0; i < lines.length; i++) {
            const utterance = new SpeechSynthesisUtterance(lines[i]);
            utterance.lang = 'en-US';
            display.querySelectorAll('div').forEach(div => div.classList.remove('highlight'));
            display.querySelectorAll('div')[i].classList.add('highlight');

            window.speechSynthesis.speak(utterance);

            // Wait until this line is finished
            await new Promise(resolve => {
                utterance.onend = resolve;
            });
        }

        display.querySelectorAll('div').forEach(div => div.classList.remove('highlight'));
    }

    if (fileInput) {
        const fileName = fileInput.name;
        const ext = fileName.split('.').pop().toLowerCase();

        if (ext === "txt" || ext === "csv" || ext === "json") {
            const reader = new FileReader();
            reader.onload = e => speakLines(e.target.result);
            reader.readAsText(fileInput);
        }
        else if (ext === "pdf") {
            const arrayBuffer = await fileInput.arrayBuffer();
            const pdf = await pdfjsLib.getDocument({data: arrayBuffer}).promise;
            let text = "";
            for (let i = 1; i <= pdf.numPages; i++) {
                const page = await pdf.getPage(i);
                const content = await page.getTextContent();
                text += content.items.map(item => item.str).join(" ") + "\n";
            }
            speakLines(text);
        }
        else if (ext === "docx") {
            const reader = new FileReader();
            reader.onload = async e => {
                const result = await mammoth.extractRawText({arrayBuffer: e.target.result});
                speakLines(result.value);
            }
            reader.readAsArrayBuffer(fileInput);
        }
        else {
            alert("File format not supported. Supported: txt, csv, json, pdf, docx");
        }
    } else {
        speakLines(textInput);
    }
}
