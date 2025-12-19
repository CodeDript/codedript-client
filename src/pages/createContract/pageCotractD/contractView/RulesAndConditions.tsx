import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import styles from './RulesAndConditions.module.css';
import authStyles from '../../../../components/auth/AuthForm.module.css';
import heroOutlineup from '../../../../assets/Login/cardBackgroundup.svg';
import heroOutlinedown from '../../../../assets/Login/cardBackgrounddown.svg';
import Button2 from '../../../../components/button/Button2/Button2';
import Button3Black1 from '../../../../components/button/Button3Black1/Button3Black1';

const RulesAndConditions: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const agreement = location.state?.agreement;
  const contentRef = useRef<HTMLDivElement>(null);

  const handleDownloadPDF = async () => {
    if (!contentRef.current) return;

    try {
      const canvas = await html2canvas(contentRef.current, {
        scale: 2,
        useCORS: true,
        logging: false,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4');
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      const imgX = (pdfWidth - imgWidth * ratio) / 2;
      const imgY = 10;

      pdf.addImage(imgData, 'PNG', imgX, imgY, imgWidth * ratio, imgHeight * ratio);
      pdf.save(`Contract_Terms_${agreement?.project?.name || 'Document'}.pdf`);
    } catch (error) {
      alert('Failed to generate PDF. Please try again.');
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.inner}>
        <div className={authStyles.formOuter}>
          <img src={heroOutlineup} alt="outline" className={`${authStyles.outline} ${authStyles.outlineTop}`} />
          <img src={heroOutlinedown} alt="outline" className={`${authStyles.outline} ${authStyles.outlineBottom}`} />

          <div className={styles.header}>
          
            <h1 className={styles.title}>Contract Terms & Conditions</h1>
          </div>

          <div className={authStyles.authBody}>
            <div ref={contentRef} className={styles.contentArea}>
              {/* Project Details Section */}
              <div className={styles.projectDetails}>
                <h2 className={styles.sectionTitle}>Project Details</h2>
                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Project Name:</span>
                    <span className={styles.detailValue}>{agreement?.project?.name || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Description:</span>
                    <span className={styles.detailValue}>{agreement?.project?.description || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Total Value:</span>
                    <span className={styles.detailValue}>
                      {agreement?.financials?.totalValue || 'N/A'} {agreement?.financials?.currency || 'ETH'}
                    </span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Deadline:</span>
                    <span className={styles.detailValue}>{agreement?.deadline || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Client:</span>
                    <span className={styles.detailValue}>{agreement?.client?.profile?.name || 'N/A'}</span>
                  </div>
                  <div className={styles.detailItem}>
                    <span className={styles.detailLabel}>Developer:</span>
                    <span className={styles.detailValue}>{agreement?.developer?.profile?.name || 'N/A'}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Conditions Section */}
              <div className={styles.termsSection}>
                <h2 className={styles.sectionTitle}>Terms and Conditions</h2>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>1. Introduction</h3>
                  <p className={styles.termText}>
                    This Agreement sets out the terms under which the Client and Freelancer engage in projects through
                    CodeDript, a blockchain-based freelancing platform designed to ensure transparency, secure
                    transactions, and trust between parties. By using CodeDript, both parties acknowledge that their
                    relationship is legally binding through the platform's smart contract and escrow systems.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>2. Scope of Work</h3>
                  <p className={styles.termText}>
                    The Freelancer agrees to provide services as requested by the Client, according to the project description
                    and milestones defined in the smart contract. Both parties acknowledge that the details of the project must
                    be clearly defined to avoid misunderstandings. Any changes to the agreed-upon scope must be mutually
                    accepted and documented within the platform.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>3. Payment and Escrow</h3>
                  <p className={styles.termText}>
                    All payments on CodeDript are handled exclusively through its blockchain-based escrow system. The
                    Client must deposit the full project fee or milestone payments into escrow before the freelancer begins work.
                    Funds are released only when the Client confirms satisfactory completion of the work or in the case
                    of a dispute, when an arbitrator renders a final decision.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>4. Intellectual Property Rights</h3>
                  <p className={styles.termText}>
                    Ownership of all work produced by the freelancer remains with the freelancer until full payment has been
                    released from escrow. Upon payment, all intellectual property rights are transferred to the
                    Client, unless both parties have agreed otherwise in writing.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>5. Confidentiality</h3>
                  <p className={styles.termText}>
                    Both Client and Freelancer agree to keep all project-related information private and confidential. Neither
                    party may share or disclose sensitive information obtained during the project without explicit written
                    consent from the other party unless required by law.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>6. Security and Blockchain Risks</h3>
                  <p className={styles.termText}>
                    CodeDript operates on blockchain technology to ensure secure transactions and
                    payments. However, both parties acknowledge the risks associated with blockchain systems, such as
                    potential vulnerabilities, network congestion, or gas fees for transactions. CodeDript is not liable for losses
                    caused by external blockchain factors or misuse of the platform.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>7. Dispute Resolution</h3>
                  <p className={styles.termText}>
                    In case of disagreement, both parties should first attempt to resolve the issue directly. If they cannot
                    reach an agreement, the dispute will be escalated to CodeDript's decentralized arbitration process.
                    Arbitrators, selected by the platform's system, will review the evidence and issue a binding decision on the
                    outcome.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>8. Termination</h3>
                  <p className={styles.termText}>
                    The Client may terminate the contract at any stage, provided the Freelancer is compensated for work
                    already completed, and the payment is released from escrow. Upon termination, any remaining escrow
                    funds to be returned will be determined based on completed work.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>9. Platform Responsibilities</h3>
                  <p className={styles.termText}>
                    CodeDript acts as a neutral facilitator by providing escrow, dispute resolution, and a secure platform for
                    transactions. However, CodeDript is not responsible for the quality, timeliness, or outcomes of any project.
                    Both Clients and Freelancers remain solely responsible for fulfilling their obligations under this
                    Agreement.
                  </p>
                </div>

                <div className={styles.termItem}>
                  <h3 className={styles.termTitle}>10. Governing Law</h3>
                  <p className={styles.termText}>
                    This Agreement is governed primarily by the smart contract code deployed on the Blockchain. Where legal
                    matters arise outside the scope of the smart contract, this Agreement will be interpreted in accordance with
                    blockchain execution terms precedence.
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className={styles.actionsRow}>
              <div className={styles.prevBtn}>
                <Button2 text="← Previous" onClick={() => navigate(-1)} />
              </div>
              <div className={styles.actionsRight}>
                <Button3Black1 text="Download PDF" onClick={handleDownloadPDF} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RulesAndConditions;
