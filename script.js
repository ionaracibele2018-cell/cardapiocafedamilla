const SENHA_ADMIN = "cafeDAmilla883982";

// COLOQUE O WHATSAPP DA LOJA COM DDD
const WHATSAPP_DA_LOJA = "55SEUNUMERO";

const CHAVE_PRODUTOS = "cafeMillaProdutos";
const CHAVE_MIGRACAO = "cafeMillaMigracao2";

const produtosIniciais = [

    // SALGADOS FITNESS

    {id: 1, nome: "Coxinha fit de macaxeira com frango", categoria: "Salgados fitness", preco: 8},
    {id: 2, nome: "Coxinha fit de macaxeira com carne de sol", categoria: "Salgados fitness", preco: 9},
    {id: 3, nome: "Pastel de grão-de-bico com frango cremoso", categoria: "Salgados fitness", preco: 8},
    {id: 4, nome: "Pastel de grão-de-bico com carne de sol", categoria: "Salgados fitness", preco: 9},
    {id: 5, nome: "Empada fit de frango", categoria: "Salgados fitness", preco: 8},
    {id: 6, nome: "Empada fit de carne de sol", categoria: "Salgados fitness", preco: 9},
    {id: 7, nome: "Empada fit de palmito e queijo", categoria: "Salgados fitness", preco: 9},
    {id: 8, nome: "Sanduíche natural", categoria: "Salgados fitness", preco: 15},
    {id: 9, nome: "Pão artesanal (sob encomenda)", categoria: "Salgados fitness", preco: null},
    {id: 10, nome: "Macaxeira, batata-doce ou jerimum", categoria: "Salgados fitness", preco: 25},

    // BOLOS FUNCIONAIS

    {id: 11, nome: "Bolo pequeno", categoria: "Bolos funcionais", preco: 25},
    {id: 12, nome: "Bolo médio", categoria: "Bolos funcionais", preco: 38},

    // SOBREMESAS SAUDÁVEIS

    {id: 13, nome: "Brownie de pote - doce de leite", categoria: "Sobremesas saudáveis", preco: 20},
    {id: 14, nome: "Brownie de pote - ganache 70%", categoria: "Sobremesas saudáveis", preco: 20},
    {id: 15, nome: "Brownie de pote - morangos e ganache", categoria: "Sobremesas saudáveis", preco: 22},
    {id: 16, nome: "Cocada cremosa", categoria: "Sobremesas saudáveis", preco: 20},
    {id: 17, nome: "Cookies funcionais (2 unidades)", categoria: "Sobremesas saudáveis", preco: 12},
    {id: 18, nome: "Cookie red velvet com gotas de chocolate branco", categoria: "Sobremesas saudáveis", preco: 15},
    {id: 19, nome: "Cookie FUDGE (10 unidades)", categoria: "Sobremesas saudáveis", preco: 18},
    {id: 20, nome: "Brownie na marmita", categoria: "Sobremesas saudáveis", preco: 15},
    {id: 21, nome: "Fatia de prestígio gelado", categoria: "Sobremesas saudáveis", preco: 25},

    // BEBIDAS

    {id: 22, nome: "Yo pro", categoria: "Bebidas", preco: 10},
    {id: 23, nome: "Refrigerante zero", categoria: "Bebidas", preco: 6},
    {id: 24, nome: "Capuccino", categoria: "Bebidas", preco: 7},
    {id: 25, nome: "Capuccino pequeno", categoria: "Bebidas", preco: 5},
    {id: 26, nome: "Água mineral", categoria: "Bebidas", preco: 3},
    {id: 27, nome: "Água com gás", categoria: "Bebidas", preco: 4},
    {id: 28, nome: "Suco natural", categoria: "Bebidas", preco: 7},
    {id: 29, nome: "Suco ao leite", categoria: "Bebidas", preco: 8}

];

let produtos = carregarProdutos();
let fotoTemporaria = "";

// CARREGAR E MIGRAR PRODUTOS ANTIGOS

function carregarProdutos() {

    try {

        const dados = localStorage.getItem(CHAVE_PRODUTOS);

        if (!dados) {
            localStorage.setItem(
                CHAVE_PRODUTOS,
                JSON.stringify(produtosIniciais)
            );

            return [...produtosIniciais];
        }

        let salvos = JSON.parse(dados);

        if (!Array.isArray(salvos)) {
            return [...produtosIniciais];
        }

        // Acrescenta as bebidas e outros produtos iniciais
        // apenas uma vez, sem apagar os cadastros existentes.

        if (!localStorage.getItem(CHAVE_MIGRACAO)) {

            produtosIniciais.forEach(inicial => {

                const jaExiste = salvos.some(
                    produto => Number(produto.id) === inicial.id
                );

                if (!jaExiste) {
                    salvos.push({...inicial});
                }

            });

            localStorage.setItem(
                CHAVE_PRODUTOS,
                JSON.stringify(salvos)
            );

            localStorage.setItem(CHAVE_MIGRACAO, "sim");
        }

        return salvos;

    } catch (erro) {

        console.error("Erro ao carregar produtos:", erro);

        return [...produtosIniciais];

    }

}

function salvarDados() {

    try {

        localStorage.setItem(
            CHAVE_PRODUTOS,
            JSON.stringify(produtos)
        );

        return true;

    } catch (erro) {

        alert(
            "Não foi possível salvar. A foto pode estar muito grande. Tente uma imagem menor."
        );

        return false;

    }

}


// DISPONIBILIDADE AUTOMÁTICA

function produtoEstaBloqueado(produto) {

    if (!produto.bloqueadoAte) return false;

    return Date.now() < Number(produto.bloqueadoAte);

}

function verificarBloqueiosExpirados() {

    let alterou = false;

    produtos.forEach(produto => {

        if (
            produto.bloqueadoAte &&
            Date.now() >= Number(produto.bloqueadoAte)
        ) {

            delete produto.bloqueadoAte;

            alterou = true;

        }

    });

    if (alterou) {
        salvarDados();
    }

}


// CARDÁPIO PÚBLICO

function mostrarCardapio() {

    verificarBloqueiosExpirados();

    const area = document.getElementById("cardapio");

    area.innerHTML = "";

    const categorias = [
        "Salgados fitness",
        "Bolos funcionais",
        "Sobremesas saudáveis",
        "Bebidas"
    ];

    categorias.forEach(categoria => {

        const itens = produtos.filter(
            produto => produto.categoria === categoria
        );

        if (!itens.length) return;

        const secao = document.createElement("section");

        secao.className = "categoria";

        const titulo = document.createElement("h3");

        titulo.textContent = categoria;

        secao.appendChild(titulo);

        itens.forEach(produto => {

            const linha = document.createElement("div");

            linha.className = "produto";

            const nome = document.createElement("span");

            nome.className = "produto-nome";

            nome.textContent = produto.nome;

            const preco = document.createElement("span");

            if (produtoEstaBloqueado(produto)) {

                preco.className = "status-indisponivel";

                preco.textContent = "PRODUTO INDISPONÍVEL";

            } else {

                preco.className = "produto-preco";

                preco.textContent = produto.preco === null
                    ? "Sob encomenda"
                    : Number(produto.preco).toLocaleString(
                        "pt-BR",
                        {
                            style: "currency",
                            currency: "BRL"
                        }
                    );

            }

            linha.append(nome, preco);

            secao.appendChild(linha);

        });

        area.appendChild(secao);

    });

    if (!area.children.length) {

        area.textContent =
            "Nosso cardápio está sendo atualizado. ♡";

    }

}


// LOGIN ADMINISTRATIVO

function abrirLogin() {

    document.getElementById("modalLogin")
        .classList.add("ativo");

}

function fecharModais() {

    document.querySelectorAll(".modal").forEach(modal => {

        modal.classList.remove("ativo");

    });

}

function entrarAdmin() {

    const senha = document.getElementById("senha").value;

    if (senha === SENHA_ADMIN) {

        document.getElementById("modalLogin")
            .classList.remove("ativo");

        document.getElementById("modalAdmin")
            .classList.add("ativo");

        document.getElementById("erroSenha").textContent = "";

        document.getElementById("senha").value = "";

        mostrarListaAdmin();

    } else {

        document.getElementById("erroSenha").textContent =
            "Senha incorreta. Tente novamente.";

    }

}

function sairAdmin() {

    limparFormulario();

    fecharModais();

}


// ADICIONAR E EDITAR PRODUTOS

function salvarProduto() {

    const id = document.getElementById("produtoId").value;

    const nome = document.getElementById("nomeProduto")
        .value.trim();

    const categoria = document.getElementById("categoriaProduto")
        .value;

    const valor = document.getElementById("precoProduto").value;

    if (!nome) {

        alert("Digite o nome do produto.");

        return;

    }

    if (valor !== "" && Number(valor) < 0) {

        alert("Digite um preço válido.");

        return;

    }

    const preco = valor === "" ? null : Number(valor);

    if (id) {

        const indice = produtos.findIndex(
            produto => Number(produto.id) === Number(id)
        );

        if (indice !== -1) {

            produtos[indice] = {

                ...produtos[indice],

                nome: nome,

                categoria: categoria,

                preco: preco,

                foto: fotoTemporaria ||
                    produtos[indice].foto || ""

            };

        }

    } else {

        produtos.push({

            id: Date.now(),

            nome: nome,

            categoria: categoria,

            preco: preco,

            foto: fotoTemporaria

        });

    }

    if (!salvarDados()) return;

    alert("Produto salvo com sucesso!");

    limparFormulario();

    mostrarCardapio();

    mostrarListaAdmin();

}


// EDITAR PRODUTO

function editarProduto(id) {

    const produto = produtos.find(
        p => Number(p.id) === Number(id)
    );

    if (!produto) return;

    document.getElementById("produtoId").value = produto.id;

    document.getElementById("nomeProduto").value = produto.nome;

    document.getElementById("categoriaProduto").value =
        produto.categoria;

    document.getElementById("precoProduto").value =
        produto.preco === null ? "" : produto.preco;

    fotoTemporaria = produto.foto || "";

    const preview = document.getElementById("previewFoto");

    if (fotoTemporaria) {

        preview.src = fotoTemporaria;

        preview.style.display = "block";

    } else {

        preview.src = "";

        preview.style.display = "none";

    }

    document.getElementById("nomeProduto").focus();

}


// EXCLUIR PRODUTO

function excluirProduto(id) {

    if (!confirm("Deseja realmente excluir este produto?")) {
        return;
    }

    produtos = produtos.filter(
        produto => Number(produto.id) !== Number(id)
    );

    if (!salvarDados()) return;

    mostrarCardapio();

    mostrarListaAdmin();

}


// LIMPAR FORMULÁRIO

function limparFormulario() {

    document.getElementById("produtoId").value = "";

    document.getElementById("nomeProduto").value = "";

    document.getElementById("precoProduto").value = "";

    document.getElementById("fotoProduto").value = "";

    document.getElementById("categoriaProduto").value =
        "Salgados fitness";

    fotoTemporaria = "";

    const preview = document.getElementById("previewFoto");

    preview.src = "";

    preview.style.display = "none";

}


// BLOQUEAR PRODUTO

function abrirBloqueio(id) {

    const controle = document.getElementById(
        "controle-" + id
    );

    if (!controle) return;

    const jaAberto = controle.classList.contains("aberto");

    // Fecha os outros controles de bloqueio.

    document.querySelectorAll(".controle-bloqueio").forEach(item => {
        item.classList.remove("aberto");
    });

    if (!jaAberto) {
        controle.classList.add("aberto");
    }

}

function confirmarBloqueio(id) {

    const produto = produtos.find(
        p => Number(p.id) === Number(id)
    );

    if (!produto) return;

    const campo = document.getElementById(
        "dias-" + id
    );

    const dias = Number(campo.value);

    if (!Number.isInteger(dias) || dias < 1 || dias > 7) {

        alert("Escolha um período entre 1 e 7 dias.");

        return;

    }

    const milissegundosPorDia = 24 * 60 * 60 * 1000;

    produto.bloqueadoAte =
        Date.now() + (dias * milissegundosPorDia);

    if (!salvarDados()) return;

    alert(
        produto.nome + " ficará indisponível por " +
        dias + " dia(s)."
    );

    mostrarCardapio();

    mostrarListaAdmin();

}


// LIBERAR PRODUTO ANTES DO PRAZO

function liberarProduto(id) {

    const produto = produtos.find(
        p => Number(p.id) === Number(id)
    );

    if (!produto) return;

    if (!confirm(
        "Deseja deixar " + produto.nome +
        " disponível novamente?"
    )) return;

    delete produto.bloqueadoAte;

    if (!salvarDados()) return;

    mostrarCardapio();

    mostrarListaAdmin();

}


// MOSTRAR LISTA ADMINISTRATIVA

function mostrarListaAdmin() {

    verificarBloqueiosExpirados();

    const lista = document.getElementById("listaAdmin");

    lista.innerHTML = "";

    produtos.forEach(produto => {

        const item = document.createElement("div");

        item.className = "item-admin";

        const topo = document.createElement("div");

        topo.className = "item-admin-topo";

        if (produto.foto) {

            const imagem = document.createElement("img");

            imagem.src = produto.foto;

            imagem.alt = produto.nome;

            topo.appendChild(imagem);

        }

        const info = document.createElement("div");

        info.className = "item-admin-info";

        const nome = document.createElement("strong");

        nome.textContent = produto.nome;

        const detalhes = document.createElement("p");

        const precoTexto = produto.preco === null
            ? "Sob encomenda"
            : Number(produto.preco).toLocaleString(
                "pt-BR",
                {
                    style: "currency",
                    currency: "BRL"
                }
            );

        detalhes.textContent =
            produto.categoria + " • " + precoTexto;

        info.append(nome, detalhes);

        topo.appendChild(info);

        item.appendChild(topo);

        // BOTÕES DE AÇÃO

        const acoes = document.createElement("div");

        acoes.className = "acoes-produto";

        const botaoEditar = document.createElement("button");

        botaoEditar.className = "editar";

        botaoEditar.textContent = "EDITAR NOME / PREÇO";

        botaoEditar.onclick = () => editarProduto(produto.id);

        const botaoExcluir = document.createElement("button");

        botaoExcluir.className = "excluir";

        botaoExcluir.textContent = "EXCLUIR";

        botaoExcluir.onclick = () => excluirProduto(produto.id);

        acoes.append(botaoEditar, botaoExcluir);

        if (produtoEstaBloqueado(produto)) {

            const botaoLiberar = document.createElement("button");

            botaoLiberar.className = "liberar";

            botaoLiberar.textContent = "LIBERAR PRODUTO";

            botaoLiberar.onclick = () => liberarProduto(produto.id);

            acoes.appendChild(botaoLiberar);

        } else {

            const botaoIndisponivel = document.createElement("button");

            botaoIndisponivel.className = "indisponivel";

            botaoIndisponivel.textContent =
                "PRODUTO INDISPONÍVEL";

            botaoIndisponivel.onclick = () =>
                abrirBloqueio(produto.id);

            acoes.appendChild(botaoIndisponivel);

        }

        item.appendChild(acoes);

        // CONTROLE DE DIAS

        if (!produtoEstaBloqueado(produto)) {

            const controle = document.createElement("div");

            controle.className = "controle-bloqueio";

            controle.id = "controle-" + produto.id;

            const label = document.createElement("label");

            label.textContent =
                "Por quantos dias bloquear esse produto?";

            const select = document.createElement("select");

            select.id = "dias-" + produto.id;

            for (let dia = 1; dia <= 7; dia++) {

                const opcao = document.createElement("option");

                opcao.value = dia;

                opcao.textContent =
                    dia + (dia === 1 ? " dia" : " dias");

                select.appendChild(opcao);

            }

            const confirmar = document.createElement("button");

            confirmar.className = "confirmar-bloqueio";

            confirmar.textContent = "CONFIRMAR BLOQUEIO";

            confirmar.onclick = () =>
                confirmarBloqueio(produto.id);

            controle.append(label, select, confirmar);

            item.appendChild(controle);

        } else {

            const aviso = document.createElement("p");

            aviso.className = "aviso-bloqueado";

            const data = new Date(
                Number(produto.bloqueadoAte)
            );

            aviso.textContent =
                "Indisponível até " +
                data.toLocaleString("pt-BR");

            item.appendChild(aviso);

        }

        lista.appendChild(item);

    });

}


// FOTOS DOS PRODUTOS

document.getElementById("fotoProduto")
    .addEventListener("change", function() {

        const arquivo = this.files[0];

        if (!arquivo) return;

        if (!arquivo.type.startsWith("image/")) {

            alert("Selecione uma imagem válida.");

            this.value = "";

            return;

        }

        if (arquivo.size > 500 * 1024) {

            alert("Escolha uma foto de até 500 KB.");

            this.value = "";

            return;

        }

        const leitor = new FileReader();

        leitor.onload = function(evento) {

            fotoTemporaria = evento.target.result;

            const preview =
                document.getElementById("previewFoto");

            preview.src = fotoTemporaria;

            preview.style.display = "block";

        };

        leitor.readAsDataURL(arquivo);

    });


// ENTREGA

function abrirEntrega() {

    document.getElementById("modalEntrega")
        .classList.add("ativo");

    document.getElementById("erroEntrega").textContent = "";

}

function horarioDisponivel(horario) {

    if (!horario) return false;

    const [hora, minuto] = horario.split(":").map(Number);

    const minutos = hora * 60 + minuto;

    const manha =
        minutos >= 660 && minutos <= 740;

    const tarde =
        minutos >= 840 && minutos <= 1020;

    return manha || tarde;

}

function enviarEntrega() {

    const nome = document.getElementById("clienteNome")
        .value.trim();

    const telefone = document.getElementById("clienteTelefone")
        .value.trim();

    const endereco = document.getElementById("clienteEndereco")
        .value.trim();

    const horario = document.getElementById("horarioEntrega")
        .value;

    const erro = document.getElementById("erroEntrega");

    erro.textContent = "";

    if (!nome || !telefone || !endereco || !horario) {

        erro.textContent =
            "Preencha todos os campos para continuar.";

        return;

    }

    if (!/^[0-9()+\s-]{10,20}$/.test(telefone)) {

        erro.textContent =
            "Digite um telefone válido.";

        return;

    }

    if (!horarioDisponivel(horario)) {

        erro.textContent =
            "Entregas não disponíveis pra esse horário.";

        return;

    }

    if (WHATSAPP_DA_LOJA === "55SEUNUMERO") {

        erro.textContent =
            "Configure o WhatsApp da loja no arquivo script.js.";

        return;

    }

    const mensagem =

`Olá! Gostaria de solicitar uma entrega pelo Café da Milla.

Nome: ${nome}

Telefone: ${telefone}

Endereço: ${endereco}

Horário desejado: ${horario}

Aguardo a confirmação. Obrigado(a)!`;

    const link =
        "https://wa.me/" +
        WHATSAPP_DA_LOJA +
        "?text=" +
        encodeURIComponent(mensagem);

    window.open(link, "_blank");

}


// INICIALIZAÇÃO

verificarBloqueiosExpirados();

mostrarCardapio();

// INICIALIZAÇÃO

verificarBloqueiosExpirados();
mostrarCardapio();

// Fechar modal ao clicar fora do conteúdo
document.querySelectorAll(".modal").forEach(modal => {
    modal.addEventListener("click", function(ev) {
        if (ev.target === modal) {
            modal.style.display = "none";
        }
    });
});