import { motion } from 'framer-motion'
import { Eye } from 'lucide-react'
import Lottie from 'lottie-react'
import { useState, useEffect } from 'react'

const Hero = () => {
  const [animationData, setAnimationData] = useState(null)

  useEffect(() => {
    // Fetch the Lottie animation data
    fetch('https://cdn.prod.website-files.com/656eaf5c6da3527caf362363/65cb9cc146cf43cd76aeeae2_EndorHero-InsecureRepos.json')
      .then(response => response.json())
      .then((data) => {
        try {
          // Attempt to hide any layer that looks like the central 'E'
          const cloned = JSON.parse(JSON.stringify(data))
          if (Array.isArray(cloned.layers)) {
            cloned.layers.forEach((layer: any) => {
              const name: string = (layer && layer.nm) || ''
              // If it's a text layer (ty === 5) and contains a single 'E' or name suggests 'E'
              const isText = layer && layer.ty === 5
              const hasEName = /(^|\b)E(\b|$)/i.test(name) || /letter[-_ ]?e/i.test(name)
              let isEText = false
              try {
                // Lottie text payload can be under layer.t.d.k[0].s.t
                const txt = layer?.t?.d?.k?.[0]?.s?.t
                if (typeof txt === 'string' && txt.trim().toUpperCase() === 'E') {
                  isEText = true
                }
              } catch {}
              if (hasEName || (isText && isEText)) {
                // Prefer hiding the layer using the 'hd' flag
                layer.hd = true
                // As a fallback, set opacity to 0 if transform exists
                if (layer.ks && layer.ks.o) {
                  // Some files use { k: number } or keyframes array
                  if (typeof layer.ks.o.k === 'number') {
                    layer.ks.o.k = 0
                  } else if (Array.isArray(layer.ks.o.k)) {
                    layer.ks.o.k = layer.ks.o.k.map((kf: any) => ({ ...kf, s: [0] }))
                  }
                }
              }
            })
          }
          setAnimationData(cloned)
        } catch (e) {
          console.warn('Lottie post-process failed, using original data', e)
          setAnimationData(data)
        }
      })
      .catch(error => console.error('Error loading Lottie animation:', error))
  }, [])
  return (
    <section className="hero">
      {/* First Section - Full Lottie Animation */}
      <div className="hero-animation-section">
        <div className="hero-background">
          {animationData ? (
            <div className="lottie-container">
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                style={{ width: '100%', height: '100%' }}
                className="hero-lottie-bg"
              />
              <div className="logo-overlay">
                {/* Small black box behind the eye to cover the 'E' */}
                <div className="eye-backdrop" aria-hidden="true" />
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ 
                    duration: 1.2, 
                    delay: 0.5,
                    type: "spring", 
                    stiffness: 200,
                    damping: 15
                  }}
                  whileHover={{ 
                    scale: 1.3,
                    rotate: 15,
                    transition: { duration: 0.3, type: "spring", stiffness: 300 }
                  }}
                  className="eye-container"
                >
                  <motion.div
                    animate={{
                      // Restrict to XploitEye brand colors: red and blue
                      color: ["#ff3b3b", "#4facfe", "#ff3b3b"],
                      scale: [1, 1.08, 1],
                      y: [0, 3, 0]
                    }}
                    transition={{
                      duration: 3.2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  >
                    <Eye className="overlay-logo" size={64} />
                  </motion.div>
                </motion.div>
              </div>
            </div>
          ) : (
            <div className="lottie-loading">
              {/* Fallback animated background while loading */}
              <div className="hero-graph">
                <motion.div 
                  className="graph-node"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 20px rgba(79, 172, 254, 0.3)',
                      '0 0 40px rgba(79, 172, 254, 0.6)',
                      '0 0 20px rgba(79, 172, 254, 0.3)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut"
                  }}
                />
                <motion.div 
                  className="graph-node graph-node-2"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 20px rgba(16, 185, 129, 0.3)',
                      '0 0 40px rgba(16, 185, 129, 0.6)',
                      '0 0 20px rgba(16, 185, 129, 0.3)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 1
                  }}
                />
                <motion.div 
                  className="graph-node graph-node-3"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      '0 0 20px rgba(139, 92, 246, 0.3)',
                      '0 0 40px rgba(139, 92, 246, 0.6)',
                      '0 0 20px rgba(139, 92, 246, 0.3)'
                    ]
                  }}
                  transition={{ 
                    duration: 3, 
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 2
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Second Section - Content */}
      <div className="hero-content-section">
        <div className="hero-container">
          <div className="hero-content">
            <motion.h1 
              className="hero-title"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              <span className="gradient-text">The Future of Vulnerability Testing and Risk Mitigation</span>
            </motion.h1>

            <motion.p 
              className="hero-subtitle"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <span className="subtitle-line1">XploitEye leverages AI-driven automation to map out the entire cyber-kill chain,</span> allowing teams to identify, exploit, and mitigate vulnerabilities across web and system environments whether the threats come from external attacks or internal misconfigurations.
            </motion.p>

            {/* Buttons removed per request */}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
