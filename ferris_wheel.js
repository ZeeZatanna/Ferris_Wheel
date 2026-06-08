
const { createApp, ref, computed, onMounted, onBeforeUnmount } = Vue

createApp({
  setup() {
    // Estados reativos (Substituem o antigo objeto "data")
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

    // Lista estruturada de atrações para a Componentização
    const atracoes = [
      { id: 1, nome: 'Montanha-Russa Thunder', categoria: 'Radicais', imagem: 'carrossel_img_1.jpg', descricao: 'Uma estrutura de aço imponente com quedas verticais livres, loops perfeitos e velocidade máxima para os verdadeiros amantes de adrenalina.', fila: 45 },
      { id: 2, nome: 'Roda Gigante Ferris Wheel', categoria: 'Família', imagem: 'content_slide_img_1.jpg', descricao: 'Nossa atração principal. Cabines fechadas, climatizadas e confortáveis para você curtir a paisagem panorâmica com toda a família.', fila: 15 },
      { id: 3, nome: 'Carrossel Mágico', categoria: 'Infantil', imagem: 'carrossel_img_1.jpg', descricao: 'Luzes brilhantes, música clássica e figuras entalhadas à mão que trazem de volta a nostalgia dos parques tradicionais.', fila: 5 }
    ]

    // Função reativa que filtra as atrações por categoria e busca ao mesmo tempo
    const atracoesFiltradas = computed(() => {
      return atracoes.filter(atracao => {
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

    // Inicialização automática do temporizador do carrossel
    let timer
    onMounted(() => { timer = setInterval(proximoSlide, 5000) })
    onBeforeUnmount(() => { clearInterval(timer) })

    // No final do setup, precisamos retornar tudo que o HTML vai usar
    return {
      menuAberto, busca, slideAtivo, qtdIngressos, categoriaSelecionada, categorias,
      carrinho, modal, carrossel, atracoesFiltradas,
      toggleMenu, proximoSlide, slideAnterior, alterarQuantidade, adicionarAoCarrinho, entrarNaFila, openModal
    }
  }
}).mount('#app') // Conecta o Vue na nossa <div id="app"> do HTML