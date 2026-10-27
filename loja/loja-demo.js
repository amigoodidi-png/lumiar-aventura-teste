// Loja Lumiar Aventura — versão de demonstração estática (GitHub Pages).
// Produtos copiados da loja local; carrinho salvo no navegador; o pedido fecha pelo WhatsApp.
const WHATS = '5522999468812';
const CATEGORIAS = {
  'camisa-algodao': 'Camisas de Algodão',
  'camisa-lycra': 'Camisas DryFit e Malha Fria',
  'caneca': 'Canecas',
  'lembrancinha': 'Lembrancinhas'
};
const PRODUTOS = [
  {"id":10,"cat":"camisa-lycra","nome":"Camisa DryFit Secagem Rápida","preco":73.99,"destaque":true,"lado":"frente","desc":"Camiseta DryFit em poliéster, leve e de secagem rápida, com a arte \"Lumiar — as aventuras não se assistem, se vivem!\". Ideal para rafting, trilha e cachoeira.","fotos":[["dryfit-secagem-rapida-preta.webp","Principal"]],"tamanhos":["P","M","G"],"cores":["Preto","Azul-marinho"]},
  {"id":11,"cat":"camisa-lycra","nome":"Camisa Manga Longa Aventura se Vive","preco":121.48,"destaque":true,"lado":"","desc":"Camiseta unissex manga longa em malha fria, com estampa Lumiar na frente e nas costas. Protege do sol nas atividades ao ar livre.","fotos":[["manga-longa-aventura-frente.webp","Principal"],["manga-longa-aventura-costas.webp","Outro lado"]],"tamanhos":["P","M","G"],"cores":["Azul-celeste","Branco","Preto","Azul-royal","Verde-musgo","Verde-bandeira"]},
  {"id":12,"cat":"caneca","nome":"Caneca Aventura","preco":52.11,"destaque":true,"lado":"","desc":"Caneca de porcelana com a arte do rafting em Lumiar e o logo da Lumiar Aventura, estampada por sublimação.","fotos":[["caneca-aventura.webp","Principal"]],"tamanhos":[],"cores":["Branco","Preto"]},
  {"id":13,"cat":"caneca","nome":"Caneca Lumiar — Curtir e Amar","preco":52.11,"destaque":true,"lado":"","desc":"Caneca de porcelana com a paisagem da Serra de Lumiar e a frase \"Curtir e amar\", estampada por sublimação.","fotos":[["caneca-lumiar.webp","Principal"]],"tamanhos":[],"cores":["Branco","Preto"]},
  {"id":14,"cat":"camisa-lycra","nome":"Camisa DryFit Remar é Viver","preco":80.89,"destaque":true,"lado":"costas","desc":"Camiseta DryFit em poliéster, leve e de secagem rápida, com a arte nas costas \"Remar é viver\" das corredeiras de Lumiar.","fotos":[["remar-e-viver.webp","Principal"]],"tamanhos":["P","M","G"],"cores":["Branco"]},
  {"id":15,"cat":"camisa-algodao","nome":"Camisa Aventura que Fica na Memória","preco":80.78,"destaque":true,"lado":"frente","desc":"Camiseta unissex de algodão cardado com a arte \"Aventura que fica na memória\" do rafting em Lumiar.","fotos":[["aventura-memoria.webp","Principal"]],"tamanhos":["P","M","G"],"cores":["Branco","Cinza"]},
  {"id":16,"cat":"camisa-algodao","nome":"Camisa Eu Pratiquei","preco":93.47,"destaque":true,"lado":"","desc":"Camiseta unissex de algodão penteado fio 30.1. Nas costas, a arte \"Eu pratiquei\" do rafting em Lumiar; na frente, os remos cruzados.","fotos":[["eu-pratiquei-b.webp","Principal"],["eu-pratiquei-a.webp","Outro lado"]],"tamanhos":["P","M","G"],"cores":["Branco","Off-white","Cinza","Verde-oliva"]},
  {"id":17,"cat":"camisa-algodao","nome":"Camisa Eu Remei e Curti","preco":93.47,"destaque":true,"lado":"","desc":"Camiseta unissex de algodão penteado fio 30.1. Nas costas, a arte \"Eu remei e curti!\" com remos e corredeiras; na frente, os remos cruzados.","fotos":[["remei-e-curti-b.webp","Principal"],["remei-e-curti-a.webp","Outro lado"]],"tamanhos":["P","M","G"],"cores":["Branco","Off-white","Cinza","Verde-oliva"]},
  {"id":18,"cat":"camisa-lycra","nome":"Camisa DryFit Eu Encarei","preco":80.89,"destaque":true,"lado":"frente","desc":"Camiseta DryFit em poliéster, leve e de secagem rápida, com a arte \"Eu encarei, eu remei, eu sobrevivi!\" do rafting em Lumiar.","fotos":[["eu-encarei.webp","Principal"]],"tamanhos":["P","M","G"],"cores":["Branco"]}
];

const brl = v => 'R$ ' + v.toFixed(2).replace('.', ',');
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const foto = f => 'uploads/' + f;
// Selo para camisas com estampa de um lado só.
const seloLado = (p, naPagina) => !p.lado ? '' :
  `<span class="selo-lado${naPagina ? ' inline' : ''}">Estampa ${naPagina ? 'só ' : ''}${p.lado === 'costas' ? 'nas costas' : 'na frente'}</span>`;

function lerCarrinho() { try { return JSON.parse(localStorage.getItem('lumiar-carrinho')) || []; } catch (e) { return []; } }
function salvarCarrinho(c) { try { localStorage.setItem('lumiar-carrinho', JSON.stringify(c)); } catch (e) {} atualizarContador(); }
function atualizarContador() {
  const n = lerCarrinho().reduce((s, i) => s + i.qtd, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = n);
}

function toast(html) {
  let t = document.querySelector('.toast');
  if (!t) { t = document.createElement('div'); t.className = 'toast'; document.body.appendChild(t); }
  t.innerHTML = html; t.classList.add('show');
  clearTimeout(t._h); t._h = setTimeout(() => t.classList.remove('show'), 3500);
}

function paginaLista() {
  const filtros = document.getElementById('filtros'), grade = document.getElementById('produtos');
  const params = new URLSearchParams(location.search);
  let atual = params.get('categoria') || '';
  function render() {
    filtros.innerHTML = [['', 'Tudo'], ...Object.entries(CATEGORIAS)]
      .map(([k, v]) => `<a data-cat="${k}" class="${k === atual ? 'active' : ''}">${v}</a>`).join('');
    const lista = PRODUTOS.filter(p => !atual || p.cat === atual);
    grade.innerHTML = lista.length ? lista.map(p => `
      <a class="product-card" href="produto.html?id=${p.id}">
        ${p.destaque ? '<span class="badge">Destaque</span>' : ''}
        ${seloLado(p, false)}
        ${p.fotos.length > 1 ? `<div class="card-fotos">
          <img src="${foto(p.fotos[0][0])}" alt="${esc(p.nome)}" loading="lazy">
          <img class="foto-2" src="${foto(p.fotos[1][0])}" alt="${esc(p.nome)}, outro lado" loading="lazy">
          <span class="card-dots"><span class="dot" role="button" tabindex="0" aria-label="Ver foto principal"></span><span class="dot" role="button" tabindex="0" aria-label="Ver outro lado"></span></span>
        </div>` : `<img src="${foto(p.fotos[0][0])}" alt="${esc(p.nome)}" loading="lazy">`}
        <div class="info"><span class="tag">${CATEGORIAS[p.cat]}</span><h3>${esc(p.nome)}</h3><span class="price">${brl(p.preco)}</span></div>
      </a>`).join('') : '<div class="empty">Nenhum produto nesta categoria por enquanto.</div>';
  }
  // Bolinhas dos cards com frente e costas: o toque troca a foto sem abrir o produto.
  grade.addEventListener('click', e => {
    const dot = e.target.closest('.card-dots .dot'); if (!dot) return;
    e.preventDefault(); e.stopPropagation();
    const box = dot.closest('.card-fotos');
    box.classList.toggle('outro-lado', dot === box.querySelectorAll('.dot')[1]);
    box.classList.add('fixo');
  });
  grade.addEventListener('mouseout', e => {
    const card = e.target.closest('.product-card');
    if (card && !card.contains(e.relatedTarget)) card.querySelector('.card-fotos')?.classList.remove('fixo', 'outro-lado');
  });
  filtros.addEventListener('click', e => {
    const a = e.target.closest('a[data-cat]'); if (!a) return;
    atual = a.dataset.cat; render();
    history.replaceState(null, '', atual ? '?categoria=' + atual : location.pathname);
  });
  render();
}

function paginaProduto() {
  const id = Number(new URLSearchParams(location.search).get('id'));
  const p = PRODUTOS.find(x => x.id === id);
  const box = document.getElementById('produto');
  if (!p) { box.innerHTML = '<div class="empty">Produto não encontrado. <a href="index.html">Ver produtos →</a></div>'; return; }
  document.title = p.nome + ' — Loja Lumiar Aventura';
  document.getElementById('voltar').textContent = '← ' + CATEGORIAS[p.cat];
  document.getElementById('voltar').href = 'index.html?categoria=' + p.cat;
  const grupo = (label, nome, opts) => opts.length ? `<div class="option-group"><span class="label">${label}</span><div class="options">${
    opts.map((o, i) => `<label><input type="radio" name="${nome}" value="${esc(o)}" ${i === 0 ? 'checked' : ''}><span>${esc(o)}</span></label>`).join('')}</div></div>` : '';
  box.innerHTML = `
    <div>
      <img id="foto-principal" src="${foto(p.fotos[0][0])}" alt="${esc(p.nome)}">
      ${p.fotos.length > 1 ? `<div class="thumbs">${p.fotos.map((f, i) => `<button type="button" data-src="${foto(f[0])}" class="${i === 0 ? 'active' : ''}"><img src="${foto(f[0])}" alt=""><span>${f[1]}</span></button>`).join('')}</div>` : ''}
    </div>
    <div>
      <span class="eyebrow">${CATEGORIAS[p.cat]}</span>${seloLado(p, true)}
      <h1>${esc(p.nome)}</h1>
      <div class="price">${brl(p.preco)}</div>
      <p class="desc">${esc(p.desc)}</p>
      ${grupo('Tamanho', 'tamanho', p.tamanhos)}
      ${grupo('Cor', 'cor', p.cores)}
      <div class="option-group"><span class="label">Quantidade</span>
        <div class="buy-row">
          <div class="qty"><button type="button" data-d="-1">−</button><input id="qtd" type="number" min="1" max="20" value="1"><button type="button" data-d="1">+</button></div>
          <button class="btn btn-primary" id="adicionar">Adicionar ao carrinho</button>
        </div>
      </div>
      <div class="perks">
        <div><strong>Produzido sob demanda.</strong> Sua peça é impressa depois do pedido, por isso o prazo de produção é de 3 a 7 dias úteis antes do envio.</div>
        <div><strong>Envio para todo o Brasil.</strong> O frete é calculado e confirmado com você pelo WhatsApp ao fechar o pedido.</div>
        ${p.tamanhos.length ? '<div><strong>Dúvida no tamanho?</strong> Mande sua altura e peso no WhatsApp que a equipe indica o melhor tamanho.</div>' : ''}
      </div>
    </div>`;
  box.querySelectorAll('.thumbs button').forEach(b => b.addEventListener('click', () => {
    document.getElementById('foto-principal').src = b.dataset.src;
    box.querySelectorAll('.thumbs button').forEach(x => x.classList.toggle('active', x === b));
  }));
  const qtd = document.getElementById('qtd');
  box.querySelectorAll('.qty button').forEach(b => b.addEventListener('click', () => {
    qtd.value = Math.min(20, Math.max(1, (Number(qtd.value) || 1) + Number(b.dataset.d)));
  }));
  document.getElementById('adicionar').addEventListener('click', () => {
    const val = n => (box.querySelector(`input[name="${n}"]:checked`) || {}).value || '';
    const item = { id: p.id, tamanho: val('tamanho'), cor: val('cor'), qtd: Math.min(20, Math.max(1, Number(qtd.value) || 1)) };
    const c = lerCarrinho();
    const igual = c.find(i => i.id === item.id && i.tamanho === item.tamanho && i.cor === item.cor);
    if (igual) igual.qtd = Math.min(20, igual.qtd + item.qtd); else c.push(item);
    salvarCarrinho(c);
    toast('Adicionado ao carrinho. <a href="carrinho.html">Ver carrinho →</a>');
  });
}

function paginaCarrinho() {
  const lista = document.getElementById('itens'), resumo = document.getElementById('resumo');
  function render() {
    const c = lerCarrinho().filter(i => PRODUTOS.some(p => p.id === i.id));
    if (!c.length) {
      lista.innerHTML = '<div class="empty">Seu carrinho está vazio. <a href="index.html" style="color:var(--river-500)">Ver produtos →</a></div>';
    } else {
      lista.innerHTML = c.map((i, n) => {
        const p = PRODUTOS.find(x => x.id === i.id);
        const meta = [i.tamanho && 'Tam. ' + i.tamanho, i.cor, i.qtd + ' un.'].filter(Boolean).join(' · ');
        return `<div class="cart-item"><img src="${foto(p.fotos[0][0])}" alt=""><div><h3>${esc(p.nome)}</h3><div class="meta">${esc(meta)}</div></div>
          <div class="right"><strong>${brl(p.preco * i.qtd)}</strong><button class="remove" data-n="${n}">Remover</button></div></div>`;
      }).join('');
    }
    const sub = c.reduce((s, i) => s + PRODUTOS.find(p => p.id === i.id).preco * i.qtd, 0);
    resumo.innerHTML = `<div class="summary-line"><span>Subtotal</span><span>${brl(sub)}</span></div>
      <div class="summary-line"><span>Frete</span><span>a combinar no WhatsApp</span></div>
      <div class="summary-line total"><span>Total</span><span>${brl(sub)} + frete</span></div>`;
    document.getElementById('enviar').disabled = !c.length;
  }
  lista.addEventListener('click', e => {
    const b = e.target.closest('.remove'); if (!b) return;
    const c = lerCarrinho(); c.splice(Number(b.dataset.n), 1); salvarCarrinho(c); render();
  });
  document.getElementById('form-pedido').addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(e.target), c = lerCarrinho();
    const linhas = c.map(i => {
      const p = PRODUTOS.find(x => x.id === i.id);
      return `• ${i.qtd}x ${p.nome}${i.tamanho ? ' (' + i.tamanho + ')' : ''}${i.cor ? ' – ' + i.cor : ''}: ${brl(p.preco * i.qtd)}`;
    });
    const sub = c.reduce((s, i) => s + PRODUTOS.find(p => p.id === i.id).preco * i.qtd, 0);
    const msg = ['Olá! Quero fazer um pedido na loja Lumiar Aventura:', ...linhas, `Subtotal: ${brl(sub)}`, '',
      `Nome: ${f.get('nome')}`, `Entrega: ${f.get('cidade')} - CEP ${f.get('cep')}`,
      f.get('observacoes') ? `Obs.: ${f.get('observacoes')}` : '', '', 'Pode me passar o frete e a forma de pagamento?'].filter((l, i, a) => l !== '' || a[i - 1] !== '').join('\n');
    window.open('https://wa.me/' + WHATS + '?text=' + encodeURIComponent(msg), '_blank', 'noopener');
  });
  render();
}

document.addEventListener('DOMContentLoaded', () => {
  atualizarContador();
  const pg = document.body.dataset.page;
  if (pg === 'lista') paginaLista();
  if (pg === 'produto') paginaProduto();
  if (pg === 'carrinho') paginaCarrinho();
});
