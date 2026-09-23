const WEBHOOK_URL = process.env.WEBHOOK_URL;

const BANNER_URL =
  'https://github.com/iagoalima/webhooks-discord/blob/3d9fffc00f845361c1bf46a9b852bf80eff67b98/webhooks/banner%20stm%20-%20diretrizes.png';

const EMBED_COLOR = 0x1e3748;;
const REQUEST_DELAY = 700;
const INVISIBLE = '\u200B';

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function sendWebhook(payload) {
  await sleep(REQUEST_DELAY);

  while (true) {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
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
      'Defina a variável de ambiente WEBHOOK_URL antes de executar.',
    );
  }

  // Título + banner
  // O conteúdo invisível cria espaço entre o embed e o próximo bloco.
  await sendWebhook({
    embeds: [
      {
        title: 'Canal Oficial de Diretrizes — Superior Tribunal Militar',
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