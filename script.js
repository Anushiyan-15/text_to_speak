   function speak(){
            const input = document.getElementById('text').value;
            const uternance = new SpeechSynthesisUtterance(input);
            speechSynthesis.speak(uternance);
        }