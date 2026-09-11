const WEBHOOK_URL = process.env.ESFAM_WEBHOOK_URL;

const ESFAM_EMOJI = '<:esfam:1547984245543141497>';
const SEPARATOR = '**───────────────── ❖ ─────────────────**';
const INVISIBLE = '\u200B';

const days = [
  {
    title: 'DIA ZERO',
    content: `> - * **Boas-vindas!**
> - Orientações, diretrizes e regras
> - Primeira Redação:
- **"__O que espera aprender na EsFAM e quais experiências de vida o traz aqui.__"**`,
  },
  {
    title: 'DIA UM',
    content: `**\`\`[Saudações diárias]\`\`**
> - Primeira Aula:
 - **"__Atendimento de Tíquetes de Revogação.__"**
-# Prazo final para entrega da Redação, antes da aula.`,
  },
  {
    title: 'DIA DOIS',
    content: `**\`\`[Saudações diárias]\`\`**
> - Aula prática — Simulado de Revogação
> - Aplicação das Entrevistas`,
  },
  {
    title: 'DIA TRÊS',
    content: `**\`\`[Saudações diárias]\`\`**
> - Anúncio da Segunda Aula
> - Aula prática — Simulado de Revogação
> - Aplicação das Entrevistas`,
  },
  {
    title: 'DIA QUATRO',
    content: `**\`\`[Saudações diárias]\`\`**
> - Segunda Redação — Tema a decidir.
> - Aplicação da Segunda Aula:
 - **"__Leis do Exército e Direito Penal.__"**`,
  },
  {
    title: 'DIA CINCO',
    content: `**\`\`[Saudações diárias]\`\`**
> - Anúncio da Terceira Aula
> - Aplicação do trabalho sobre a Legislação.`,
  },
  {
    title: 'DIA SEIS',
    content: `**\`\`[Saudações diárias]\`\`**
> - Terceira Redação (simples)
> - Aplicação da Terceira Aula:
- **"__Cuidados e Diretrizes do Superior Tribunal Militar (STM).__"**`,
  },
  {
    title: 'DIA SETE',
    content: `**\`\`[Saudações diárias]\`\`**
> - Anúncio do Formulário Final
> - Aplicação de Redação Final (completa)
-# Prazo final para entrega da Legislação criada pelo Aluno.`,
  },
  {
    title: 'DIA OITO',
    content: `**\`\`[Saudações diárias]\`\`**
> - Aplicação do Formulário Final
> - * **Anúncio dos Aprovados!**`,
  },
  {
    title: 'DIA NOVE',
    content: `**\`\`[Saudações diárias]\`\`**
> - Avaliação de Desempenho
> - * **Anúncio dos Aprovados!**
> - Reunião com os aprovados para introdução ao Tribunal.`,
  },
];

async function sendWebhook(payload) {
  const response = await fetch(WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Discord retornou ${response.status}: ${body}`);
  }

  return response;
}

async function publishEsfam() {
  if (!WEBHOOK_URL) {
    throw new Error('Defina a variável de ambiente ESFAM_WEBHOOK_URL antes de executar.');
  }

  // Mensagem inicial.
  await sendWebhook({
    content: `**CRONOGRAMA — EsFAM**\n-# ESCOLA DE FORMAÇÃO E APERFEIÇOAMENTO DE MAGISTRADOS\n\nO cronograma da **EsFAM** tem como principal objetivo assegurar a progressão contínua das atividades e aulas, garantindo que o processo de formação seja concluído dentro do prazo estipulado.\n\nDessa forma, busca-se evitar que a inoperância ou a ausência de andamento nas atividades impeça **Alunos aptos e competentes** de contribuírem efetivamente para as atividades do **Superior Tribunal Militar**.\n\nSeguem abaixo as atividades que deverão ser realizadas pelos **Alunos ao longo dos dias de formação**:\n\n${SEPARATOR}`,
  });

  // Cada dia é composto por: embed com título + mensagem de conteúdo + espaço invisível.
  for (const day of days) {
    await sendWebhook({
      embeds: [
        {
          title: `[${ESFAM_EMOJI}] ${day.title}`,
        },
      ],
    });

    await sendWebhook({ content: day.content });
    await sendWebhook({ content: INVISIBLE });
  }

  // Rodapé final.
  await sendWebhook({
    content: `${SEPARATOR}\n\n**SUPERIOR TRIBUNAL MILITAR**\n-# Cronograma EsFAM\n\n-# Desenvolvido e Implementado por: ClaudirDoPneu e Joca_gl3`,
  });
}

publishEsfam()
  .then(() => console.log('Cronograma da EsFAM publicado com sucesso.'))
  .catch((error) => {
    console.error('Falha ao publicar o cronograma da EsFAM:');
    console.error(error);
    process.exitCode = 1;
  });
