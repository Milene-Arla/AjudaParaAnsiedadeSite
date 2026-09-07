// Configuração da URL base da API Spring Boot
const API_BASE_URL = "http://localhost:8080/api";

let categoriaSelecionada = "todas";

// Gera o HTML do card de resultado com a Categoria em destaque
function gerarHTMLResultado(dado) {
  const categoria = dado.categoria || "Geral";
  return `
    <div class="item-resultado">
      <div class="header-resultado">
        <span class="badge-categoria">${categoria}</span>
      </div>
      <h2>
        <a href="${dado.link}" target="_blank">${dado.titulo}</a>
      </h2>
      <p class="descricao-meta">${dado.descricao}</p>
      <a href="${dado.link}" target="_blank" class="link-saiba-mais">Mais informações ➔</a>
    </div>
  `;
}

// Filtra ao clicar nos botões de categoria
function filtrarPorCategoria(nomeCategoria, botaoClicado) {
  categoriaSelecionada = nomeCategoria;

  // Atualiza qual botão está com a classe ativa
  const botoes = document.querySelectorAll(".btn-categoria");
  botoes.forEach(b => b.classList.remove("ativo"));
  if (botaoClicado) {
    botaoClicado.classList.add("ativo");
  }

  // Limpa o campo de texto para focar na categoria clicada
  const inputPesquisa = document.getElementById("campo-pesquisa");
  if (inputPesquisa) inputPesquisa.value = "";

  renderizarResultados();
}

// Função de busca textual
function pesquisar() {
  renderizarResultados();
}

// Renderiza os resultados combinando texto e/ou categoria
function renderizarResultados() {
  const section = document.getElementById("resultados-pesquisa");
  const inputPesquisa = document.getElementById("campo-pesquisa");
  if (!section) return;

  const termo = inputPesquisa ? inputPesquisa.value.trim().toLowerCase() : "";
  let resultadosHTML = "";

  let itensFiltrados = dados;

  // 1. Filtra por categoria, se não for "todas"
  if (categoriaSelecionada !== "todas") {
    itensFiltrados = itensFiltrados.filter(item => item.categoria === categoriaSelecionada);
  }

  // 2. Filtra por texto se houver busca
  if (termo) {
    const palavras = termo.split(" ");
    itensFiltrados = itensFiltrados.filter(dado => {
      const tit = (dado.titulo || "").toLowerCase();
      const desc = (dado.descricao || "").toLowerCase();
      const tags = (dado.tags || "").toLowerCase();
      const cat = (dado.categoria || "").toLowerCase();

      return palavras.some(palavra => 
        palavra && (tit.includes(palavra) || desc.includes(palavra) || tags.includes(palavra) || cat.includes(palavra))
      );
    });
  }

  if (itensFiltrados.length > 0) {
    for (let item of itensFiltrados) {
      resultadosHTML += gerarHTMLResultado(item);
    }
  } else {
    resultadosHTML = `
      <div class="item-resultado" style="text-align: center; padding: 2.5rem 1rem;">
        <h2 style="color: #52796F; font-size: 1.25rem;">Nenhum conteúdo encontrado</h2>
        <p class="descricao-meta" style="margin-top: 0.6rem;">
          Não encontramos nada com esse filtro. Tente clicar em <strong>"Todos"</strong> ou pesquisar por outro termo.
        </p>
      </div>
    `;
  }

  section.innerHTML = resultadosHTML;
}

// Renderiza inicialmente com todos os itens
document.addEventListener("DOMContentLoaded", () => {
  renderizarResultados();

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
      <strong>Não foi possível salvar seu registro no momento.</strong><br>
      Certifique-se de que o backend Spring Boot está executando na porta 8080 (<code>http://localhost:8080</code>).<br>
      <small>Lembre-se: respire fundo, você não está só.</small>
    `;
    divFeedback.style.display = "block";
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar Check-in";
  }
}