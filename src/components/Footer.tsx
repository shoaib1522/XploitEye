import { motion } from 'framer-motion'
import { Twitter, Linkedin, Youtube, Rss } from 'lucide-react'

const Footer = () => {
  const footerSections = [
    {
      title: "PRODUCT",
      links: [
        "Endor Open Source",
        "Endor CI/CD", 
        "Endor SBOM Hub"
      ]
    },
    {
      title: "USE CASES",
      links: [
        "Code Scanning",
        "SAST & Secret Detection",
        "AI Code Governance",
        "Upgrades & Remediation",
        "SBOM Ingestion",
        "AI Apps"
      ]
    },
    {
      title: "INTEGRATIONS",
      links: [
        "VS Code / GitHub Copilot",
        "Cursor",
        "C/C++",
        "Microsoft Defender for Cloud",
        "Rust",
        "Bitbucket"
      ]
    },
    {
      title: "COMPANY",
      links: [
        "About",
        "Careers",
        "Press",
        "Security",
        "Trust Center",
        "Blog"
      ]
    }
  ]

  return (
    <footer className="footer">
      <div className="footer-container">
        <motion.div 
          className="footer-top"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <div className="footer-brand">
            <motion.div 
              className="footer-logo"
              whileHover={{ scale: 1.05 }}
            >
              <span className="brand-text">XploitEye</span>
            </motion.div>
            
            <p className="footer-description">
              Uplevel app security skills and connect with like-minded people. 
              LeanAppSec is the app security education and community for tech professionals.
            </p>
            
            <motion.a 
              href="#" 
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Start learning
            </motion.a>
          </div>

          <div className="footer-links">
            {footerSections.map((section, index) => (
              <motion.div
                key={section.title}
                className="footer-section"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <h4>{section.title}</h4>
                <ul>
                  {section.links.map((link) => (
                    <motion.li 
                      key={link}
                      whileHover={{ x: 5 }}
                      transition={{ type: "spring", stiffness: 300 }}
                    >
                      <a href="#">{link}</a>
                    </motion.li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <motion.div 
          className="footer-bottom"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          viewport={{ once: true }}
        >
          <div className="footer-social">
            <motion.a 
              href="#" 
              className="social-link"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Twitter size={20} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-link"
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Linkedin size={20} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-link"
              whileHover={{ scale: 1.2, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Youtube size={20} />
            </motion.a>
            <motion.a 
              href="#" 
              className="social-link"
              whileHover={{ scale: 1.2, rotate: -5 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <Rss size={20} />
            </motion.a>
          </div>

          <div className="footer-legal">
            <p>© 2025 XploitEye. All rights reserved.</p>
            <div className="legal-links">
              <a href="#">Legal and Privacy</a>
              <a href="#">Trust and Security</a>
            </div>
          </div>

          <p className="footer-disclaimer">
            All names, logos, and brands of third parties listed on our site are trademarks
            of their respective owners. XploitEye and its products and services are not
            endorsed by, sponsored by, or affiliated with these third parties.
          </p>
        </motion.div>
      </div>
    </footer>
  )
}

export default Footer
