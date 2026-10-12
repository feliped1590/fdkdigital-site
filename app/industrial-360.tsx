import { company } from "./company";
import { ExperienceEnhancer } from "./experience";
import { SiteFooter } from "./components/SiteFooter";
import { SiteHeader } from "./components/SiteHeader";

/** Mesmo número e padrão de integração do CTA da Home. */
const WHATSAPP = `${company.whatsapp}?text=${encodeURIComponent(
  "Olá! Conheci a Industrial 360 pelo site da FDK Digital e gostaria de saber mais sobre a solução.",
)}`;

const problems = [
  [
    "01",
    "O processo comercial vive fora do sistema",
    "Propostas em planilha, pedidos por e-mail e histórico na memória de quem atendeu.",
  ],
  [
    "02",
    "O ERP não conversa com o resto",
    "Cadastros, estoque e faturamento existem, mas cada área mantém sua própria versão da verdade.",
  ],
  [
    "03",
    "Reentrada manual de dados",
    "A mesma informação é digitada em dois ou três lugares, e o erro só aparece no fim da cadeia.",
  ],
  [
    "04",
    "Falta de visão do funil industrial",
    "Sem leitura clara de oportunidades, prazos e capacidade, a priorização vira intuição.",
  ],
  [
    "05",
    "Conhecimento preso em pessoas",
    "Quando alguém sai de férias, o processo trava — porque o contexto nunca foi registrado.",
  ],
  [
    "06",
    "Indicadores que chegam tarde",
    "O relatório fecha no mês seguinte, quando a decisão já precisou ser tomada.",
  ],
];

type Linha = {
  tag: string;
  name: string;
  summary: string;
  scope: string[];
  /** Opcional: só o FDK Sales precisa distinguir-se do serviço já entregue. */
  nota?: string;
};

const lines: Linha[] = [
  {
    tag: "01 / SALES",
    name: "FDK Sales",
    summary:
      "Organização do processo comercial em um fluxo único: do primeiro contato ao pedido colocado.",
    scope: ["Clientes e contatos", "Oportunidades", "Propostas", "Pedidos"],
    // Distingue o serviço que a FDK já entrega hoje do módulo em construção.
    // Sem esta nota, quem lê a Home e esta página conclui que a plataforma já
    // faz CRM com WhatsApp.
    nota: "A FDK já desenvolve soluções personalizadas de CRM e integração com WhatsApp Business. O FDK Sales é um módulo em desenvolvimento dentro da Industrial 360, concebido a partir dessa experiência para oferecer uma solução comercial integrada ao ecossistema industrial.",
  },
  {
    tag: "02 / CONNECT",
    name: "FDK Connect",
    summary:
      "Camada de integração com o que a empresa já usa, para que a plataforma some em vez de substituir.",
    scope: ["Integração com ERP", "APIs e webhooks", "Sincronização de cadastros", "Sistemas legados"],
  },
  {
    tag: "03 / INTELLIGENCE",
    name: "FDK Intelligence",
    summary:
      "Leitura da operação para apoio à gestão, com indicadores construídos a partir do processo real.",
    scope: ["Indicadores operacionais", "Análises comerciais", "Acompanhamento de metas", "Visão de carteira"],
  },
  {
    tag: "04 / AI",
    name: "FDK AI",
    summary:
      "Inteligência artificial aplicada onde ela melhora a decisão — não como vitrine tecnológica.",
    scope: ["Copilotos de atendimento", "Automações inteligentes", "Extração de documentos", "Apoio à decisão"],
  },
];

const benefits = [
  [
    "Um lugar só para o comercial",
    "A expectativa é que proposta, pedido e histórico deixem de viver em arquivos paralelos.",
  ],
  [
    "Menos reentrada de dados",
    "Com a integração ao ERP, a informação deve ser registrada uma vez e reaproveitada nas demais etapas.",
  ],
  [
    "Decisão com dado mais próximo do agora",
    "Indicadores construídos sobre o processo, em vez de consolidações manuais no fechamento do mês.",
  ],
  [
    "Processo que não depende de memória",
    "O contexto fica registrado no fluxo, e não apenas com quem atendeu o cliente.",
  ],
  [
    "Arquitetura modular",
    "A plataforma é concebida em módulos. Como eles serão combinados em cada empresa é parte do que estamos definindo.",
  ],
  [
    "Nasce da prática, não da prancheta",
    "A plataforma parte do método que aplicamos em transformação de processos, não de uma suposição de mercado.",
  ],
];

export default function Industrial360() {
  return (
    <main>
      <ExperienceEnhancer />
      <SiteHeader currentPath="/industrial-360" />
      <section className="platform-hero" id="plataforma">
        <div className="hero-grid" aria-hidden="true" />
        <div className="hero-glow" aria-hidden="true" />
        <div className="platform-hero-copy">
          <p className="stage-badge">
            <i /> Plataforma em desenvolvimento
          </p>
          <h1>
            FDK <span>Industrial 360</span>
          </h1>
          <p className="platform-lead">
            A plataforma SaaS modular que estamos construindo para a indústria que precisa organizar o
            processo comercial e integrar seus sistemas.
          </p>
          <div className="stage-note">
            <strong>Esta página apresenta a visão e os módulos planejados da plataforma.</strong> A FDK
            Industrial 360 está em desenvolvimento e ainda não é um produto disponível para contratação. As
            funcionalidades descritas representam o escopo que estamos construindo — não recursos já
            homologados ou implantados comercialmente.
          </div>
        </div>
      </section>

      <section className="platform-problems chapter" id="problemas">
        <div className="chapter-heading reveal">
          <p className="chapter-number">01 — Por que estamos construindo</p>
          <h2>
            Os problemas que a plataforma
            <br />
            <span>pretende resolver.</span>
          </h2>
        </div>
        <div className="problem-list">
          {problems.map(([n, title, text]) => (
            <article className="reveal" key={n}>
              <span>{n}</span>
              <div>
                <h3>{title}</h3>
                <p>{text}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-lines chapter" id="linhas">
        <div className="applications-head reveal">
          <div>
            <p className="chapter-number">02 — Arquitetura modular</p>
            <h2>
              Quatro linhas,
              <br />
              <span>um mesmo processo.</span>
            </h2>
          </div>
          <p>
            Cada linha cobre uma parte da operação industrial. Todas estão em desenvolvimento, em estágios
            diferentes de maturidade.
          </p>
        </div>
        <div className="line-grid">
          {lines.map((line) => (
            <article className="line-card reveal" key={line.name}>
              <span>{line.tag}</span>
              <h3>{line.name}</h3>
              <p>{line.summary}</p>
              <ul>
                {line.scope.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              {line.nota ? <p className="line-note">{line.nota}</p> : null}
              <b>Escopo planejado</b>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-benefits chapter" id="beneficios">
        <div className="chapter-heading reveal">
          <p className="chapter-number">03 — Resultados esperados</p>
          <h2>
            O que a plataforma
            <br />
            <span>pretende entregar.</span>
          </h2>
        </div>
        <div className="benefit-grid">
          {benefits.map(([title, text]) => (
            <article className="reveal" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="platform-cta chapter" id="contato">
        <p className="chapter-number reveal">04 — Participe da construção</p>
        <div className="platform-cta-grid">
          <h2 className="reveal">
            Quer conhecer o projeto
            <br />
            <span>de perto?</span>
          </h2>
          <div className="platform-cta-action reveal">
            <p>
              Se a sua indústria tem esse desafio e quer acompanhar a construção da plataforma de perto,
              queremos conversar. A conversa começa pelo seu processo, não pelo produto.
            </p>
            <a
              className="platform-button"
              href={WHATSAPP}
              target="_blank"
              rel="noreferrer"
              aria-label="Conversar sobre a Industrial 360 pelo WhatsApp"
            >
              Conversar sobre a Industrial 360 <span>↗︎</span>
            </a>
            <a
              className="platform-secondary"
              href={`mailto:${company.email}?subject=FDK%20Industrial%20360`}
            >
              Prefiro escrever para {company.email}
            </a>
            <small>Sem compromisso · conversa técnica · plataforma em desenvolvimento</small>
          </div>
        </div>
      </section>
      <SiteFooter />
    </main>
  );
}
