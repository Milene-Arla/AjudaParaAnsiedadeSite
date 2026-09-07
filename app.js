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
  // Obtém a seção HTML onde os resultados serão exibidos
  let section = document.getElementById("resultados-pesquisa"); 

  let campoPesquisa = document.getElementById("campo-pesquisa").value.toLowerCase();
  let resultados = "";

  // Função auxiliar para adicionar todos os dados ao resultado
  function adicionarTodosResultados() {
    for (let dado of dados) {
      resultados += gerarHTMLResultado(dado);
    }
  }

  // Se campoPesquisa for uma string vazia, mostra todos os dados
  if (!campoPesquisa) {
    adicionarTodosResultados();
  } else {
    // Itera sobre cada dado da pesquisa e constrói o HTML do resultado
    for (let dado of dados) {
      let titulo = dado.titulo.toLowerCase();
      let descricao = dado.descricao.toLowerCase();
      let tags = dado.tags.toLowerCase();

      // Verifica se alguma das palavras da pesquisa está presente em algum dos campos
      let palavrasPesquisa = campoPesquisa.split(' ');
      let encontrouPalavra = palavrasPesquisa.some(palavra => 
        titulo.includes(palavra) || descricao.includes(palavra) || tags.includes(palavra)
      );

      if (encontrouPalavra) {
        resultados += gerarHTMLResultado(dado);
      }
    }

    // Se nenhum resultado for encontrado, mostra uma mensagem informativa
    if (!resultados) {
      adicionarTodosResultados();
    }
  }

  // Atribui o HTML construído à seção de resultados
  section.innerHTML = resultados;
}

// Funções do Check-in de Sentimentos (AC 1 - Cadastro / INSERT)
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
    alert("Por favor, preencha o código de acompanhamento e selecione sua emoção.");
    return;
  }

  btnSalvar.disabled = true;
  btnSalvar.innerText = "Enviando...";

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
      Por favor, tente novamente em instantes. Lembre-se: respire fundo, você não está só.
    `;
    divFeedback.style.display = "block";
  } finally {
    btnSalvar.disabled = false;
    btnSalvar.innerText = "Salvar Check-in";
  }
}
