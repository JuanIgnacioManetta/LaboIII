import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI("AIzaSyCTVnyDpBA9cdgYoKCKpTHiTv_GYDPLvXE");

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash"});

const chatInput = document.querySelector("#chat-input");
const sendButton = document.querySelector("#send-btn");
const chatContainer = document.querySelector(".chat-container");
const themeButton = document.querySelector("#theme-btn");
const deleteButton = document.querySelector("#delete-btn");

let userText = null;
const API_KEY = genAI.apiKey;

const chat = model.startChat({
  history: [],
});

//Carga los datos del chatbot desde el almacenamiento local
const loadDataFromLocalstorage = () => {
    const themeColor = localStorage.getItem("themeColor");

    document.body.classList.toggle("light-mode", themeColor === "light_mode");
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";

    const defaultText = `<div class="default-text">
                            <h1>ChatGPT Clone</h1>
                            <p>Empieza una conversacion con ElDiegoBot.<br> El historial del chat sera mostrado aqui.</p>
                        </div>`

    chatContainer.innerHTML = localStorage.getItem("all-chats") || defaultText;
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
}

loadDataFromLocalstorage();

//Crea un elemento de chat
const createChatElement = (content, className) => {
    const chatDiv = document.createElement("div");
    chatDiv.classList.add("chat", className);
    chatDiv.innerHTML = content;
    return chatDiv;
}

//Obtiene la respuesta del chatbot
const getChatResponse = async (incomingChatDiv) => {
  const prompt = userText;  // Usamos el texto del usuario como prompt para generar contenido

  try {
      // Generamos contenido usando el modelo obtenido previamente
      const result = await model.generateContent(prompt);
      const generatedText = result.response.text();

      // Creamos un elemento <p> para mostrar la respuesta generada
      const pElement = document.createElement("p");
      pElement.textContent = generatedText;

      // Actualizamos la interfaz de usuario con la respuesta generada
      incomingChatDiv.querySelector(".typing-animation").remove();
      incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
      localStorage.setItem("all-chats", chatContainer.innerHTML);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);

  } catch (error) {
      // Manejamos errores en caso de que falle la generación de contenido
      const pElement = document.createElement("p");
      pElement.classList.add("error");
      pElement.textContent = "Algo anduvo mal. Por favor, intenta de nuevo.";

      incomingChatDiv.querySelector(".typing-animation").remove();
      incomingChatDiv.querySelector(".chat-details").appendChild(pElement);
      localStorage.setItem("all-chats", chatContainer.innerHTML);
      chatContainer.scrollTo(0, chatContainer.scrollHeight);
  }
}

//Muestra la animacion de tipeo
const showTypingAnimation = () => {
  const html = `<div class="chat-content">
  <div class="chat-details">
  <img src="images/chatbot.jpg" alt="chatbot-img">
  <div class="typing-animation">
  <div class="typing-dot" style="--delay: 0.2s"></div>
  <div class="typing-dot" style="--delay: 0.3s"></div>
  <div class="typing-dot" style="--delay: 0.4s"></div>
  </div>
  </div>
  <span onclick="copyResponse(this)" class="material-symbols-rounded">content_copy</span>
  </div>`;
  
    const incomingChatDiv = createChatElement(html, "incoming");
    chatContainer.appendChild(incomingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    getChatResponse(incomingChatDiv);
}


const copyBtn = document.querySelector(".material-symbols-rounded");
const initialInputHeight = chatInput.scrollHeight;

//Maneja el chat saliente del usuario
const handleOutgoingChat = () => {
    userText = chatInput.value.trim();
    if (!userText) return;
    
    chatInput.value = "";
    chatInput.style.height = `${initialInputHeight}px`;
    
    const html = `<div class="chat-content">
    <div class="chat-details">
    <img src="images/user.jpg" alt="user-img">
    <p>${userText}</p>
    </div>
    </div>`;
    
    const outgoingChatDiv = createChatElement(html, "outgoing");
    chatContainer.querySelector(".default-text")?.remove();
    chatContainer.appendChild(outgoingChatDiv);
    chatContainer.scrollTo(0, chatContainer.scrollHeight);
    setTimeout(showTypingAnimation, 500);
}

//Elimina todo el historial del chat
deleteButton.addEventListener("click", () => {
    if(confirm("Seguro queres eliminar todo el chat?")) {
        localStorage.removeItem("all-chats");
        loadDataFromLocalstorage();
    }
});

//Cambia el tema de la interfaz de usuario
themeButton.addEventListener("click", () => {
    document.body.classList.toggle("light-mode");
    localStorage.setItem("themeColor", themeButton.innerText);
    themeButton.innerText = document.body.classList.contains("light-mode") ? "dark_mode" : "light_mode";
});

//Ajusta la altura del input de acuerdo al contenido ingresado
chatInput.addEventListener("input", () => {
    chatInput.style.height =  `${initialInputHeight}px`;
    chatInput.style.height = `${chatInput.scrollHeight}px`;
});

//Envia el mensaje del usuario al presionar la tecla Enter
chatInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleOutgoingChat();
    }
});

//Copia el texto de respuesta del chatbot
const copyResponse = (copyBtn) => {
    const reponseTextElement = copyBtn.parentElement.querySelector("p");
    navigator.clipboard.writeText(reponseTextElement.textContent);
    copyBtn.textContent = "done";
    setTimeout(() => copyBtn.textContent = "content_copy", 1000);
}

//Envia el mensaje del usuario al presionar el boton de enviar
sendButton.addEventListener("click", () => {
    handleOutgoingChat();
});

//Copia el texto de respuesta del chatbot al presionar el boton de copiar
chatContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("material-symbols-rounded")) {
        copyResponse(e.target);
    }
});

