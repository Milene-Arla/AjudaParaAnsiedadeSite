// Configuração da URL da API Backend Spring Boot
const API_BASE_URL = "http://localhost:8080/api";

let categorias = typeof categoriasPadrao !== "undefined" ? categoriasPadrao : [];
let recomendacoes = typeof dados !== "undefined" ? dados : [];
let categoriaSelecionadaId = null;
let apiOnline = false;

// Mapeamento de ícones das categorias
const iconesMap = {
  "book-open": "📖",
  "film": "🎬",
  "wind": "🌬️",
  "palette": "🎨",
  "headphones": "🎧",
  "music": "🎵"
};

// 1. Renderiza os botões dinâmicos do Quiz de Interesses
function renderizarBotoesCategorias() {
  const container = document.getElementById("container-categorias");
  if (!container) return;

  const listaCategorias = categorias.length > 0 ? categorias : (typeof categoriasPadrao !== "undefined" ? categoriasPadrao : []);

  let html = `
    <button class="btn-categoria ${categoriaSelecionadaId === null ? 'ativo' : ''}" onclick="selecionarCategoria(null)">
      ✨ Todas as Categorias
    </button>
  `;

  for (let cat of listaCategorias) {
    const icone = iconesMap[cat.icone] || "🌱";
    const ativo = categoriaSelecionadaId === cat.id ? 'ativo' : '';
    html += `
      <button class="btn-categoria ${ativo}" onclick="selecionarCategoria(${cat.id})">
        ${icone} ${cat.nome}
      </button>
    `;
  }

  container.innerHTML = html;
}

// 2. Filtra as recomendações por categoria ao clicar no Quiz
async function selecionarCategoria(categoriaId) {
  categoriaSelecionadaId = categoriaId;
  renderizarBotoesCategorias();

  // Se a API Spring Boot estiver online, tenta buscar dela
  if (apiOnline) {
    try {
      const url = categoriaId !== null 
        ? `${API_BASE_URL}/recomendacoes?categoriaId=${categoriaId}`
        : `${API_BASE_URL}/recomendacoes`;

      const response = await fetch(url);
      if (response.ok) {
        const dadosApi = await response.json();
        renderizarRecomendacoes(dadosApi);
        return;
      }
    } catch (e) {
      console.warn("Falha ao buscar da API online, usando fallback local:", e);
    }
  }

  // Filtragem local
  const baseRecomendacoes = recomendacoes.length > 0 ? recomendacoes : (typeof dados !== "undefined" ? dados : []);
  
  if (categoriaId === null) {
    renderizarRecomendacoes(baseRecomendacoes);
  } else {
    const filtrados = baseRecomendacoes.filter(item => {
      const catId = item.categoriaId || (item.categoria && item.categoria.id);
      return catId === categoriaId;
    });
    renderizarRecomendacoes(filtrados);
  }
}

// 3. Renderiza a lista de recomendações na tela
function renderizarRecomendacoes(lista) {
  const section = document.getElementById("resultados-pesquisa");
  if (!section) return;

  if (!lista || lista.length === 0) {
    section.innerHTML = `
      <div class="mensagem-status">
        Nenhum recurso encontrado para a categoria ou termo selecionado.
      </div>
    `;
    return;
  }

  let html = "";
  for (let item of lista) {
    const nomeCategoria = item.categoria ? item.categoria.nome : "";
    const beneficioHtml = item.beneficio ? `<div class="tag-beneficio">💡 Benefício: ${item.beneficio}</div>` : "";
    const categoriaHtml = nomeCategoria ? `<div class="tag-categoria">${nomeCategoria}</div>` : "";
    const linkAcesso = item.linkAcesso || item.link || "#";

    html += `
      <div class="item-resultado">
        ${categoriaHtml}
        <h2>
          <a href="${linkAcesso}" target="_blank" rel="noopener noreferrer">${item.titulo}</a>
        </h2>
        <p class="descricao-meta">${item.descricao}</p>
        ${beneficioHtml}
        <br />
        <a href="${linkAcesso}" target="_blank" rel="noopener noreferrer" class="link-recurso">Acessar recurso ↗</a>
      </div>
    `;
  }

  section.innerHTML = html;
}

// 4. Pesquisa por palavra-chave
function pesquisar() {
  const campoPesquisa = document.getElementById("campo-pesquisa")?.value.toLowerCase().trim() || "";

  const baseRecomendacoes = recomendacoes.length > 0 ? recomendacoes : (typeof dados !== "undefined" ? dados : []);

  if (!campoPesquisa) {
    selecionarCategoria(categoriaSelecionadaId);
    return;
  }

  const filtrados = baseRecomendacoes.filter(item => {
    const titulo = (item.titulo || "").toLowerCase();
    const descricao = (item.descricao || "").toLowerCase();
    const tags = (item.tags || "").toLowerCase();
    const beneficio = (item.beneficio || "").toLowerCase();
    const catId = item.categoriaId || (item.categoria && item.categoria.id);

    const palavras = campoPesquisa.split(" ");
    const encontrouPalavra = palavras.some(p => 
      titulo.includes(p) || descricao.includes(p) || tags.includes(p) || beneficio.includes(p)
    );

    const matchCategoria = categoriaSelecionadaId === null || catId === categoriaSelecionadaId;

    return encontrouPalavra && matchCategoria;
  });

  renderizarRecomendacoes(filtrados);
}

// 5. Funções do Check-in de Sentimentos (AC 1 - Cadastro / INSERT)
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
  let cor = "#52796F"; // Moderado

  if (num <= 3) {
    texto = `Nível ${num} (Leve)`;
    cor = "#2E7D32"; // Verde
  } else if (num <= 7) {
    texto = `Nível ${num} (Moderado)`;
    cor = "#52796F"; // Verde petróleo
  } else {
    texto = `Nível ${num} (Intenso)`;
    cor = "#C62828"; // Vermelho suave
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
    alert("Por favor, preencha o código de acompanhamento e selecione sua emoção.");
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.innerText = "⏳ Enviando para a API Spring Boot...";

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
      
      // Limpa os campos opcionais, mantendo o código
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
      Por favor, tente novamente em instantes. Lembre-se: respire fundo, você não está só.
    `;
    divFeedback.style.display = "block";
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar Check-in";
  }
}

// 6. Inicialização e busca assíncrona da API Spring Boot
async function inicializar() {
  // Renderiza imediatamente com dados locais para exibição instantânea
  renderizarBotoesCategorias();
  renderizarRecomendacoes(recomendacoes);

  // Tenta sincronizar com o backend Spring Boot em background
  try {
    const resCategorias = await fetch(`${API_BASE_URL}/categorias`);
    if (resCategorias.ok) {
      const catsApi = await resCategorias.json();
      if (catsApi && catsApi.length > 0) {
        categorias = catsApi;
      }
    }

    const resRecomendacoes = await fetch(`${API_BASE_URL}/recomendacoes`);
    if (resRecomendacoes.ok) {
      const recsApi = await resRecomendacoes.json();
      if (recsApi && recsApi.length > 0) {
        recomendacoes = recsApi;
        apiOnline = true;
      }
    }

    // Atualiza a visualização com os dados do banco de dados
    renderizarBotoesCategorias();
    selecionarCategoria(categoriaSelecionadaId);
  } catch (error) {
    // Modo local perfeitamente funcional
    apiOnline = false;
  }
}

// Eventos Globais
document.addEventListener("DOMContentLoaded", () => {
  const inputBusca = document.getElementById("campo-pesquisa");
  if (inputBusca) {
    inputBusca.addEventListener("keyup", (event) => {
      if (event.key === "Enter") {
        pesquisar();
      }
    });
  }

  inicializar();
});
