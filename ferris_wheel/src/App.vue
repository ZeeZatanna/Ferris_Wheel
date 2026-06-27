<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'

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

// Inicialização automática do temporizador do carrossel (Melhoria de UX)
let timer
onMounted(() => { timer = setInterval(proximoSlide, 5000) })
onBeforeUnmount(() => { clearInterval(timer) })
</script>

<template>
  <div class="bg-gray-50 font-sans antialiased text-gray-800 min-h-screen">
    
    <!-- Cabeçalho Dinâmico -->
    <header class="bg-indigo-600 text-white shadow-md sticky top-0 z-50">
      <nav class="max-w-7xl mx-auto px-4 py-3 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        
        <div class="flex items-center justify-between w-full md:w-auto">
          <!-- Botão de Menu -->
          <button @click="toggleMenu" class="p-2 hover:bg-indigo-700 rounded-lg transition" aria-label="Abrir Menu">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
          </button>
          
          <!-- Logo -->
          <div class="flex items-center gap-2 cursor-pointer">
            <div class="bg-yellow-400 p-2 rounded-full text-indigo-900 font-bold tracking-wider text-sm">FW</div>
            <span class="font-black text-xl tracking-wide">Ferris Wheel</span>
          </div>
          
          <!-- Ícones Utilitários -->
          <div class="flex items-center gap-2">
            <button @click="openModal('perfil')" class="p-2 hover:bg-indigo-700 rounded-lg" aria-label="Perfil">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
            </button>
            <button @click="openModal('carrinho')" class="p-2 hover:bg-indigo-700 rounded-lg relative" aria-label="Carrinho">
              <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.2 9.3a.5.5 0 00.46.6h11.6a.5.5 0 00.46-.3L17 13M9 22a1 1 0 100-2 1 1 0 000 2zm7 0a1 1 0 100-2 1 1 0 000 2z"></path></svg>
              <!-- Contador reativo de itens no carrinho -->
              <span v-if="carrinho.quantidade > 0" class="absolute -top-1 -right-1 bg-yellow-400 text-indigo-900 text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center animate-bounce">
                {{ carrinho.quantidade }}
              </span>
            </button>
          </div>
        </div>

        <!-- Menu Cascata Responsivo -->
        <div v-if="menuAberto" class="md:hidden bg-indigo-700 rounded-lg p-4 flex flex-col gap-2">
          <a href="#" class="block py-2 px-3 rounded hover:bg-indigo-800">Início</a>
          <a href="#atracoes" class="block py-2 px-3 rounded hover:bg-indigo-800">Atrações</a>
          <a href="#ingressos" class="block py-2 px-3 rounded hover:bg-indigo-800">Ingressos</a>
        </div>

        <!-- Barra de Busca -->
        <div class="w-full md:w-80">
          <input v-model="busca" type="text" placeholder="🔍 Digite a sua busca..." class="w-full px-4 py-2 rounded-lg text-gray-900 bg-white border-none focus:ring-2 focus:ring-yellow-400 outline-none transition shadow-inner">
        </div>
      </nav>
    </header>

    <!-- Conteúdo Principal -->
    <main class="max-w-7xl mx-auto px-4 py-6 space-y-12">
      
       <!-- Seção: Carrossel de Destaques -->
      <section class="relative rounded-2xl overflow-hidden shadow-xl bg-gray-900 h-[300px] md:h-[450px]">
        <img :src="carrossel[slideAtivo].imagem" :alt="carrossel[slideAtivo].alt" class="w-full h-full object-cover opacity-60 absolute inset-0">
        <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6 md:p-12">
          <h2 class="text-white text-2xl md:text-4xl font-bold tracking-tight z-10">{{ carrossel[slideAtivo].texto }}</h2>
        </div>
        <button @click="slideAnterior" class="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white z-10">❮</button>
        <button @click="proximoSlide" class="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/40 p-2 rounded-full text-white z-10">❯</button>
      </section>


      <!-- Seção: Compra de Ingressos Rápida -->
      <section id="ingressos" class="bg-indigo-900 text-white rounded-2xl p-6 md:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div class="text-center md:text-left space-y-2">
          <h2 class="text-2xl md:text-3xl font-black text-yellow-400">Garanta já o seu ingresso!</h2>
          <p class="text-indigo-200 text-sm md:text-base">Evite filas e aproveite o melhor dia da sua vida no Ferris Wheel.</p>
        </div>
        <div class="flex items-center gap-4 bg-indigo-800 p-4 rounded-xl border border-indigo-700 w-full md:w-auto justify-between">
          <div class="flex items-center gap-3">
            <button @click="alterarQuantidade(-1)" class="bg-indigo-700 hover:bg-indigo-600 px-3 py-1 rounded font-bold">-</button>
            <span class="text-xl font-bold w-6 text-center">{{ qtdIngressos }}</span>
            <button @click="alterarQuantidade(1)" class="bg-indigo-700 hover:bg-indigo-600 px-3 py-1 rounded font-bold">+</button>
          </div>
          <button @click="adicionarAoCarrinho" class="bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-extrabold px-6 py-3 rounded-xl transition transform active:scale-95 shadow-md">
            Comprar Agora
          </button>
        </div>
      </section>

      <!-- Seção: Grid de Atrações Filtráveis -->
      <section id="atracoes" class="space-y-6">
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-4">
          <h3 class="text-2xl font-bold text-gray-900 tracking-tight">Explore nossas Atrações</h3>
          <!-- Botões de Filtro -->
          <div class="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            <button v-for="cat in categorias" :key="cat" @click="categoriaSelecionada = cat" :class="categoriaSelecionada === cat ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'" class="px-4 py-1.5 rounded-full text-xs font-bold transition whitespace-nowrap">
              {{ cat }}
            </button>
          </div>
        </div>
      </section>

      <!-- Renderização Automatizada dos Cards via v-for -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="atracao in atracoesFiltradas" :key="atracao.id" class="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition border border-gray-100 flex flex-col justify-between p-5 space-y-4">
           <img :src="atracao.imagem" :alt="atracao.nome" class="w-full h-48 object-cover">
          <div>
         <!-- Exibe a Categoria do brinquedo -->
          <span class="text-xs font-bold uppercase tracking-wider text-indigo-600">{{ atracao.categoria }}</span>
      
          <!-- Exibe o Nome do brinquedo -->
          <h4 class="text-xl font-bold text-gray-900 mt-1">{{ atracao.nome }}</h4>
      
          <!-- Exibe a Descrição do brinquedo -->
          <p class="text-gray-600 text-sm mt-2 leading-relaxed">{{ atracao.descricao }}</p>
          </div>
    
          <!-- Painel Interativo de Fila Virtual -->
          <div class="bg-gray-50 p-3 rounded-xl border border-gray-100 flex items-center justify-between text-xs">
            <!-- Exibe o Tempo de Fila do brinquedo -->
            <span class="text-gray-500">Fila atual: <strong class="text-gray-800">{{ atracao.fila }} min</strong></span>
      
            <!-- Botão com o clique para agendar a Fila -->
              <button @click="entrarNaFila(atracao.nome)" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold px-3 py-1.5 rounded-lg transition">
                Agendar Fila
              </button>
          </div>

        </div>
      </div>

        <!-- Modais Flutuantes de Informação e Feedback -->
      <div v-if="modal.visivel" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
        <div class="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4">
          <!-- Exibe o título do aviso (Ex: Ingressos Adicionados) -->
          <h3 class="text-xl font-bold text-gray-900">{{ modal.titulo }}</h3>
    
          <p class="text-gray-600 text-sm leading-relaxed" v-html="modal.mensagem"></p>
    
          <!-- Botão que fecha a janela ao mudar a variável para false -->
          <button @click="modal.visivel = false" class="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl transition">
           Fechar
          </button>
        </div>
      </div>

    </main>
  </div>
</template>