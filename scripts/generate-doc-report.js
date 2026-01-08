/**
 * Generate Professional Word Document for NextDeal Project Report
 * Uses docx library to create a comprehensive, formatted document
 */

const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType, WidthType, Table, TableRow, TableCell, BorderStyle, ShadingType, ExternalHyperlink, SectionType, PageBreak } = require('docx');
const fs = require('fs');
const path = require('path');

// Icons using Unicode symbols
const ICONS = {
  check: '✓',
  arrow: '→',
  star: '★',
  info: 'ℹ',
  warning: '⚠',
  security: '🔒',
  rocket: '🚀',
  code: '💻',
  database: '🗄️',
  cloud: '☁',
  network: '🌐',
  shield: '🛡️',
  gear: '⚙️',
  chart: '📊',
  users: '👥',
  car: '🚗',
};

function createDocument() {
  const doc = new Document({
    sections: [
      // Title Page
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'NextDeal',
            heading: HeadingLevel.TITLE,
            alignment: AlignmentType.CENTER,
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: 'NextDeal',
                bold: true,
                size: 64,
                color: '1a5490',
              }),
            ],
          }),
          new Paragraph({
            text: 'Software Project Report',
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
            children: [
              new TextRun({
                text: 'Software Project Report',
                size: 32,
                color: '2d5f8f',
                italics: true,
              }),
            ],
          }),
          new Paragraph({
            text: 'International Standard Format',
            alignment: AlignmentType.CENTER,
            spacing: { after: 600 },
            children: [
              new TextRun({
                text: 'International Standard Format',
                size: 24,
                color: '666666',
              }),
            ],
          }),
          new Paragraph({
            text: '',
            spacing: { after: 800 },
          }),
          new Paragraph({
            text: `Document ID: ND-PR-001`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Version: 1.0`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Status: Final Draft`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Date: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Prepared for: Academic / Professional Submission`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `Prepared by: NextDeal Development Team`,
            alignment: AlignmentType.CENTER,
            spacing: { after: 400 },
          }),
        ],
      },
      // Revision History
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: 'Revision History',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          new Table({
            width: { size: 100, type: WidthType.PERCENTAGE },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Version')],
                    shading: { fill: '1a5490', type: ShadingType.SOLID },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph('Date')],
                    shading: { fill: '1a5490', type: ShadingType.SOLID },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph('Author')],
                    shading: { fill: '1a5490', type: ShadingType.SOLID },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph('Description')],
                    shading: { fill: '1a5490', type: ShadingType.SOLID },
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                ],
              }),
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('1.0')],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph(new Date().toLocaleDateString())],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph('NextDeal Team')],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                  new TableCell({
                    children: [new Paragraph('Initial professional report based on current codebase and backend dependencies')],
                    margins: { top: 100, bottom: 100, left: 100, right: 100 },
                  }),
                ],
              }),
            ],
          }),
          new Paragraph({ text: '', spacing: { after: 400 } }),
        ],
      },
      // Table of Contents
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: 'Table of Contents',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 400 },
          }),
          ...generateTOC(),
          new Paragraph({ text: '', spacing: { after: 400 } }),
        ],
      },
      // Preface
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '1. Preface',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'This report documents the design, implementation, and engineering approach of NextDeal, a modern automotive marketplace and dealership management platform. The document is written in a professional, internationally recognizable format inspired by common software documentation standards such as:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} ISO/IEC/IEEE 12207 (Software Life Cycle Processes)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} ISO/IEC 25010 (Software Product Quality Model)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Common SRS/SDD structure used in IEEE-style documentation`,
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'The document is intended for evaluators, stakeholders, developers, and future maintainers.',
            spacing: { after: 400 },
          }),
        ],
      },
      // Executive Summary
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '2. Executive Summary',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: `NextDeal ${ICONS.car} is an end-to-end automotive ecosystem that connects:`,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} Buyers searching vehicles and services`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Sellers/Dealers listing inventory, generating leads, and managing customers`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Administrators moderating, analyzing, and operating the platform`,
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'The system emphasizes:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Modern web experience (Next.js + TypeScript)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} International readiness (multi-language UI + RTL support)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Real-time engagement (Socket.IO chat)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Marketplace + operations (not only listing cars, but also dealer CRM-like tools)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Introduction
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '3. Introduction',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '3.1 Background',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Automotive platforms are often fragmented: one tool for browsing cars, another for dealer management, another for community or communication. NextDeal aims to unify these needs in one consistent product.',
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '3.2 Problem Statement',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Existing solutions frequently suffer from one or more of the following:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Poor integration between marketplace and dealer operations (leads, CRM, inventory management)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Limited real-time interaction between buyers and dealers`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Weak localization / poor international expansion support`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Admin tooling not designed for growth`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '3.3 Proposed Solution',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'NextDeal provides an integrated platform with:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} A user-facing marketplace (vehicles, rentals, recommended agencies)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} A dealer toolset (inventory management, lead tracking, analytics, messaging)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} A community + chat layer for engagement and trust building`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} An admin panel for governance, subscription/billing, and moderation`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Project Description
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '4. Project Description',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'NextDeal is a web-based automotive marketplace and management platform designed to support:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Vehicle discovery and comparison`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Dealer inventory publishing and lead generation`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} User engagement via community posts and real-time chat`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Administrative control, reporting, and subscription operations`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'The frontend is implemented using Next.js (App Router) with a modular component structure and API-integration layer under src/lib/api/. The platform follows a client-server architecture where the Next.js frontend communicates with an Express.js backend API through REST endpoints and WebSocket connections for real-time features.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Key architectural principles include:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Separation of concerns with clear layering (presentation, routing, integration, utilities)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Reusable component architecture for consistency and maintainability`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Type-safe development with TypeScript throughout the application`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Environment-based configuration for flexible deployment across different environments`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Objectives and Scope
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '5. Objectives and Scope',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '5.1 Objectives',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Provide a high-quality marketplace UI for vehicle browsing and discovery`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Enable dealers to manage listings, customers, leads, and billing`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Provide real-time communication between platform participants`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Support internationalization (multi-language, RTL for Hebrew)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Offer admin capabilities for platform governance and analytics`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '5.2 In Scope',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Web-based frontend application (Next.js)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Backend API integration (REST + Socket.IO)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Authentication (JWT-based) and role-based access`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} Multi-language UI resources and language detection`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Admin panel routes and tooling`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '5.3 Out of Scope (for current release / may be future work)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Native mobile applications (Android/iOS)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Full regulatory certifications (depends on deployment region)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Offline-first PWA features (planned as enhancement)`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '5.4 Assumptions',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Backend API endpoints are available and stable`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Users have modern browsers with JavaScript enabled`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Payment provider configuration exists for production deployments`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Stakeholders and User Roles
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '6. Stakeholders and User Roles',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '6.1 Primary Stakeholders',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} End Users (Buyers/Renters): Browse vehicles, communicate, save favorites, manage profile`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Dealers/Sellers: Upload inventory, handle leads, manage customers, and process sales`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Administrators: Manage users/dealers, subscriptions, moderation, reporting`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Product Owner / Management: Defines roadmap and priorities`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Developers / DevOps: Build, maintain, deploy, monitor`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '6.2 Roles (Role-Based Access)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'The platform follows a role-based approach (e.g., User, Dealer, Admin) in both UI routing (admin routes under src/app/admin/) and backend authorization design. Each role has specific permissions and access levels that control what features and data they can interact with.',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Role Definitions:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} User: Can browse vehicles, create listings (if seller), communicate via chat, participate in community, manage profile`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Dealer: All user permissions plus inventory management, lead tracking, customer management, sales reporting, bulk messaging`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Admin: Full system access including user/dealer management, content moderation, subscription management, system-wide analytics`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // System Overview
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '7. System Overview (Modules & Functional Areas)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'Based on the implemented routes and modules, NextDeal consists of:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '7.1 Public/User Modules',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Home and featured vehicles`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Marketplace browsing and search results`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.star} Hot vehicles and rental vehicles`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.star} Recommended agencies (verified dealers and agencies)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} User profile and account management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} Community posts and engagement`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Real-time chat`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '7.2 Dealer Modules',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Inventory management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Leads and customer tracking with detailed analytics`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Performance monitoring and sales reporting`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} Bulk messaging and email operations`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '7.3 Admin Modules',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Routes under src/app/admin/ indicate administrative functions including:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Dealer management and dealer requests`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} CRM and customer lists management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Analytics and reporting dashboard`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.gear} Subscription and billing management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Sales/sold vehicles reporting`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Technology Stack
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '8. Technology Stack and Tools',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '8.1 Frontend Technology Stack',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...createTechStackTable('Frontend', [
            ['Framework', 'Next.js 15.5.7 (App Router with Turbopack)'],
            ['Language', 'TypeScript + React 18.3.1'],
            ['UI Framework', 'Material-UI v6.4.8 + Tailwind CSS v4'],
            ['State Management', 'Zustand v5.0.3'],
            ['Data Fetching', 'TanStack Query v5.74.3'],
            ['HTTP Client', 'Axios v1.8.4'],
            ['Internationalization', 'i18next v25.0.1 + react-i18next'],
            ['Real-time Communication', 'Socket.IO Client v4.8.1'],
            ['Forms & Validation', 'Formik v2.4.6 + Yup v1.6.1'],
            ['Rich Text Editor', 'CKEditor 5 v41.4.2'],
            ['Charts & Visualization', 'Recharts v2.15.2'],
            ['File Handling', 'React Dropzone v14.3.8'],
            ['Date Handling', 'Moment.js v2.30.1'],
            ['CSV Processing', 'PapaParse v5.5.2'],
          ]),
          new Paragraph({
            text: '8.2 Backend Technology Stack',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          ...createTechStackTable('Backend', [
            ['Runtime', 'Node.js'],
            ['Framework', 'Express.js v5.1.0'],
            ['Language', 'TypeScript v5.9.3'],
            ['Database', 'MongoDB via Mongoose v8.13.2'],
            ['Authentication', 'JWT (jsonwebtoken v9.0.2) + bcrypt'],
            ['Real-time Server', 'Socket.IO v4.8.1'],
            ['File Storage', 'Cloudinary, Google Cloud Storage, Multer'],
            ['Email Service', 'Nodemailer v6.10.1'],
            ['AI Integration', 'OpenAI SDK v5.3.0'],
            ['Google Services', 'Google APIs, Google OAuth'],
            ['Internationalization', 'i18next v25.0.0 (server-side)'],
            ['Validation', 'Yup v1.6.1'],
            ['Logging', 'Morgan v1.10.0'],
          ]),
          new Paragraph({
            text: '8.3 Development and Deployment Tools',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Docker (containerization support)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} ESLint + Prettier (code quality and formatting)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} TypeScript Compiler (type checking and compilation)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Environment-based configuration for multi-environment deployment`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Features Section
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '10. Key Features (Functional)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.1 Marketplace & Discovery',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Vehicle marketplace browsing with advanced filtering and search capabilities including filters for brand, model, price range, year, mileage, fuel type, transmission, and location-based search`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Detailed vehicle listings with high-resolution image galleries, comprehensive specifications, pricing information, and seller contact options`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.star} Hot/trending vehicles section for featured listings with algorithm-driven recommendations based on user preferences, view counts, and engagement metrics`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Rental vehicles marketplace for short-term vehicle rental with availability calendar, pricing per day/week/month, and rental terms management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Comprehensive vehicle detail pages with specifications and media galleries`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.2 Trust & Services Ecosystem',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.star} Recommended agencies (verified dealers/agencies with curated recommendations)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Advanced search with filtering by brand, model, price range, year, and location`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Vehicle comparison and favorites/wishlist functionality`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.3 Community & Engagement',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} Community feed/posts for user-generated content and engagement`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Rich text editing (CKEditor integration) for post creation`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.4 Real-Time Chat',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Socket.IO-based real-time messaging between users and dealers`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} User registration on socket connection for targeted messaging and notifications`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Message history and conversation threads`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Online/offline status indicators`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.5 Authentication & Account Management',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} JWT-based login/session handling with secure token storage`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Role-based routing and access patterns (User, Dealer, Admin)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Password reset and OTP verification flows for secure account recovery`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.6 Dealer Operations',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Inventory management and listing updates with bulk operations including batch status changes, bulk price updates, CSV import/export functionality for efficient inventory management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.car} Vehicle status management: Pending, Available, Sold, Discontinued status tracking with automated workflows`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Rich media upload with support for multiple images per vehicle, image optimization, and gallery management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Lead/customer management with detailed tracking and analytics`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} Bulk messaging and email capabilities for customer communication`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Sales performance dashboard with revenue tracking`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Performance dashboard and reporting for dealer insights`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '10.7 Administration',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Moderation and governance tools for content and user management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Dealer verification/requests handling with approval workflows`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.gear} Subscription/billing management for platform monetization`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Sales reporting (sold vehicles) with analytics and export capabilities`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Architecture and Design
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '9. Architecture and Design',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '9.1 Architectural Style',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'NextDeal follows a modern web architecture:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Client (Next.js frontend): UI, routing, localization, client state, caching`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.database} API server (Express backend): business logic, auth, persistence, integrations`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.database} Database (MongoDB): persistent storage for users, vehicles, sales records, etc.`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} WebSocket server (Socket.IO): real-time chat/events`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '9.2 Frontend Layering (High-Level)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Presentation layer: src/components/, src/screens/`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Routing layer: src/app/ (Next.js App Router)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Integration layer: src/lib/api/ (API clients)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Shared utilities: src/lib/utils/ (storage, formatting, helpers)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} Localization: src/locales/ + src/i18n.ts`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '9.3 Backend Layering (Inferred from dependencies)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Typical structure (recommended):',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Routes → Controllers → Services → Data access (Mongoose models)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Auth middleware for role/permission checks`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Shared validation (Yup) + centralized error handling`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '9.4 Data Model (Representative)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Key entities implied by frontend modules and backend guides:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.users} User, Dealer, Vehicle, Lead, Community Post, Chat Message, Sales Record`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.database} Sales records (catSell) for sold vehicles reporting`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Non-Functional Requirements
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '11. Non-Functional Requirements (Quality Attributes)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'This section aligns with ISO/IEC 25010 quality characteristics.',
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.1 Performance Efficiency',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Efficient data fetching with caching (TanStack Query)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Prefer pagination for large lists (admin tables, sales logs)`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.2 Usability',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Responsive UI supporting mobile/tablet/desktop`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Consistent design language (MUI theme + Tailwind utility styles)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Toast notifications for feedback`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.3 Compatibility',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Modern browser support (Chrome/Edge/Firefox/Safari latest)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} API-driven architecture enables multi-client integrations`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.4 Reliability',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Reconnection handling for WebSocket sessions`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Graceful error handling and user feedback patterns`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.5 Security',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Token-based authentication`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Role-based access control (admin routes and backend authorization)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Secure cookie practices for tokens on client`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.6 Maintainability',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Modular components and organized route structure`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} TypeScript for stronger contracts`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Formatting + lint scripts`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '11.7 Portability',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Containerization support (Docker)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Environment-based configuration for easy deployment across regions`,
            bullet: { level: 0 },
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: '8.4 Development Workflow and Tools',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Version Control: Git for source code management and collaboration`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Package Management: npm with lock files for dependency consistency`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Code Quality: ESLint for linting, Prettier for formatting, TypeScript for type safety`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Build Tools: Next.js build system with Turbopack for fast development, tsc for TypeScript compilation`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Deployment: Docker support for containerization, environment variable configuration`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Software Engineering Model
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '12. Software Engineering Model',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '12.1 Selected Model: Agile (Iterative & Incremental) with DevOps Practices',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'NextDeal is best described as an Agile iterative product, because:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Features are modular and incrementally delivered (marketplace → chat → admin → billing) allowing for rapid iteration and feature validation`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Continuous refinement is expected for UX, performance, and business logic based on user feedback and analytics`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Multiple user roles require frequent stakeholder feedback cycles to ensure each user type receives optimal experience`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Collaborative development with regular code reviews, pair programming sessions, and knowledge sharing`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Test-driven development (TDD) practices where applicable, with automated testing integrated into CI/CD pipeline`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '12.2 Suggested Process Framework (Scrum/Hybrid)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} Backlog of user stories by persona (Buyer, Dealer, Admin)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} 2–3 week sprints with demo and retrospective`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} CI/CD and automated checks (lint, type-check, build) integrated into pipeline`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // SDLC
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '13. Software Development Life Cycle (SDLC)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '13.1 SDLC Phases and Deliverables',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          ...createSDLCTable(),
          new Paragraph({
            text: '13.2 Traceability (Recommended)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: 'Maintain a mapping: Requirement → Feature → Route/Component → API endpoint → Test case.',
            spacing: { after: 400 },
          }),
        ],
      },
      // Security, Privacy, and Compliance
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '14. Security, Privacy, and Compliance Considerations',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '14.1 Authentication and Session Handling',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} JWT-based authentication with tokens stored using cookie utilities`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Token expiry validation is recommended before privileged actions`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '14.2 Authorization (RBAC)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Admin-only endpoints (e.g., sold vehicles reporting) should require role checks and permission checks`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.shield} Dealer operations should ensure ownership-based restrictions (e.g., only edit own inventory)`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '14.3 Data Privacy',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Minimize exposure of sensitive user fields in API responses`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Apply privacy-by-design principles (data minimization, least privilege)`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '14.4 Compliance (Deployment-Region Dependent)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Depending on target countries/regions, plan for:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} GDPR/UK GDPR (EU/UK), data retention and consent`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} CAN-SPAM / local marketing regulations for bulk messaging`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Payment compliance (PCI DSS handled primarily via payment provider)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Deployment and Operations
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '15. Deployment and Operations (DevOps)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '15.1 Environments',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Development`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Staging`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} Production`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '15.2 Configuration',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.gear} Environment variables for API URL, OAuth keys, OpenAI keys, etc.`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.gear} Separate configuration files for each environment`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '15.3 Deployment Options',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Frontend: Vercel / Docker container / cloud VM`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.cloud} Backend: Docker container / cloud VM / container service`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.database} Database: managed MongoDB service or self-hosted`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '15.4 Observability (Recommended)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Centralized logs (request logs, error logs)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.chart} Metrics (API latency, chat connection counts, conversion events)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Alerts (uptime, error rate spikes)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Testing and Quality Assurance
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '16. Testing and Quality Assurance Strategy',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '16.1 Recommended Test Types',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Unit tests: utilities, validators, reducers/stores`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Integration tests: API client layer + mocked server`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} E2E tests: critical user journeys (sign up, browse, chat, dealer add listing, admin review)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} Security tests: auth, RBAC enforcement, injection and input validation`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '16.2 Automation (Recommended)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'CI pipeline gates:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Lint`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Type-check`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Build`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Test suite + coverage thresholds`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Competitive Analysis
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '17. Competitive Analysis (Why Different From Competitors)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'Many competitors focus on one layer only:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} General vehicle marketplaces (e.g., AutoTrader-like platforms): strong listings, weaker dealer operations and community engagement`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Social marketplace (e.g., Facebook Marketplace): broad reach, weaker verification, analytics, and dealer workflow integration`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Dealer management suites (CRM-style tools): strong operations, but not consumer-friendly marketplace or community features`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Traditional classifieds: limited real-time communication and no integrated dealer tools`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '17.1 NextDeal Differentiators',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} All-in-one ecosystem: marketplace + dealer operations + community + real-time chat`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} International readiness: multi-language and RTL support out of the box`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Engagement-first: built-in community and chat increases trust and conversion`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Operational maturity: admin tooling, subscription/billing modules, and comprehensive reporting`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Extensibility: modular Next.js architecture + API layering + real-time channel enables growth`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Benefits
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '18. Benefits and Why Users Should Choose NextDeal',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '18.1 Benefits for Buyers',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Faster discovery with search/filter and curated sections (hot vehicles, agencies)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Trusted options via verified dealers and recommended agencies`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Direct communication through real-time chat reduces friction`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '18.2 Benefits for Dealers',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Centralized inventory management with easy listing creation and updates`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Comprehensive lead handling and customer relationship management`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Messaging tools and bulk communication capabilities`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Analytics dashboards for performance monitoring`,
            bullet: { level: 0 },
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: '18.3 Benefits for Administrators / Platform Operators',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Central control for users, dealers, and subscriptions`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Comprehensive reporting capabilities (sales, user activity, dealer performance) and moderation workflows`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.check} Scalable platform governance model for growth`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Drawbacks
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '19. Limitations / Drawbacks',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'No software is without trade-offs. Current risks/limitations include:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Backend dependency: frontend functionality relies on the availability and stability of backend APIs`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Complexity: multi-role platform increases scope and requires careful RBAC and UI protection`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Testing maturity: comprehensive automated tests and CI enforcement may still be evolving`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Security hardening required for production: rate limiting, WAF rules, audit logs, and secret rotation should be implemented`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.warning} Operational burden: real-time systems require monitoring for connection stability and abuse prevention`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Future Enhancements
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '20. Future Enhancements (Roadmap)',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Add comprehensive test coverage (unit + integration + E2E)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Implement PWA and offline-friendly experiences`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Expand payment gateways and localized pricing/tax handling`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Advanced analytics (funnel metrics, cohort retention, dealer performance)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Real-time notifications and event-based messaging`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Accessibility upgrades (WCAG 2.1 AA alignment)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Performance optimization (image optimization, caching, bundle splitting)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Formal API documentation (OpenAPI/Swagger) + versioning strategy`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.rocket} Security hardening (rate limiting, RBAC audit trails, MFA for admin, abuse detection)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
      // Conclusion
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '21. Conclusion',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'NextDeal is positioned as a complete automotive ecosystem rather than a single-purpose marketplace. By combining marketplace discovery, dealer operations, community engagement, internationalization, and real-time chat, the platform offers a clear foundation for scalable growth and international deployment.',
            spacing: { after: 400 },
          }),
        ],
      },
      // Appendices
      {
        properties: {
          type: SectionType.NEXT_PAGE,
        },
        children: [
          new Paragraph({
            text: '22. Appendices',
            heading: HeadingLevel.HEADING_1,
            spacing: { after: 300 },
          }),
          new Paragraph({
            text: 'Appendix A — Frontend Project Structure (Summary)',
            heading: HeadingLevel.HEADING_2,
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'Key folders:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} src/app/: routes (public, auth, admin, chat, payment)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} src/components/: reusable UI, layouts, modals, admin UI`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} src/lib/api/: API client modules grouped by domain`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} src/lib/hooks/: authentication, authorization, permissions, currency provider`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.code} src/lib/utils/: helpers (secure storage, time formatting, currency, sockets, etc.)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.network} src/locales/: translation resources (en, he, bn)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Appendix B — Frontend Environment Variables (Recommended)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: 'Create .env.local:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: 'NEXT_PUBLIC_APP_URL=http://localhost:3000',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'NEXT_PUBLIC_API_URL=http://localhost:8000',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'GOOGLE_CLIENT_ID=...',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'GOOGLE_CLIENT_SECRET=...',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'OPENAI_API_KEY=...',
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: 'SOCKET_URL=...',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Appendix C — Backend Dependencies',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: 'Core backend technologies include Express.js, MongoDB/Mongoose, Socket.IO, JWT authentication, Cloudinary for file storage, Nodemailer for email services, and OpenAI SDK for AI integration. Full dependency list is available in the backend package.json file.',
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Appendix D — Glossary (Selected Terms)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} RBAC: Role-Based Access Control`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} SDLC: Software Development Life Cycle`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} SSR/CSR: Server-Side Rendering / Client-Side Rendering`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} i18n: Internationalization`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} RTL: Right-to-Left layout direction`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} WebSocket: Persistent connection for real-time communication`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Appendix E — Example Backend API Contracts',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: 'The repository includes backend implementation guides suggesting:',
            spacing: { after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} PATCH /api/vehicale/:id/status (status changes: Pending/Available/Discontinued)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} POST /api/vehicale/:id/sold (mark sold + create sale record)`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.arrow} GET /api/catSell (admin-only sold vehicles reporting with pagination + search)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
          new Paragraph({
            text: 'Appendix F — References (Recommended)',
            heading: HeadingLevel.HEADING_2,
            spacing: { before: 400, after: 200 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} ISO/IEC/IEEE 12207 — Software life cycle processes`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} ISO/IEC 25010 — Systems and software quality models`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.info} Next.js Documentation — https://nextjs.org/docs`,
            bullet: { level: 0 },
            spacing: { after: 100 },
          }),
          new Paragraph({
            text: `  ${ICONS.security} OWASP ASVS / Top 10 (for security hardening)`,
            bullet: { level: 0 },
            spacing: { after: 400 },
          }),
        ],
      },
    ],
  });

  return doc;
}

function generateTOC() {
  const sections = [
    '1. Preface',
    '2. Executive Summary',
    '3. Introduction',
    '4. Project Description',
    '5. Objectives and Scope',
    '6. Stakeholders and User Roles',
    '7. System Overview (Modules & Functional Areas)',
    '8. Technology Stack and Tools',
    '9. Architecture and Design',
    '10. Key Features (Functional)',
    '11. Non-Functional Requirements (Quality Attributes)',
    '12. Software Engineering Model',
    '13. Software Development Life Cycle (SDLC)',
    '14. Security, Privacy, and Compliance Considerations',
    '15. Deployment and Operations (DevOps)',
    '16. Testing and Quality Assurance Strategy',
    '17. Competitive Analysis (Why Different From Competitors)',
    '18. Benefits and Why Users Should Choose NextDeal',
    '19. Limitations / Drawbacks',
    '20. Future Enhancements (Roadmap)',
    '21. Conclusion',
    '22. Appendices',
  ];

  return sections.map((section) => 
    new Paragraph({
      text: section,
      spacing: { after: 120 },
    })
  );
}

function createTechStackTable(title, items) {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('Technology')],
              shading: { fill: '1a5490', type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Version/Details')],
              shading: { fill: '1a5490', type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        ...items.map(([tech, version]) =>
          new TableRow({
            children: [
              new TableCell({
                children: [new Paragraph(tech)],
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
              new TableCell({
                children: [new Paragraph(version)],
                margins: { top: 100, bottom: 100, left: 100, right: 100 },
              }),
            ],
          })
        ),
      ],
    }),
    new Paragraph({ text: '', spacing: { after: 400 } }),
  ];
}

function createSDLCTable() {
  return [
    new Table({
      width: { size: 100, type: WidthType.PERCENTAGE },
      rows: [
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('Phase')],
              shading: { fill: '1a5490', type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Deliverables')],
              shading: { fill: '1a5490', type: ShadingType.SOLID },
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('1. Planning & Feasibility')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Business case, scope, risk list, initial roadmap')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('2. Requirements Analysis')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('User stories, SRS-style requirements, acceptance criteria')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('3. System Design')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Architecture diagrams, data models, API specs (OpenAPI recommended)')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('4. Implementation')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Frontend modules, backend APIs, database schema, real-time events')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('5. Testing & Verification')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Unit tests, integration tests, regression checklist, security tests')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('6. Deployment')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Build artifacts, Docker images, environment configuration')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
        new TableRow({
          children: [
            new TableCell({
              children: [new Paragraph('7. Operations & Maintenance')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
            new TableCell({
              children: [new Paragraph('Monitoring dashboards, incident runbooks, feedback loop')],
              margins: { top: 100, bottom: 100, left: 100, right: 100 },
            }),
          ],
        }),
      ],
    }),
    new Paragraph({ text: '', spacing: { after: 400 } }),
  ];
}

// Generate the document
async function generateDoc() {
  try {
    const doc = createDocument();
    const buffer = await Packer.toBuffer(doc);
    
    const outputDir = path.join(__dirname, '..', 'docs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'NextDeal_Project_Report.docx');
    fs.writeFileSync(outputPath, buffer);
    
    console.log(`✅ Word document generated successfully at: ${outputPath}`);
  } catch (error) {
    console.error('❌ Error generating document:', error);
    process.exit(1);
  }
}

// Run if executed directly
if (require.main === module) {
  generateDoc();
}

module.exports = { generateDoc };

