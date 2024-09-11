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
