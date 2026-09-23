const WEBHOOK_URL = process.env.WEBHOOK_URL;

const BANNER_URL =
  'https://raw.githubusercontent.com/iagoalima/webhooks-discord/main/webhooks/banner%20stm%20-%20diretrizes.png';

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

async function publishDiretrizes() {
  if (!WEBHOOK_URL) {
    throw new Error(
      'Defina a variável de ambiente WEBHOOK_URL antes de executar.',
    );
  }

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

publishDiretrizes()
  .then(() => console.log('Diretrizes publicadas com sucesso.'))
  .catch((error) => {
    console.error('Falha ao publicar as diretrizes:');
    console.error(error);
    process.exitCode = 1;
  });
