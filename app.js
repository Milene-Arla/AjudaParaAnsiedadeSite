// Configuração da URL base da API Spring Boot
const API_BASE_URL = "http://localhost:8080/api";

// Função auxiliar para gerar HTML dos resultados
function gerarHTMLResultado(dado) {
  return `
    <div class="item-resultado">
      <h2>
        <a href="${dado.link}" target="_blank">${dado.titulo}</a>
      </h2>
      <p class="descricao-meta">${dado.descricao}</p>
      <a href="${dado.link}" target="_blank">Mais informações</a>
    </div>
  `;
}

// Função para realizar a pesquisa
function pesquisar() { 
  const section = document.getElementById("resultados-pesquisa"); 
  const inputPesquisa = document.getElementById("campo-pesquisa");
  if (!section || !inputPesquisa) return;

  const campoPesquisa = inputPesquisa.value.trim().toLowerCase();
  let resultados = "";

  function adicionarTodosResultados() {
    for (let dado of dados) {
      resultados += gerarHTMLResultado(dado);
    }
  }

  if (!campoPesquisa) {
    adicionarTodosResultados();
  } else {
    const palavrasPesquisa = campoPesquisa.split(" ");

    for (let dado of dados) {
      const titulo = (dado.titulo || "").toLowerCase();
      const descricao = (dado.descricao || "").toLowerCase();
      const tags = (dado.tags || "").toLowerCase();

      const encontrouPalavra = palavrasPesquisa.some(palavra => 
        palavra && (titulo.includes(palavra) || descricao.includes(palavra) || tags.includes(palavra))
      );

      if (encontrouPalavra) {
        resultados += gerarHTMLResultado(dado);
      }
    }

    if (!resultados) {
      resultados = `
        <div class="item-resultado" style="text-align: center; padding: 2rem;">
          <h2 style="color: #52796F; font-size: 1.2rem;">Nenhum recurso encontrado para "${inputPesquisa.value}"</h2>
          <p class="descricao-meta" style="margin-top: 0.5rem;">
            Tente buscar por termos como: <strong>respiração, mindfulness, livros, filmes, acolhimento</strong> ou limpe a busca para ver todos os conteúdos.
          </p>
        </div>
      `;
    }
  }

  section.innerHTML = resultados;
}

// Permite buscar apertando 'Enter'
document.addEventListener("DOMContentLoaded", () => {
  const inputPesquisa = document.getElementById("campo-pesquisa");
  if (inputPesquisa) {
    inputPesquisa.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        pesquisar();
      }
    });
  }
});

// Funções do Check-in de Sentimentos (AC 1)
function gerarCodigoAleatorio() {
  const prefixos = ["CALMA", "RESPIRA", "PAZ", "SERENA", "FOCO", "ACOLHE"];
  const prefixo = prefixos[Math.floor(Math.random() * prefixos.length)];
  const numero = Math.floor(1000 + Math.random() * 9000);
  const inputCodigo = document.getElementById("codigo-acompanhamento");
  if (inputCodigo) {
    inputCodigo.value = `${prefixo}-${numero}`;
  }
}

function atualizarBadgeNivel(valor) {
  const badge = document.getElementById("badge-nivel");
  if (!badge) return;

  const num = parseInt(valor, 10);
  let texto = `Nível ${num}`;
  let cor = "#52796F";

  if (num <= 3) {
    texto = `Nível ${num} (Leve)`;
    cor = "#2E7D32";
  } else if (num <= 7) {
    texto = `Nível ${num} (Moderado)`;
    cor = "#52796F";
  } else {
    texto = `Nível ${num} (Intenso)`;
    cor = "#C62828";
  }

  badge.innerText = texto;
  badge.style.backgroundColor = cor;
}

async function salvarCheckin(event) {
  event.preventDefault();

  const inputCodigo = document.getElementById("codigo-acompanhamento");
  const inputNivel = document.getElementById("nivel-ansiedade");
  const selectEmocao = document.getElementById("emocao-principal");
  const textareaAnotacao = document.getElementById("anotacao-checkin");
  const btnSalvar = document.getElementById("btn-salvar-checkin");
  const divFeedback = document.getElementById("feedback-checkin");

  const codigo = inputCodigo?.value.trim().toUpperCase() || "";
  const nivel = parseInt(inputNivel?.value || "5", 10);
  const emocao = selectEmocao?.value || "";
  const anotacao = textareaAnotacao?.value.trim() || null;

  if (!codigo || !emocao) {
    if (divFeedback) {
      divFeedback.className = "feedback-checkin feedback-erro";
      divFeedback.innerHTML = `<strong>Atenção:</strong> Por favor, preencha o código de acompanhamento e selecione sua emoção predominante.`;
      divFeedback.style.display = "block";
    }
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.innerText = "Salvando registro...";

  const payload = {
    codigoAcompanhamento: codigo,
    nivelAnsiedade: nivel,
    emocaoPrincipal: emocao,
    anotacao: anotacao
  };

  try {
    const response = await fetch(`${API_BASE_URL}/checkins`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const checkinSalvo = await response.json();
      divFeedback.className = "feedback-checkin feedback-sucesso";
      divFeedback.innerHTML = `
        <strong>✨ Check-in registrado com sucesso!</strong><br>
        Seu registro foi salvo com carinho. Código: <code>${checkinSalvo.codigoAcompanhamento || codigo}</code><br>
        <small>Guarde seu código para acompanhar sua evolução nos próximos dias.</small>
      `;
      divFeedback.style.display = "block";

      if (textareaAnotacao) textareaAnotacao.value = "";
      if (selectEmocao) selectEmocao.selectedIndex = 0;
    } else {
      throw new Error(`Servidor retornou status ${response.status}`);
    }
  } catch (error) {
    console.warn("API indisponível ou erro de conexão:", error);

    divFeedback.className = "feedback-checkin feedback-erro";
    divFeedback.innerHTML = `
      <strong>Não foi possível conectar com a API no momento.</strong><br>
      Certifique-se de que o backend Spring Boot está executando na porta 8080 (<code>http://localhost:8080</code>).<br>
      <small>Lembre-se: respire fundo, você não está só.</small>
    `;
    divFeedback.style.display = "block";
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar Check-in";
  }
}