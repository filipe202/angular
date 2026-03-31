import { Contract, ContractStatus, ContractType } from '../models/contract.model';
import { Role, User } from '../models/user.model';

export const MOCK_USERS: User[] = [
  { id: 'u1', name: 'João Silva', email: 'joao.silva@empresa.pt', role: Role.CREATOR, department: 'Compras' },
  { id: 'u2', name: 'Maria Santos', email: 'maria.santos@empresa.pt', role: Role.MANAGER, department: 'Jurídico' },
  { id: 'u3', name: 'Pedro Nunes', email: 'pedro.nunes@empresa.pt', role: Role.SIGNER, department: 'Direção' },
  { id: 'u4', name: 'Ana Costa', email: 'ana.costa@empresa.pt', role: Role.CREATOR, department: 'Marketing' },
  { id: 'u5', name: 'Carlos Ferreira', email: 'carlos.ferreira@empresa.pt', role: Role.MANAGER, department: 'Financeiro' },
];

const now = new Date();
const daysAgo = (days: number) => new Date(now.getTime() - days * 24 * 60 * 60 * 1000);
const daysFromNow = (days: number) => new Date(now.getTime() + days * 24 * 60 * 60 * 1000);

export const MOCK_CONTRACTS: Contract[] = [
  {
    id: 'c1', title: 'Contrato Fornecimento ABC Lda', description: 'Fornecimento de material de escritório para o ano 2026',
    type: ContractType.SUPPLY, status: ContractStatus.PENDING_APPROVAL, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(2), updatedAt: daysAgo(1), parties: [
      { id: 'p1', name: 'ABC Lda', role: 'Fornecedor', email: 'abc@email.pt', taxId: '509123456' },
      { id: 'p2', name: 'Nossa Empresa', role: 'Cliente', email: 'info@nos.pt', taxId: '501234567' }
    ],
    startDate: daysFromNow(30), endDate: daysFromNow(395), autoRenew: true,
    value: 45000, currency: 'EUR', paymentTerms: '30 dias',
    documents: [
      { id: 'd1', name: 'Contrato_ABC.pdf', type: 'application/pdf', size: 2100000, uploadedAt: daysAgo(2), url: '#' },
      { id: 'd2', name: 'Anexo_Precos.xlsx', type: 'application/xlsx', size: 450000, uploadedAt: daysAgo(2), url: '#' }
    ],
    department: 'Compras', tags: ['fornecimento', 'material'], edoclinkRef: 'EDL-2026-001'
  },
  {
    id: 'c2', title: 'NDA - TechPartner Solutions', description: 'Acordo de confidencialidade para projeto de transformação digital',
    type: ContractType.NDA, status: ContractStatus.PENDING_APPROVAL, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(5), updatedAt: daysAgo(3), parties: [
      { id: 'p3', name: 'TechPartner Solutions', role: 'Parceiro', email: 'info@techpartner.pt', taxId: '510987654' },
      { id: 'p4', name: 'Nossa Empresa', role: 'Cliente', email: 'info@nos.pt', taxId: '501234567' }
    ],
    startDate: daysFromNow(10), endDate: daysFromNow(375), autoRenew: false,
    value: 0, currency: 'EUR',
    documents: [{ id: 'd3', name: 'NDA_TechPartner.pdf', type: 'application/pdf', size: 890000, uploadedAt: daysAgo(5), url: '#' }],
    department: 'IT', tags: ['nda', 'digital'], edoclinkRef: 'EDL-2026-002'
  },
  {
    id: 'c3', title: 'Serviço Consultoria DataTech', description: 'Consultoria especializada em análise de dados e BI',
    type: ContractType.CONSULTING, status: ContractStatus.DRAFT, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(1), updatedAt: daysAgo(1), parties: [
      { id: 'p5', name: 'DataTech Consulting', role: 'Consultor', email: 'info@datatech.pt', taxId: '511222333' }
    ],
    startDate: daysFromNow(60), endDate: daysFromNow(425), autoRenew: true,
    value: 120000, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [], department: 'IT', tags: ['consultoria', 'dados'], edoclinkRef: 'EDL-2026-003'
  },
  {
    id: 'c4', title: 'Parceria Estratégica XYZ', description: 'Parceria para desenvolvimento de soluções conjuntas',
    type: ContractType.PARTNERSHIP, status: ContractStatus.IN_REVIEW, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(10), updatedAt: daysAgo(3), parties: [
      { id: 'p6', name: 'XYZ International', role: 'Parceiro', email: 'biz@xyz.com', taxId: '512333444' },
      { id: 'p7', name: 'Nossa Empresa', role: 'Parceiro', email: 'info@nos.pt', taxId: '501234567' }
    ],
    startDate: daysFromNow(15), endDate: daysFromNow(380), autoRenew: false,
    value: 80000, currency: 'EUR', paymentTerms: 'Trimestral',
    documents: [
      { id: 'd4', name: 'Parceria_XYZ.pdf', type: 'application/pdf', size: 1500000, uploadedAt: daysAgo(10), url: '#' },
      { id: 'd5', name: 'Plano_Negocio.pdf', type: 'application/pdf', size: 3200000, uploadedAt: daysAgo(10), url: '#' }
    ],
    department: 'Comercial', tags: ['parceria', 'internacional'], edoclinkRef: 'EDL-2026-004'
  },
  {
    id: 'c5', title: 'Manutenção Equipamentos Industriais', description: 'Contrato anual de manutenção preventiva e corretiva',
    type: ContractType.SERVICE, status: ContractStatus.ACTIVE, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(120), updatedAt: daysAgo(90), parties: [
      { id: 'p8', name: 'ManutPro Lda', role: 'Prestador', email: 'geral@manutpro.pt', taxId: '513444555' }
    ],
    startDate: daysAgo(90), endDate: daysFromNow(5), autoRenew: true,
    value: 15000, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [{ id: 'd6', name: 'Contrato_Manutencao.pdf', type: 'application/pdf', size: 1800000, uploadedAt: daysAgo(120), url: '#' }],
    department: 'Operações', tags: ['manutenção', 'equipamentos'], edoclinkRef: 'EDL-2025-045'
  },
  {
    id: 'c6', title: 'NDA Fornecedor Beta', description: 'Acordo de confidencialidade com fornecedor de componentes',
    type: ContractType.NDA, status: ContractStatus.ACTIVE, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(60), updatedAt: daysAgo(55), parties: [
      { id: 'p9', name: 'Beta Components', role: 'Fornecedor', email: 'sales@beta.pt', taxId: '514555666' }
    ],
    startDate: daysAgo(55), endDate: daysFromNow(310), autoRenew: false,
    value: 0, currency: 'EUR',
    documents: [{ id: 'd7', name: 'NDA_Beta.pdf', type: 'application/pdf', size: 670000, uploadedAt: daysAgo(60), url: '#' }],
    department: 'Compras', tags: ['nda'], edoclinkRef: 'EDL-2025-050'
  },
  {
    id: 'c7', title: 'Serviço Limpeza Corporativa', description: 'Serviço de limpeza para sede e filiais',
    type: ContractType.SERVICE, status: ContractStatus.PENDING_APPROVAL, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(3), updatedAt: daysAgo(2), parties: [
      { id: 'p10', name: 'LimpaMax Lda', role: 'Prestador', email: 'comercial@limpamax.pt', taxId: '515666777' }
    ],
    startDate: daysFromNow(15), endDate: daysFromNow(380), autoRenew: true,
    value: 8500, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [{ id: 'd8', name: 'Proposta_Limpeza.pdf', type: 'application/pdf', size: 920000, uploadedAt: daysAgo(3), url: '#' }],
    department: 'Facilities', tags: ['limpeza', 'serviços'], edoclinkRef: 'EDL-2026-005'
  },
  {
    id: 'c8', title: 'Contrato Arrendamento Armazém Norte', description: 'Arrendamento de espaço de armazém na zona norte',
    type: ContractType.LEASE, status: ContractStatus.PENDING_SIGNATURE, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(20), updatedAt: daysAgo(5), parties: [
      { id: 'p11', name: 'Imobiliária Norte SA', role: 'Senhorio', email: 'contratos@imonorte.pt', taxId: '516777888' }
    ],
    startDate: daysFromNow(30), endDate: daysFromNow(1125), autoRenew: false,
    value: 36000, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [
      { id: 'd9', name: 'Contrato_Armazem.pdf', type: 'application/pdf', size: 2500000, uploadedAt: daysAgo(20), url: '#' },
      { id: 'd10', name: 'Plantas_Armazem.pdf', type: 'application/pdf', size: 5100000, uploadedAt: daysAgo(20), url: '#' }
    ],
    department: 'Logística', tags: ['arrendamento', 'armazém'], edoclinkRef: 'EDL-2026-006'
  },
  {
    id: 'c9', title: 'Consultoria Jurídica Especializada', description: 'Assessoria jurídica para compliance RGPD',
    type: ContractType.CONSULTING, status: ContractStatus.SIGNED, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(45), updatedAt: daysAgo(15), parties: [
      { id: 'p12', name: 'LegalPro Advogados', role: 'Consultor', email: 'escritorio@legalpro.pt', taxId: '517888999' }
    ],
    startDate: daysAgo(15), endDate: daysFromNow(350), autoRenew: false,
    value: 25000, currency: 'EUR', paymentTerms: 'Trimestral',
    documents: [{ id: 'd11', name: 'Contrato_LegalPro.pdf', type: 'application/pdf', size: 1900000, uploadedAt: daysAgo(45), url: '#' }],
    department: 'Jurídico', tags: ['consultoria', 'rgpd', 'compliance'], edoclinkRef: 'EDL-2025-055'
  },
  {
    id: 'c10', title: 'Fornecimento Licenças Software', description: 'Licenciamento anual de software empresarial Microsoft',
    type: ContractType.SUPPLY, status: ContractStatus.ACTIVE, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(90), updatedAt: daysAgo(85), parties: [
      { id: 'p13', name: 'SoftDistri Lda', role: 'Distribuidor', email: 'enterprise@softdistri.pt', taxId: '518999000' }
    ],
    startDate: daysAgo(85), endDate: daysFromNow(12), autoRenew: true,
    value: 55000, currency: 'EUR', paymentTerms: 'Anual',
    documents: [{ id: 'd12', name: 'Licencas_Microsoft.pdf', type: 'application/pdf', size: 1200000, uploadedAt: daysAgo(90), url: '#' }],
    department: 'IT', tags: ['software', 'licenças'], edoclinkRef: 'EDL-2025-030'
  },
  {
    id: 'c11', title: 'Serviço Segurança Patrimonial', description: 'Serviço de segurança 24h para instalações',
    type: ContractType.SERVICE, status: ContractStatus.ACTIVE, createdBy: MOCK_USERS[0],
    createdAt: daysAgo(200), updatedAt: daysAgo(180), parties: [
      { id: 'p14', name: 'SecurPro SA', role: 'Prestador', email: 'comercial@securpro.pt', taxId: '519000111' }
    ],
    startDate: daysAgo(180), endDate: daysFromNow(28), autoRenew: true,
    value: 42000, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [{ id: 'd13', name: 'Contrato_Seguranca.pdf', type: 'application/pdf', size: 2300000, uploadedAt: daysAgo(200), url: '#' }],
    department: 'Facilities', tags: ['segurança'], edoclinkRef: 'EDL-2025-010'
  },
  {
    id: 'c12', title: 'Contrato Marketing Digital', description: 'Gestão de redes sociais e campanhas digitais',
    type: ContractType.SERVICE, status: ContractStatus.REJECTED, createdBy: MOCK_USERS[3],
    createdAt: daysAgo(8), updatedAt: daysAgo(6), parties: [
      { id: 'p15', name: 'DigiMarketing Lda', role: 'Agência', email: 'hello@digimarketing.pt', taxId: '520111222' }
    ],
    startDate: daysFromNow(20), endDate: daysFromNow(385), autoRenew: false,
    value: 18000, currency: 'EUR', paymentTerms: 'Mensal',
    documents: [{ id: 'd14', name: 'Proposta_Marketing.pdf', type: 'application/pdf', size: 3400000, uploadedAt: daysAgo(8), url: '#' }],
    department: 'Marketing', tags: ['marketing', 'digital'],
    rejectionReason: 'Orçamento excede o limite aprovado para este tipo de serviço. Renegociar valores.',
    edoclinkRef: 'EDL-2026-007'
  }
];
