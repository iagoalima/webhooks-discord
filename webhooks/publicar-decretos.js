const WEBHOOK_URL = process.env.STM_DECRETOS_WEBHOOK_URL;

const BANNER_URL =
  'https://raw.githubusercontent.com/iagoalima/webhooks-discord/main/webhooks/banner%20stm%20-%20decretos.png';

const EMBED_COLOR = 0x1e3748;
const REQUEST_DELAY = 700;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWebhook(payload) {
  await sleep(REQUEST_DELAY);

  while (true) {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (response.ok) {
      return response;
    }

    const body = await response.text();

    if (response.status === 429) {
      let retryAfter = 1;

      try {
        const data = JSON.parse(body);
        retryAfter = Number(data.retry_after) || 1;
      } catch {
        retryAfter = 1;
      }

      await sleep(Math.ceil(retryAfter * 1000) + 250);
      continue;
    }

    throw new Error(`Discord retornou ${response.status}: ${body}`);
  }
}

async function publishDecretos() {
  if (!WEBHOOK_URL) {
    throw new Error(
      'Defina a variável de ambiente STM_DECRETOS_WEBHOOK_URL antes de executar.',
    );
  }

  await sendWebhook({
    embeds: [
      {
        title: 'Canal Oficial de Decretos — Superior Tribunal Militar',
        description: `> Com o intuito de preservar a organização institucional, a clareza nas comunicações e a ampla publicidade dos atos normativos, este canal destina-se exclusivamente à divulgação dos decretos expedidos no âmbito do Superior Tribunal Militar.

> A criação deste espaço específico torna-se imprescindível, uma vez que, no canal de avisos, os decretos acabam sendo inseridos entre diversas outras comunicações, dificultando sua localização e consulta posterior.

> Neste canal, portanto, serão postados exclusivamente os decretos vigentes e arquivados, assegurando fácil acesso, transparência e controle documental por parte de todos os membros da Instituição.

__18 de julho de 2025.__

Cordialmente,
Ex-Juiz brab_tb,
Superior Tribunal Militar.`,
        color: EMBED_COLOR,
        image: {
          url: BANNER_URL,
        },
      },
    ],
  });
}

publishDecretos()
  .then(() => console.log('Aviso de decretos publicado com sucesso.'))
  .catch((error) => {
    console.error('Falha ao publicar o aviso de decretos:');
    console.error(error);
    process.exitCode = 1;
  });
