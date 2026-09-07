// Categorias do banco de dados (tb_categoria)
const categoriasPadrao = [
    { id: 1, nome: "Livros e Leituras", icone: "book-open", ativo: true },
    { id: 2, nome: "Filmes e Animações", icone: "film", ativo: true },
    { id: 3, nome: "Técnicas de Respiração", icone: "wind", ativo: true },
    { id: 4, nome: "Arte e Pinturas", icone: "palette", ativo: true },
    { id: 5, nome: "Sons e Músicas", icone: "music", ativo: true }
];

// Recomendações do banco de dados (tb_recomendacao)
let dados = [
    {
        id: 1,
        categoriaId: 3,
        categoria: { id: 3, nome: "Técnicas de Respiração", icone: "wind" },
        titulo: "Técnicas de Respiração Profunda (4-7-8)",
        descricao: "A respiração profunda é uma técnica simples e altamente eficaz para desacelerar o ritmo cardíaco e ativar o sistema parassimpático. Consiste em inspirar lentamente pelo nariz por 4 segundos, segurar por 7 e soltar pela boca por 8.",
        beneficio: "Redução imediata da frequência cardíaca e alívio de crises agudas",
        linkAcesso: "https://www.fashionismo.com.br/2018/10/mindfulness-10-tecnicas-de-respiracao/",
        link: "https://www.fashionismo.com.br/2018/10/mindfulness-10-tecnicas-de-respiracao/",
        tags: "respiração relaxamento técnicas 4-7-8 pulmão calma"
    },
    {
        id: 2,
        categoriaId: 1,
        categoria: { id: 1, nome: "Livros e Leituras", icone: "book-open" },
        titulo: "Livros Recomendados sobre Ansiedade",
        descricao: "Explore uma seleção cuidadosamente curada de livros que oferecem uma compreensão profunda da ansiedade, com estratégias práticas para gerenciar o dia a dia e acolhimento emocional.",
        beneficio: "Autoconhecimento, psicoeducação e estratégias cognitivo-comportamentais",
        linkAcesso: "https://revistagalileu.globo.com/Cultura/Livros/noticia/2022/03/ansiedade-7-livros-para-entender-melhor-o-transtorno-de-saude-mental.html",
        link: "https://revistagalileu.globo.com/Cultura/Livros/noticia/2022/03/ansiedade-7-livros-para-entender-melhor-o-transtorno-de-saude-mental.html",
        tags: "livros leitura recomendações literatura autores"
    },
    {
        id: 3,
        categoriaId: 2,
        categoria: { id: 2, nome: "Filmes e Animações", icone: "film" },
        titulo: "Filmes e Séries que Abordam Saúde Mental",
        descricao: "Obras cinematográficas que retratam personagens lidando com ansiedade e emoções intensas (como 'Divertida Mente 2'), ajudando a normalizar e compreender os sentimentos.",
        beneficio: "Empatia, identificação emocional e desmistificação do transtorno",
        linkAcesso: "https://www.otempo.com.br/entretenimento/7-filmes-e-series-que-abordam-sobre-saude-mental-1.3288071",
        link: "https://www.otempo.com.br/entretenimento/7-filmes-e-series-que-abordam-sobre-saude-mental-1.3288071",
        tags: "filmes cinema animação divertida mente series"
    },
    {
        id: 4,
        categoriaId: 4,
        categoria: { id: 4, nome: "Arte e Pinturas", icone: "palette" },
        titulo: "Arte, Mandalas e Cores no Alívio do Estresse",
        descricao: "Práticas de arteterapia, colorir mandalas e contemplação estética que auxiliam a focar a mente no presente e expressar emoções sem palavras.",
        beneficio: "Estímulo à atenção plena (mindfulness) e expressão não-verbal",
        linkAcesso: "https://blog.ibmec.br/wp-content/uploads/2022/04/Infografico-Ansiedade_Ibmec.pdf",
        link: "https://blog.ibmec.br/wp-content/uploads/2022/04/Infografico-Ansiedade_Ibmec.pdf",
        tags: "arte pintura cores mandalas desenho relaxamento"
    },
    {
        id: 5,
        categoriaId: 5,
        categoria: { id: 5, nome: "Sons e Músicas", icone: "music" },
        titulo: "Frequências Sonoras e Sons da Natureza",
        descricao: "Paisagens sonoras com chuva, ondas do mar e frequências binaurais que induzem ondas cerebrais de relaxamento e promovem descanso mental.",
        beneficio: "Diminuição do ruído mental e facilitação do sono e concentração",
        linkAcesso: "https://www.psitto.com.br/blog/como-aliviar-ansiedade/",
        link: "https://www.psitto.com.br/blog/como-aliviar-ansiedade/",
        tags: "musica sons frequencias natureza relaxamento audio"
    },
    {
        id: 6,
        categoriaId: 1,
        categoria: { id: 1, nome: "Livros e Leituras", icone: "book-open" },
        titulo: "O que é Ansiedade e Como Reconhecer?",
        descricao: "Artigo informativo completo sobre o que é a ansiedade, sintomas físicos e emocionais e quando procurar auxílio profissional.",
        beneficio: "Compreensão dos sinais do próprio corpo",
        linkAcesso: "https://www.psicologia.pt/saude-mental/ansiedade/",
        link: "https://www.psicologia.pt/saude-mental/ansiedade/",
        tags: "sintomas informacao saude mental educacao"
    },
    {
        id: 7,
        categoriaId: 3,
        categoria: { id: 3, nome: "Técnicas de Respiração", icone: "wind" },
        titulo: "Exercício de Respiração Quadrada (Box Breathing)",
        descricao: "Técnica utilizada por especialistas em controle de estresse: inspire em 4s, segure em 4s, expire em 4s e segure vazio em 4s.",
        beneficio: "Estabilização rápida do foco e diminuição da ansiedade",
        linkAcesso: "https://www.fashionismo.com.br/2018/10/mindfulness-10-tecnicas-de-respiracao/",
        link: "https://www.fashionismo.com.br/2018/10/mindfulness-10-tecnicas-de-respiracao/",
        tags: "box breathing respiracao quadrada foco"
    }
];
