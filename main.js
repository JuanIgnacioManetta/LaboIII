import { GoogleGenerativeAI } from "@google/generative-ai";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCTVnyDpBA9cdgYoKCKpTHiTv_GYDPLvXE");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const formEl = document.getElementById("form");

const promptPlus = "\n Escribe siempre con acento argentino, No uses emojies";

let promptOriginal = String.Empty;
let prompt = promptOriginal;
  
const chat = model.startChat({
  history: [],
});

document.addEventListener('DOMContentLoaded', function() {

  formEl.addEventListener('submit', function(event){
    event.preventDefault();
    promptOriginal = document.getElementById("input").value;
    prompt = promptOriginal + promptPlus;
    run();
    
  })
});

async function run() {
  let text = "";
  const result = await chat.sendMessage(prompt);
  const response = result.response;
  text = response.text();
  console.log(text);
  const divEl = document.getElementById("respuestas");
  const nuevoParrafoUser = document.createElement('p');
  nuevoParrafoUser.classList.add('user');
  const nuevoParrafoIA = document.createElement('p');
  nuevoParrafoIA.classList.add('ia');
  nuevoParrafoUser.innerText = promptOriginal;
  nuevoParrafoIA.innerText = text;
  divEl.appendChild(nuevoParrafoUser);
  divEl.appendChild(nuevoParrafoIA);
  console.log(history);
}





