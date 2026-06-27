
const { createApp, ref, computed, onMounted, onBeforeUnmount } = Vue

createApp({
  setup() {
    // Estados reativos
    const menuAberto = ref(false)
    const busca = ref('')
    const slideAtivo = ref(0)
    const qtdIngressos = ref(1)
    const categoriaSelecionada = ref('Todos')
    const categorias = ['Todos', 'Radicais', 'Família', 'Infantil']

    const carrinho = ref({ quantidade: 0, total: 0 })
    const modal = ref({ visivel: false, titulo: '', mensagem: '' })

    // Banco de dados dinâmico para o Carrossel
    const carrossel = [
      { imagem: 'carrossel_img_1.jpg', alt: 'Montanha Russa', texto: 'A emoção que você procura está aqui!' },
      { imagem: 'content_slide_img_1.jpg', alt: 'Roda Gigante', texto: 'Uma vista inesquecível de todo o parque.' }
    ]

    // 🎡 MODIFICAÇÃO: 'atracoes' agora é uma ref reativa que começa vazia
    const atracoes = ref([])

    // 🚀 NOVO: Função para buscar as atrações direto da sua API Flask
    const buscarAtracoesDoBanco = async () => {
      try {
        const resposta = await fetch('http://127.0.0.1:5000/api/atracoes')
        const dadosDoBanco = await resposta.json()
        
        // Mapeia os dados do banco populando os campos que o seu HTML usa
        atracoes.value = dadosDoBanco.map(atracao => {
          return {
            id: atracao.id,
            nome: atracao.nome,
            status: atracao.status, // Você pode usar no HTML se quiser!
            
            // Campos temporários com base na capacidade/id até você criar colunas para eles no SQLite:
            categoria: atracao.id % 2 === 0 ? 'Família' : 'Radicais', 
            descricao: `Atração incrível com capacidade para ${atracao.capacidade} pessoas simultaneamente. Status atual: ${atracao.status}.`,
            imagem: atracao.id % 2 === 0 ? 'content_slide_img_1.jpg' : 'carrossel_img_1.jpg'
          }
        })
      } catch (erro) {
        console.error("Erro ao conectar com a API Flask do Ferris Wheel:", erro)
      }
    }

    // Função reativa que filtra (Modificada levemente para usar .value no atracoes)
    const atracoesFiltradas = computed(() => {
      return atracoes.value.filter(atracao => {
        const correspondeCategoria = categoriaSelecionada.value === 'Todos' || atracao.categoria === categoriaSelecionada.value
        const correspondeBusca = atracao.nome.toLowerCase().includes(busca.value.toLowerCase()) || 
                                 atracao.descricao.toLowerCase().includes(busca.value.toLowerCase())
        return correspondeCategoria && correspondeBusca
      })
    })

    // Métodos de Interatividade
    const toggleMenu = () => { menuAberto.value = !menuAberto.value }
    const proximoSlide = () => { slideAtivo.value = (slideAtivo.value + 1) % carrossel.length }
    const slideAnterior = () => { slideAtivo.value = (slideAtivo.value - 1 + carrossel.length) % carrossel.length }

    const alterarQuantidade = (valor) => {
      const novaQtd = qtdIngressos.value + valor
      if (novaQtd >= 1) qtdIngressos.value = novaQtd
    }

    const adicionarAoCarrinho = () => {
      carrinho.value.quantidade += qtdIngressos.value
      carrinho.value.total += qtdIngressos.value * 49.90
      
      modal.value.titulo = "🎟️ Ingressos Adicionados!"
      modal.value.mensagem = `Você adicionou <strong>${qtdIngressos.value} ingresso(s)</strong> ao carrinho.<br>Quantidade total: ${carrinho.value.quantidade}`
      modal.value.visivel = true
      qtdIngressos.value = 1
    }

    const entrarNaFila = (nomeAtracao) => {
      modal.value.titulo = "🕒 Fila Virtual Agendada!"
      modal.value.mensagem = `Seu lugar está garantido na atração <strong>${nomeAtracao}</strong>. Avisaremos pelo app quando chegar sua vez!`
      modal.value.visivel = true
    }

    const openModal = (tipo) => {
      if (tipo === 'carrinho') {
        modal.value.titulo = "🛒 Seu Carrinho"
        modal.value.mensagem = carrinho.value.quantidade > 0 
          ? `Você possui <strong>${carrinho.value.quantidade} ingresso(s)</strong>.<br>Subtotal estimado: <strong>R$ ${carrinho.value.total.toFixed(2)}</strong>`
          : "Seu carrinho está vazio no momento."
      } else {
        modal.value.titulo = "👤 Área do Usuário"
        modal.value.mensagem = "Faça login para gerenciar seus ingressos passados e passaportes anuais."
      }
      modal.value.visivel = true
    }

    // Inicialização automática do temporizador do carrossel E chamada da API
    let timer
    onMounted(() => { 
      timer = setInterval(proximoSlide, 5000)
      buscarAtracoesDoBanco() // 🚀 Aciona a busca do banco assim que o site abre!
    })
    
    onBeforeUnmount(() => { clearInterval(timer) })

    // Retorno para o HTML
    return {
      menuAberto, busca, slideAtivo, qtdIngressos, categoriaSelecionada, categorias,
      carrinho, modal, carrossel, atracoesFiltradas,
      toggleMenu, proximoSlide, slideAnterior, alterarQuantidade, adicionarAoCarrinho, entrarNaFila, openModal
    }
  }
}).mount('#app')