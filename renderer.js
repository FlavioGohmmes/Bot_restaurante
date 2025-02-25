const { ipcRenderer } = require('electron');
const qrcode = require('qrcode-terminal');
const { Client } = require('whatsapp-web.js');
const config = require('./config.json'); // Carrega as configurações do restaurante

let client;

// Exibe o QR Code na interface
function showQRCode(qr) {
  const qrcodeElement = document.getElementById('qrcode');
  qrcode.generate(qr, { small: true }, (code) => {
    qrcodeElement.innerHTML = `<pre>${code}</pre>`;
  });
}

// Atualiza o status na interface
function updateStatus(status) {
  const statusElement = document.getElementById('status');
  statusElement.textContent = `Status: ${status}`;
}

// Função para simular delay e digitação
async function simulateTyping(chat, delayTime = 2000) {
  await chat.sendStateTyping(); // Simula digitação
  await new Promise(resolve => setTimeout(resolve, delayTime)); // Delay
}

// Inicializa o bot do WhatsApp
function initializeBot() {
  client = new Client();

  client.on('qr', (qr) => {
    showQRCode(qr); // Exibe o QR Code
    updateStatus('Aguardando conexão...');
  });

  client.on('ready', () => {
    updateStatus('Conectado!');
    console.log('Bot está pronto e conectado ao WhatsApp.');
  });

  client.on('message', async (msg) => {
    console.log('Mensagem recebida:', msg.body); // Log para depuração

    const chat = await msg.getChat();
    const contact = await msg.getContact();
    const name = contact.pushname;

    // Resposta inicial (menu)
    if (msg.body.match(/(teste)/i) && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `Olá, ${name.split("* *")[0]}! 😊 Bem-vindo(a) ao *${config.nomeRestaurante}*. Como posso ajudar você hoje? Por favor, escolha uma das opções abaixo:\n\n` +
        `1 - Ver Cardápio\n` +
        `2 - Horário de Funcionamento\n` +
        `3 - Formas de Pagamento\n` +
        `4 - Fazer um Pedido\n` +
        `5 - Reservar uma Mesa\n` +
        `6 - Falar com um Atendente`
      );
    }

    // Opção 1 - Ver Cardápio
    if (msg.body === '1' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `🍽️ *Cardápio do ${config.nomeRestaurante}* 🍽️\n\n` +
        `*Pratos Principais:*\n` +
        `${config.cardapio.pratos.map(prato => `- ${prato.nome}: R$ ${prato.preco.toFixed(2)}`).join('\n')}\n\n` +
        `*Bebidas:*\n` +
        `${config.cardapio.bebidas.map(bebida => `- ${bebida.nome}: R$ ${bebida.preco.toFixed(2)}`).join('\n')}\n\n` +
        `*Sobremesas:*\n` +
        `${config.cardapio.sobremesas.map(sobremesa => `- ${sobremesa.nome}: R$ ${sobremesa.preco.toFixed(2)}`).join('\n')}\n\n` +
        `Para fazer um pedido, digite *4*.`
      );
    }

    // Opção 2 - Horário de Funcionamento
    if (msg.body === '2' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `⏰ *Horário de Funcionamento* ⏰\n\n` +
        `${config.horarioFuncionamento}\n\n` +
        `Estamos à sua disposição! 😊`
      );
    }

    // Opção 3 - Formas de Pagamento
    if (msg.body === '3' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `💳 *Formas de Pagamento* 💳\n\n` +
        `Aceitamos:\n` +
        `${config.formasPagamento}\n\n` +
        `Escolha a melhor forma para você! 😊`
      );
    }

    // Opção 4 - Fazer um Pedido
    if (msg.body === '4' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `🍴 *Fazer um Pedido* 🍴\n\n` +
        `Para fazer seu pedido, por favor, envie:\n` +
        `- O nome do prato ou bebida\n` +
        `- A quantidade\n` +
        `- Seu endereço de entrega (se for delivery)\n\n` +
        `💳 *Formas de Pagamento* 💳\n\n` +
        `Aceitamos:\n` +
        `- ${config.formasPagamento}\n\n` +
        `Exemplo: *2 Strogonoff de Frango e 1 Refrigerante, entrega na Rua das Flores, 123 , Pagamento via Pix*\n\n` +
        `Aguarde nossa confirmação! 😊`
      );
    }

    // Opção 5 - Reservar uma Mesa
    if (msg.body === '5' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `🪑 *Reservar uma Mesa* 🪑\n\n` +
        `Para reservar uma mesa, por favor, informe:\n` +
        `- Data e horário desejados\n` +
        `- Número de pessoas\n` +
        `- Seu nome\n\n` +
        `Exemplo: "Reserva para 4 pessoas, dia 25/10 às 19h, nome: João."\n\n` +
        `Aguarde nossa confirmação! 😊`
      );
    }

    // Opção 6 - Falar com um Atendente
    if (msg.body === '6' && msg.from.endsWith('@c.us')) {
      await simulateTyping(chat);
      await client.sendMessage(
        msg.from,
        `👤 *Falar com um Atendente* 👤\n\n` +
        `Um de nossos atendentes entrará em contato com você em breve. Aguarde, por favor! 😊`
      );
    }
  });

  client.initialize();
}

// Inicia o bot quando a interface estiver pronta
window.onload = initializeBot;