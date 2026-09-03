import React from 'react';
import { motion } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Building2, Calendar, Tag, Landmark, Network, Server, Users, Award } from 'lucide-react';
import { useSoundContext } from './ui/SoundProvider';

const WORK_EXPERIENCES = [
  {
    id: 'bsi',
    company: 'PT. Bank Syariah Indonesia (BSI)',
    role: 'Back Office Intern',
    period: 'Mar 2025 – Jun 2025',
    type: 'Internship',
    icon: Landmark,
    description:
      'Supported core administrative and back-office operations in a strict procedural banking environment. Handled operational data management, document verification, archival governance, and daily banking administrative workflows requiring high confidentiality and precision.',
    responsibilities: [
      'Managed and organized operational banking datasets',
      'Assisted document verification and administrative archival',
      'Supported compliance with procedural and compliance standards',
    ],
    tags: ['Banking Administration', 'Data Management', 'Document Control', 'Procedural Compliance'],
  },
  {
    id: 'bank-sumut',
    company: 'PT. Bank Sumut',
    role: 'Operational Division Intern',
    period: 'Jun 2025 – Jul 2025',
    type: 'Internship',
    icon: Building2,
    description:
      'Assisted the operational division with daily banking transaction workflows and customer service functions. Supported operational procedures, customer inquiries, and procedural compliance in routine banking operations.',
    responsibilities: [
      'Assisted operational team with daily transaction processing',
      'Supported customer service and customer inquiry workflows',
      'Maintained adherence to standard operating procedures',
    ],
    tags: ['Banking Operations', 'Transaction Processing', 'Customer Service', 'Operational Support'],
  },
  {
    id: 'bpjs',
    company: 'BPJS Ketenagakerjaan',
    role: 'IT / Internship Administration Support',
    period: '2024',
    type: 'Internship',
    icon: Server,
    description:
      'Coordinated IT-related internship systems, participant data management, and technical webinar support. Assisted users with JMO (Jamsostek Mobile) activation and troubleshooting, and engineered a performance visualization dashboard for tracking intern metrics.',
    responsibilities: [
      'Built a dashboard for intern performance & JMO activation metrics',
      'Handled user technical support and JMO account activation',
      'Managed participant data administration and automated communication blasting',
    ],
    tags: ['IT Support', 'Dashboard Development', 'Data Administration', 'JMO Troubleshooting'],
  },
  {
    id: 'telkom-akses',
    company: 'PT. Telkom Akses Indonesia',
    role: 'Fiber Technician — Certified Internship',
    period: 'Feb 2022 – Apr 2022',
    type: 'Internship',
    icon: Network,
    description:
      'Certified vocational internship focused on optical telecommunication infrastructure. Performed fiber optic deployment, fusion splicing, optical power meter testing, GPON system maintenance, and network troubleshooting in field operations.',
    responsibilities: [
      'Installed and maintained optical fiber distribution infrastructure',
      'Operated GPON-related network systems and optical diagnostic tools',
      'Assisted with field technical diagnostics and line repairs',
    ],
    tags: ['Fiber Optic', 'GPON Systems', 'Network Engineering', 'Field Operations'],
  },
];

const ORGANIZATION_EXPERIENCES = [
  {
    id: 'himti',
    company: 'HIMTI Universitas Sumatera Utara',
    role: 'Head of Creative Media Division',
    period: '2023 – 2024',
    type: 'Organization',
    icon: Users,
    description:
      'Led the Creative Media Division of the Informatics Engineering Student Association. Directed visual branding, managed team members, produced social media content, event photography, certificates, banners, and digital promotional assets.',
    responsibilities: [
      'Managed division members and coordinated event media teams',
      'Directed visual design production via Figma and photography assets',
      'Led creative strategy and official organizational social media channels',
    ],
    tags: ['Leadership', 'Team Management', 'Figma', 'Event Documentation', 'Visual Design'],
  },
];

const TimelineCard = ({ item, index }) => {
  const { playHover } = useSoundContext();
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.2,
  });

  const isEven = index % 2 === 0;
  const Icon = item.icon;

  return (
    <div
      ref={ref}
      style={{
        position: 'relative',
        marginBottom: '48px',
        display: 'flex',
        justifyContent: isEven ? 'flex-start' : 'flex-end',
        width: '100%',
      }}
      className={`timeline-row ${isEven ? 'timeline-left' : 'timeline-right'}`}
    >
      {/* Center Node / Dot on Timeline */}
      <div
        className="timeline-center-node"
        style={{
          position: 'absolute',
          left: '50%',
          top: '24px',
          transform: 'translateX(-50%)',
          width: '20px',
          height: '20px',
          borderRadius: '50%',
          background: inView ? 'var(--accent)' : 'var(--border)',
          border: '4px solid var(--bg)',
          boxShadow: inView ? '0 0 16px var(--accent-glow)' : 'none',
          zIndex: 3,
          transition: 'all 0.4s ease-out',
        }}
      />

      {/* Card Body */}
      <motion.div
        initial={{ opacity: 0, x: isEven ? -50 : 50, y: 20 }}
        animate={inView ? { opacity: 1, x: 0, y: 0 } : { opacity: 0, x: isEven ? -50 : 50, y: 20 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        onMouseEnter={playHover}
        whileHover={{ y: -4, borderColor: 'var(--accent-2-border)' }}
        className="timeline-card"
        style={{
          width: 'calc(50% - 40px)',
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          borderRadius: '18px',
          padding: '24px',
          position: 'relative',
          boxShadow: inView ? '0 10px 30px rgba(0, 0, 0, 0.3)' : 'none',
          transition: 'border-color 0.2s, transform 0.2s, box-shadow 0.2s',
        }}
      >
        {/* Header: Company & Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '12px',
            marginBottom: '8px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'var(--accent-2-dim)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--accent)',
                flexShrink: 0,
              }}
            >
              <Icon size={18} />
            </div>
            <div>
              <h3
                style={{
                  margin: 0,
                  fontSize: '1.1rem',
                  fontWeight: 600,
                  color: 'var(--text)',
                }}
              >
                {item.company}
              </h3>
              <p
                style={{
                  margin: '2px 0 0',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  color: 'var(--accent)',
                }}
              >
                {item.role}
              </p>
            </div>
          </div>

          <span
            style={{
              fontSize: '0.72rem',
              fontWeight: 600,
              padding: '4px 10px',
              borderRadius: '999px',
              background:
                item.type === 'Organization'
                  ? 'rgba(16, 185, 129, 0.12)'
                  : 'var(--accent-2-dim)',
              border: `1px solid ${
                item.type === 'Organization'
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'var(--accent-2-border)'
              }`,
              color: item.type === 'Organization' ? '#10B981' : 'var(--accent)',
              whiteSpace: 'nowrap',
            }}
          >
            {item.type}
          </span>
        </div>

        {/* Period */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.8rem',
            color: 'var(--text-muted)',
            marginBottom: '14px',
          }}
        >
          <Calendar size={13} />
          <span>{item.period}</span>
        </div>

        {/* Description */}
        <p
          style={{
            fontSize: '0.9rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            margin: '0 0 16px',
            fontWeight: 300,
          }}
        >
          {item.description}
        </p>

        {/* Key Responsibilities */}
        <ul
          style={{
            margin: '0 0 16px',
            paddingLeft: '18px',
            fontSize: '0.85rem',
            color: 'var(--text-muted)',
            lineHeight: 1.6,
          }}
        >
          {item.responsibilities.map((resp, i) => (
            <li key={i} style={{ marginBottom: '4px' }}>
              {resp}
            </li>
          ))}
        </ul>

        {/* Tags */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {item.tags.map((tag) => (
            <span
              key={tag}
              style={{
                fontSize: '0.75rem',
                padding: '4px 10px',
                borderRadius: '6px',
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border)',
                color: 'var(--text)',
              }}
            >
              {tag}
            </span>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

const Experience = () => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    threshold: 0.05,
  });

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: 'easeOut' },
    },
  };

  return (
    <section
      id="experience"
      ref={ref}
      style={{
        padding: '100px 24px',
        background: 'var(--bg)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
        }}
      >
        {/* Section Header */}
        <motion.div
          initial="hidden"
          animate={inView ? 'visible' : 'hidden'}
          variants={fadeUp}
          style={{ textAlign: 'center', marginBottom: '60px' }}
        >
          <span
            style={{
              color: 'var(--accent)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Career Timeline
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Professional Experience
          </h2>
          <div
            style={{
              width: '60px',
              height: '3px',
              background: 'var(--accent)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              maxWidth: '620px',
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            Demonstrated adaptability and precision across corporate banking operations, institutional IT systems, and telecommunication field engineering.
          </p>
        </motion.div>

        {/* Timeline Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Vertical Center Line */}
          <div
            className="timeline-vertical-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent) 0%, var(--accent-2-border) 90%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {/* Work Experience Cards */}
          {WORK_EXPERIENCES.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>

        {/* Section 2: Organizational Experience */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
          variants={fadeUp}
          style={{ textAlign: 'center', marginTop: '90px', marginBottom: '60px' }}
        >
          <span
            style={{
              color: 'var(--accent-2)',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '2px',
              textTransform: 'uppercase',
              display: 'block',
              marginBottom: '8px',
            }}
          >
            Leadership & Community
          </span>
          <h2
            style={{
              fontSize: 'clamp(2rem, 3.5vw, 2.8rem)',
              fontWeight: 600,
              color: 'var(--text)',
              margin: '0 auto 12px',
              letterSpacing: '-0.02em',
            }}
          >
            Organizational Experience
          </h2>
          <div
            style={{
              width: '60px',
              height: '3px',
              background: 'var(--accent-2)',
              margin: '0 auto 16px',
              borderRadius: '2px',
            }}
          />
          <p
            style={{
              color: 'var(--text-muted)',
              fontSize: '1rem',
              maxWidth: '620px',
              margin: '0 auto',
              fontWeight: 300,
            }}
          >
            Demonstrated creative media leadership, team governance, and visual communication strategy within academic student associations.
          </p>
        </motion.div>

        {/* Organization Timeline Container */}
        <div
          style={{
            position: 'relative',
            width: '100%',
          }}
        >
          {/* Vertical Center Line for Organization */}
          <div
            className="timeline-vertical-line"
            style={{
              position: 'absolute',
              left: '50%',
              top: '20px',
              bottom: '40px',
              width: '2px',
              background: 'linear-gradient(180deg, var(--accent-2) 0%, var(--accent-dim) 90%, transparent 100%)',
              transform: 'translateX(-50%)',
              zIndex: 1,
            }}
          />

          {/* Organization Cards */}
          {ORGANIZATION_EXPERIENCES.map((item, idx) => (
            <TimelineCard key={item.id} item={item} index={idx} />
          ))}
        </div>
      </div>

      <style>{`
        @media (max-width: 850px) {
          .timeline-vertical-line {
            left: 20px !important;
            transform: none !important;
          }
          .timeline-center-node {
            left: 20px !important;
            transform: translateX(-50%) !important;
          }
          .timeline-row {
            justify-content: flex-end !important;
          }
          .timeline-card {
            width: calc(100% - 50px) !important;
            margin-left: 50px !important;
          }
        }
      `}</style>
    </section>
  );
};

export default Experience;
