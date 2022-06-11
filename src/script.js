const iput = document.querySelector("input");
const letters = Array.from(document.querySelectorAll("[data-letters]"));
const specs = Array.from(document.querySelectorAll("[data-spec]"));
const textExample = document.querySelector("#textExample");
const symbolsPerMinute = document.querySelector("#symbolsPerMinute");
const errorPercent = document.querySelector("#errorPercent");




const text = `Much of today's business is conducted across international borders, and while the majority of the global business community might share the use of English as a common language, the nuances and expectations of business communication might differ greatly from culture to culture. A lack of understanding of the cultural norms and practices of our business acquaintances can result in unfair judgements, misunderstandings and breakdowns in communication. Here are three basic areas of differences in the business etiquette around the world that could help stand you in good stead when you next find yourself working with someone from a different culture.`;

const party = createParty(text);

init();

function init() {
  input.addEventListener("keydown", keydownHandler);
  input.addEventListener("keyup", keyupHandler);

  viewUpdate();
}

function keydownHandler(){
  event.preventDefault();
  const letter = letters.find((x)=>x.dataset.letters.includes(event.key));
  if(letter){
    letter.classList.add("pressed");
    press(event.key);
    return;
  }
  let key = event.key.toLowerCase()

  if(key === " "){
    key = "space";
    press(" ");
  }

    if( key === "enter"){
      press("\n");
    }

  const ownSpec = specs.filter((x)=>x.dataset.spec === key);
  if(ownSpec.length){
    ownSpec.forEach((spec)=>spec.classList.add("pressed"));
    return
  }

}

function keyupHandler(){
  event.preventDefault();
  const letter = letters.find((x)=>x.dataset.letters.includes(event.key));
  if(letter){
    letter.classList.remove("pressed");

    return;
  }
  let key = event.key.toLowerCase();

  if(key === " "){
    key = "space";
  }


  const ownSpec = specs.filter((x)=>x.dataset.spec === key);
  if(ownSpec.length){
    ownSpec.forEach((spec)=>spec.classList.remove("pressed"));
    return;
  }
  console.warn("unknown key", event)
}

function createParty(text){
  const party = {
    text,
    strings: [],
    maxStringLength: 70,
    maxShowStrings : 3,
    currentStringIndex : 0,
    currentPressedIndex: 0,
    errors: [],
    started : false,

    statisticFlag : false,
    timerCounter: 0,
    startTimer: 0,
    errorCounter: 0,
    commonCounter: 0

  };

  party.rext = party.text.replace(/\n/g, "\n ")
  const words = party.text.split(" ");

  let string = []
  for(const word of words){
      const newStringLength = [...string, word].join(" ").length + !word.includes("\n");

      if(newStringLength > party.maxStringLength ){
        party.strings.push(string.join(" ") + " ");
        string = [];
      }
      string.push(word)

      if(word.includes("\n")){
        party.strings.push(string.join(" "));
        string = [];
      }
  }

  if(string.length){
    party.strings.push(string.join(" "));
  }

  return party;
}

function press(letter){

  party.started = true;

  if(!party.statisticFlag){
    party.statisticFlag = true;

    party.startTimer = Date.now();
  }
  const string = party.strings[party.currentStringIndex];
  const mustLetter = string[party.currentPressedIndex];


  if(letter === mustLetter){
    party.currentPressedIndex++;
    if(string.length <= party.currentPressedIndex){
      party.currentPressedIndex = 0;
      party.currentStringIndex++;

      party.statisticFlag = false;

      party.timerCounter = Date.now() - party.startTimer;
    }
  }
  else if(!party.errors.includes(mustLetter)) {
    party.errors.push(mustLetter);
    party.errorCounter++;
  }

  party.commonCounter++;

  viewUpdate();
}

function viewUpdate(){

  const string = party.strings[party.currentStringIndex];

  const showedStrings = party.strings.slice(party.currentStringIndex, party.currentStringIndex + party.maxShowStrings);
  const div = document.createElement("div");

  const firstLine = document.createElement("div");
  firstLine.classList.add("line");
  div.append(firstLine);

  const done = document.createElement("span");
  done.classList.add("done");
  done.textContent = string.slice(0, party.currentPressedIndex);
  firstLine.append(done, ...string.slice(party.currentPressedIndex).split("").map((letter) =>{

/*      if(letter === " "){
        return "·";
      }
*/
    /**/
    if(party.errors.includes(letter)){
      const errorSpan = document.createElement("span");
      errorSpan.classList.add("hint");
      errorSpan.textContent = letter;
      return errorSpan;
    }

    return letter;
  }));

/**/
  for(let i = 1; i<showedStrings.length; i++){
    const line = document.createElement("div");
    line.classList.add("line");
    div.append(line);
    line.append(...showedStrings[i].split("").map((letter) =>{
    
  /* if(letter === " "){
      return "·";
    }
*/
      /**/
      if(party.errors.includes(letter)){
        const errorSpan = document.createElement("span");
        errorSpan.classList.add("hint");
        errorSpan.textContent = letter;
        return errorSpan;
      }

        return letter;
      })
    );
  }

  textExample.innerHTML = "";
  textExample.append(div);

  /*console.log(string.slice(0,party.currentPressedIndex))
*/
  input.value = string.slice(0,party.currentPressedIndex);

  if(!party.statisticFlag && party.started ){
    symbolsPerMinute.textContent = Math.round((60000 * party.commonCounter) / party.timerCounter);

    errorPercent.textContent = Math.floor((10000 * party.errorCounter )/ party.commonCounter) / 100  + "%";
  }

}
