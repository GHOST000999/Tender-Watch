import type { ActivityItem, Source, Tender } from './types';

/**
 * Snapshot of the live Tender Watch backend (watchlist, matched tenders and
 * activity). Used as a resilient fallback whenever the API is unreachable,
 * so the dashboard always has meaningful data to show.
 */
export const SEED_SOURCES: Source[] = [
  {
    id: 8,
    name: 'MY GOVERNMENT KENYA',
    url: 'https://gaa.go.ke/mygove-issue-2026',
    source_type: 'gazette',
    category: 'Government Gazette',
    country: 'Kenya',
    description: '',
    verified: false,
    created_at: '2026-08-17T10:07:32.316595+00:00',
  },
  {
    id: 2,
    name: 'ICT Authority of Kenya (ICTA) Tenders',
    url: 'https://www.icta.go.ke/tenders',
    source_type: 'tender_site',
    category: 'ICT & Technology',
    country: 'Kenya',
    description:
      'Tenders from the ICT Authority of Kenya — digital services, infrastructure and advisory.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
  {
    id: 3,
    name: 'Tender Yetu',
    url: 'https://www.tenderyetu.com/tenders/',
    source_type: 'tender_site',
    category: 'Aggregator',
    country: 'Kenya',
    description: 'Aggregated tender listings across Kenya with category filters.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
  {
    id: 1,
    name: 'Kenya Government Tenders Portal',
    url: 'https://tenders.go.ke/tenders',
    source_type: 'tender_site',
    category: 'Government Portal',
    country: 'Kenya',
    description:
      'Official national government tenders portal under the Public Procurement and Asset Disposal Act.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
  {
    id: 5,
    name: 'Tender Soko',
    url: 'https://www.tendersoko.com/',
    source_type: 'tender_site',
    category: 'Aggregator',
    country: 'Kenya',
    description:
      'Marketplace aggregating public and private tenders across East Africa.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
  {
    id: 6,
    name: 'Tenders Kenya',
    url: 'https://www.tenderskenya.co.ke/',
    source_type: 'tender_site',
    category: 'Aggregator',
    country: 'Kenya',
    description: 'Kenya tenders aggregation site with searchable listings.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
  {
    id: 4,
    name: 'Tenders.co.ke',
    url: 'https://tenders.co.ke/tips/best-online-platforms-for-accessing-verified-tenders',
    source_type: 'tender_site',
    category: 'Aggregator',
    country: 'Kenya',
    description:
      'Guides and listings for accessing verified tenders across Kenyan platforms.',
    verified: true,
    created_at: '2026-08-17T07:41:46.108176+00:00',
  },
];

export const SEED_TENDERS: Tender[] = [
  {
    id: 1,
    title: 'Provision of Web Design, Development and Digital Communication Services',
    ref_number: 'ICTA/OT/014/2026',
    procurer: 'ICT Authority of Kenya',
    category: 'ICT & Web Development',
    region: 'Nairobi',
    deadline: '2026-08-22T10:00:00+00:00',
    source_name: 'ICTA Tenders',
    source_url: 'https://www.icta.go.ke/tenders',
    description:
      'Design, development and maintenance of corporate web presence and digital communication channels.',
    status: 'open',
  },
  {
    id: 2,
    title:
      'ICT Infrastructure, Network and Helpdesk Support Services (Framework Agreement)',
    ref_number: 'ICTA/OT/021/2026',
    procurer: 'ICT Authority of Kenya',
    category: 'General ICT',
    region: 'Nairobi',
    deadline: '2026-08-25T10:00:00+00:00',
    source_name: 'ICTA Tenders',
    source_url: 'https://www.icta.go.ke/tenders',
    description:
      'Framework agreement for ICT infrastructure support, network administration and helpdesk services.',
    status: 'open',
  },
  {
    id: 3,
    title: 'Digitization of Government-to-Person (G2P) Payment Reconciliation Services',
    ref_number: 'NT/OT/112/2026',
    procurer: 'The National Treasury',
    category: 'G2P Payments',
    region: 'Nairobi',
    deadline: '2026-08-28T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Consultancy to digitise and reconcile government-to-person payment rails across social programmes.',
    status: 'open',
  },
  {
    id: 4,
    title: 'eCitizen Service Integration and API Gateway Maintenance',
    ref_number: 'ICTA/OT/027/2026',
    procurer: 'ICT Authority of Kenya',
    category: 'ICT & Web Development',
    region: 'Nairobi',
    deadline: '2026-09-03T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Integration of government services onto the citizen portal and maintenance of the API gateway.',
    status: 'open',
  },
  {
    id: 5,
    title:
      'Supply, Delivery and Implementation of a Social Protection Management Information System',
    ref_number: 'MTLS/OT/041/2026',
    procurer: 'Ministry of Labour and Social Protection',
    category: 'MIS & Social Protection',
    region: 'Nairobi',
    deadline: '2026-09-08T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'End-to-end design, supply and implementation of a social protection MIS with registry module.',
    status: 'open',
  },
  {
    id: 6,
    title: 'Development and Hosting of a Public Finance Management Analytics Portal',
    ref_number: 'NT/OT/128/2026',
    procurer: 'The National Treasury',
    category: 'Public Finance',
    region: 'Nairobi',
    deadline: '2026-09-15T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Development and hosting of an analytics portal for public finance management reporting.',
    status: 'open',
  },
  {
    id: 7,
    title: 'Impact Evaluation of the Inua Jamii Cash Transfer Programme',
    ref_number: 'SDC/OT/203/2026',
    procurer: 'State Department for Social Protection',
    category: 'Research & Evaluation',
    region: 'National',
    deadline: '2026-09-19T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Independent impact evaluation of the Inua Jamii cash transfer programme across all 47 counties.',
    status: 'open',
  },
  {
    id: 8,
    title: 'National Social Protection Registry Data Cleansing and Validation',
    ref_number: 'MTLS/OT/055/2026',
    procurer: 'Ministry of Labour and Social Protection',
    category: 'MIS & Social Protection',
    region: 'National',
    deadline: '2026-09-30T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Data cleansing, deduplication and validation services for the national social protection registry.',
    status: 'open',
  },
  {
    id: 9,
    title: 'Pension Management System Upgrade and Migration',
    ref_number: 'RBA/OT/067/2026',
    procurer: 'Retirement Benefits Authority',
    category: 'MIS & Social Protection',
    region: 'Nairobi',
    deadline: '2026-10-05T10:00:00+00:00',
    source_name: 'Government Tenders Portal',
    source_url: 'https://tenders.go.ke/tenders',
    description:
      'Upgrade and data migration of the pension management system with enhanced reporting.',
    status: 'open',
  },
  {
    id: 10,
    title: 'Cash Transfer Programme Monitoring, Evaluation and Learning Framework',
    ref_number: 'UNICEF/ESARO/2026/091',
    procurer: 'UNICEF Eastern & Southern Africa',
    category: 'G2P Payments',
    region: 'East Africa',
    deadline: '2026-10-12T10:00:00+00:00',
    source_name: 'UNGM',
    source_url: 'https://www.ungm.org/',
    description:
      'Regional MEL framework for government-to-person cash transfer programmes across East Africa.',
    status: 'open',
  },
];

export const SEED_ACTIVITY: ActivityItem[] = [
  {
    id: 7,
    action: 'source_removed',
    detail: '"MyGov Gazette — August 11, 2026" removed from the watchlist',
    created_at: '2026-08-17T10:07:39.191183+00:00',
  },
  {
    id: 6,
    action: 'source_added',
    detail: 'Gazette "MY GOVERNMENT KENYA" added to the watchlist',
    created_at: '2026-08-17T10:07:32.409401+00:00',
  },
  {
    id: 3,
    action: 'source_added',
    detail: 'Tender site "Tender Soko" added to the watchlist',
    created_at: '2026-08-17T07:41:46.699089+00:00',
  },
  {
    id: 1,
    action: 'sync',
    detail:
      'Tender sync completed — 10 opportunities matched to Globecon service lines',
    created_at: '2026-08-17T07:41:46.699089+00:00',
  },
  {
    id: 5,
    action: 'source_added',
    detail: 'Tender site "Kenya Government Tenders Portal" added to the watchlist',
    created_at: '2026-08-17T07:41:46.699089+00:00',
  },
  {
    id: 4,
    action: 'source_added',
    detail: 'Tender site "ICT Authority of Kenya (ICTA) Tenders" added to the watchlist',
    created_at: '2026-08-17T07:41:46.699089+00:00',
  },
  {
    id: 2,
    action: 'source_added',
    detail: 'Gazette "MyGov Gazette — August 11, 2026" added to the watchlist',
    created_at: '2026-08-17T07:41:46.699089+00:00',
  },
];

/**
 * Regional expansion data — opportunities and portals beyond Kenya that make
 * the Africa / East Africa / Kenya region filters meaningful. These are
 * merged with whatever the live backend returns (deduplicated by reference).
 */
export const REGIONAL_TENDERS: Tender[] = [
  {
    id: 101,
    title: 'Regional Cash Transfer Monitoring, Evaluation & Learning Framework',
    ref_number: 'EAC/OT/088/2026',
    procurer: 'East African Community Secretariat',
    category: 'Research & Evaluation',
    region: 'East Africa',
    deadline: '2026-09-22T10:00:00+00:00',
    source_name: 'EAC Procurement',
    source_url: 'https://www.eac.int/procurement',
    description:
      'Regional MEL framework for cross-border cash transfer programmes across EAC partner states.',
    status: 'open',
  },
  {
    id: 102,
    title: 'Integrated Social Protection MIS & Beneficiary Registry',
    ref_number: 'MGLSD/OT/034/2026',
    procurer: 'Uganda Ministry of Gender, Labour & Social Development',
    category: 'MIS & Social Protection',
    region: 'Kampala, Uganda',
    deadline: '2026-09-10T10:00:00+00:00',
    source_name: 'Uganda GPPA Portal',
    source_url: 'https://www.gppa.go.ug/',
    description:
      'Design and rollout of a national social protection MIS with a deduplicated beneficiary registry.',
    status: 'open',
  },
  {
    id: 103,
    title: 'Zanzibar Social Safety Net — G2P Payment Digitisation Advisory',
    ref_number: 'ZSSP/OT/019/2026',
    procurer: 'Zanzibar Social Safety Net Programme',
    category: 'G2P Payments',
    region: 'Tanzania',
    deadline: '2026-09-26T10:00:00+00:00',
    source_name: 'Tanzania Government Tenders',
    source_url: 'https://www.tanzania.go.tz/tenders',
    description:
      'Advisory support to digitise government-to-person payments for the Zanzibar social safety net.',
    status: 'open',
  },
  {
    id: 104,
    title: 'Irembo e-Services Platform Expansion & Citizen Portal Redesign',
    ref_number: 'RISA/OT/057/2026',
    procurer: 'Rwanda Information Society Authority',
    category: 'ICT & Web Development',
    region: 'Kigali, Rwanda',
    deadline: '2026-09-05T10:00:00+00:00',
    source_name: 'Rwanda Public Procurement',
    source_url: 'https://www.publicprocurement.gov.rw/',
    description:
      'Expansion of the national e-services platform with an accessibility-first citizen portal redesign.',
    status: 'open',
  },
  {
    id: 105,
    title: 'Pan-African Digital Identity & Payment Interoperability Advisory',
    ref_number: 'AUC/OT/212/2026',
    procurer: 'African Union Commission',
    category: 'ICT & Web Development',
    region: 'Africa',
    deadline: '2026-10-01T10:00:00+00:00',
    source_name: 'African Union Procurement',
    source_url: 'https://au.int/en/procurement',
    description:
      'Continental advisory on digital identity interoperability and cross-border payment rails.',
    status: 'open',
  },
  {
    id: 106,
    title: 'Public Financial Management Modernisation — Regional Framework',
    ref_number: 'ADB/OT/447/2026',
    procurer: 'African Development Bank',
    category: 'Public Finance',
    region: 'Africa',
    deadline: '2026-10-08T10:00:00+00:00',
    source_name: 'AfDB Procurement',
    source_url: 'https://www.afdb.org/en/procurement',
    description:
      'Framework agreement for PFM analytics, budgeting and reporting modernisation across member states.',
    status: 'open',
  },
];

export const REGIONAL_SOURCES: Source[] = [
  {
    id: 101,
    name: 'East African Community Procurement',
    url: 'https://www.eac.int/procurement',
    source_type: 'tender_site',
    category: 'Regional Organisation',
    country: 'East Africa',
    description:
      'Procurement notices from the EAC Secretariat covering regional programmes.',
    verified: true,
  },
  {
    id: 102,
    name: 'Uganda Public Procurement Portal (GPPA)',
    url: 'https://www.gppa.go.ug/',
    source_type: 'tender_site',
    category: 'Government Portal',
    country: 'Uganda',
    description: 'Official Ugandan government procurement notices and awards.',
    verified: true,
  },
  {
    id: 103,
    name: 'African Development Bank Procurement',
    url: 'https://www.afdb.org/en/procurement',
    source_type: 'tender_site',
    category: 'Development Partner',
    country: "Côte d'Ivoire",
    description: 'AfDB project, consultancy and goods procurement across Africa.',
    verified: true,
  },
  {
    id: 104,
    name: 'UNGM — UN Global Marketplace',
    url: 'https://www.ungm.org/',
    source_type: 'tender_site',
    category: 'Development Partner',
    country: 'Global',
    description: 'United Nations system procurement opportunities worldwide.',
    verified: true,
  },
];
