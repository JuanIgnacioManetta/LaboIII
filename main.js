import { GoogleGenerativeAI } from "@google/generative-ai";
// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI("AIzaSyCTVnyDpBA9cdgYoKCKpTHiTv_GYDPLvXE");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const formEl = document.getElementById("form");

let prompt = String.Empty;

document.addEventListener('DOMContentLoaded', function() {

  formEl.addEventListener('submit', function(event){
    event.preventDefault();
    prompt = document.getElementById("input").value;
    run();
    
  })
});


async function run() {
 

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  console.log(text);
  const divEl = document.getElementById("respuesta-div");
  const nuevoParrafo = document.createElement('p');
  nuevoParrafo.innerText = text;
  divEl.appendChild(nuevoParrafo);
}





