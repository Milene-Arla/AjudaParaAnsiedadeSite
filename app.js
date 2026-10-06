const API_BASE_URL = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "http://localhost:8080/api"
    : "https://ajuda-para-ansiedade-api.onrender.com/api";
    
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
  btnSalvar.innerText = "⏳ Guardando seu registro...";

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
// ============================================================
// AC 2 - FUNÇÕES DA LINHA DO TEMPO & HISTÓRICO EMOCIONAL (GET)
// ============================================================

function usarCodigoAtual() {
  const codigoCheckin = document.getElementById("codigo-acompanhamento")?.value.trim().toUpperCase();
  if (!codigoCheckin) {
    alert("Gere ou digite um código de acompanhamento no formulário primeiro!");
    return;
  }
  const inputHistorico = document.getElementById("input-codigo-historico");
  if (inputHistorico) {
    inputHistorico.value = codigoCheckin;
    consultarHistorico();
  }
}

function preencherCodigoExemplo(codigo) {
  const inputHistorico = document.getElementById("input-codigo-historico");
  if (inputHistorico) {
    inputHistorico.value = codigo;
    consultarHistorico();
  }
}

async function consultarHistorico() {
  const inputCodigo = document.getElementById("input-codigo-historico");
  const containerTimeline = document.getElementById("container-timeline");
  const metricasBox = document.getElementById("historico-metricas");

  const codigo = inputCodigo?.value.trim().toUpperCase();

  if (!codigo) {
    alert("Por favor, digite um código de acompanhamento para consultar.");
    return;
  }

  containerTimeline.innerHTML = `
    <div class="historico-vazio">
      <span class="icone-vazio">⏳</span>
      <p>Buscando registros na API para o código <strong>${codigo}</strong>...</p>
    </div>
  `;

  try {
    // Busca os registros da API em Kotlin/PostgreSQL via GET
    const response = await fetch(`${API_BASE_URL}/checkins`);
    if (!response.ok) throw new Error("Erro ao consultar a API.");

    const todos = await response.json();
    // Filtra pelo código digitado (ignorando maiúsculas/minúsculas)
    const filtrados = todos.filter(item => 
      item.codigoAcompanhamento && 
      item.codigoAcompanhamento.trim().toUpperCase() === codigo
    );

    // Ordena do mais recente para o mais antigo
    filtrados.sort((a, b) => new Date(b.dataRegistro || 0) - new Date(a.dataRegistro || 0));

    if (filtrados.length === 0) {
      metricasBox.style.display = "none";
      containerTimeline.innerHTML = `
        <div class="historico-vazio">
          <span class="icone-vazio">🔍</span>
          <p>Nenhum registro encontrado para o código <strong>${codigo}</strong>.</p>
          <small style="color: #888;">Faça um novo check-in acima usando este código para começar seu histórico!</small>
        </div>
      `;
      return;
    }

    // Calcula estatísticas
    const total = filtrados.length;
    const somaAnsiedade = filtrados.reduce((acc, curr) => acc + (curr.nivelAnsiedade || 0), 0);
    const mediaAnsiedade = (somaAnsiedade / total).toFixed(1);

    // Emoção mais frequente
    const contagemEmocoes = {};
    filtrados.forEach(c => {
      if (c.emocaoPrincipal) {
        contagemEmocoes[c.emocaoPrincipal] = (contagemEmocoes[c.emocaoPrincipal] || 0) + 1;
      }
    });
    let emocaoFrequente = "-";
    let maxOcorrencias = 0;
    for (const [emocao, qtd] of Object.entries(contagemEmocoes)) {
      if (qtd > maxOcorrencias) {
        maxOcorrencias = qtd;
        emocaoFrequente = emocao;
      }
    }

    // Atualiza cards de métricas
    document.getElementById("metrica-total").innerText = total;
    document.getElementById("metrica-media").innerText = mediaAnsiedade;
    document.getElementById("metrica-emocao").innerText = emocaoFrequente;
    metricasBox.style.display = "grid";

    // Renderiza a Timeline
    containerTimeline.innerHTML = "";
    filtrados.forEach(item => {
      const dataObj = item.dataRegistro ? new Date(item.dataRegistro) : new Date();
      const dataFormatada = dataObj.toLocaleDateString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
      const horaFormatada = dataObj.toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit"
      });

      let classeNivel = "nivel-leve";
      if (item.nivelAnsiedade >= 7) classeNivel = "nivel-intenso";
      else if (item.nivelAnsiedade >= 4) classeNivel = "nivel-moderado";

      const card = document.createElement("div");
      card.className = "card-registro";
      card.id = `card-checkin-${item.id}`;
      card.innerHTML = `
        <div class="card-registro-header">
          <span class="card-data">📅 ${dataFormatada} às ${horaFormatada}</span>
          <span class="card-nivel-tag ${classeNivel}">Nível ${item.nivelAnsiedade}/10</span>
        </div>
        <div class="card-emocao">
          💛 Emoção: <strong>${item.emocaoPrincipal || "Não informada"}</strong>
        </div>
        ${item.anotacao ? `<div class="card-anotacao">"${item.anotacao}"</div>` : ''}
      `;
      containerTimeline.appendChild(card);
    });

  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
    metricasBox.style.display = "none";
    containerTimeline.innerHTML = `
      <div class="historico-vazio" style="border-color: #ffcdd2; color: #c62828;">
        <span class="icone-vazio">⚠️</span>
        <p>Não foi possível conectar à API para buscar os registros no momento.</p>
      </div>
    `;
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