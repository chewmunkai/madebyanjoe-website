import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, Lightformer, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

/* Refractive water droplet. Falls + elongates as scroll progresses, with a
   gentle idle wobble. `progress` is a ref (0..1) from ScrollTrigger; the fall is
   re-mapped to finish before the sticky hero unsticks. */
function Droplet({ progress }) {
  const mesh = useRef()

  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const p = Math.min(1, progress.current / 0.55)
    const t = state.clock.elapsedTime

    m.position.x = 1.05
    m.position.y = THREE.MathUtils.lerp(0.55, -1.2, p) + Math.sin(t * 0.6) * 0.05
    const stretch = 1 + p * 0.3
    const squash = 1 / (1 + p * 0.08)
    m.scale.set(squash, stretch, squash)
    m.rotation.y = t * 0.1
    m.rotation.z = Math.sin(t * 0.3) * 0.05
  })

  return (
    <mesh ref={mesh} position={[1.05, 0.55, 0]}>
      <sphereGeometry args={[1.3, 128, 128]} />
      <MeshTransmissionMaterial
        samples={10}
        resolution={1024}
        transmission={1}
        thickness={0.5}
        roughness={0}
        ior={1.33}
        chromaticAberration={0.09}
        distortion={0.22}
        distortionScale={0.4}
        temporalDistortion={0.06}
        clearcoat={1}
        clearcoatRoughness={0.08}
        envMapIntensity={1.5}
        color="#ffffff"
        attenuationColor="#e3f3fa"
        attenuationDistance={6}
      />
    </mesh>
  )
}

/* Bright, enveloping environment built from the brand wash (blue top, blush
   bottom, warm paper backdrop) so the glass refracts light, not black. */
function DropEnvironment() {
  return (
    <Environment resolution={256}>
      {/* full enveloping fill so there is no black anywhere to refract */}
      <mesh scale={60}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshBasicMaterial color="#eaf2f6" side={THREE.BackSide} />
      </mesh>
      <Lightformer form="rect" intensity={1.4} position={[0, 9, -4]} scale={[26, 10, 1]} color="#bfe0ee" />
      <Lightformer form="rect" intensity={1.2} position={[0, -9, -4]} scale={[26, 10, 1]} color="#f7d2de" />
      <Lightformer form="rect" intensity={3} position={[6, 5, 4]} scale={7} color="#ffffff" />
      <Lightformer form="circle" intensity={2.4} position={[-5, -1, 5]} scale={4} color="#ffffff" />
    </Environment>
  )
}

export default function WaterDropHero() {
  const root = useRef()
  const progress = useRef(0)

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    // Insurance: nudge R3F to (re)measure the canvas after first paint.
    const r1 = requestAnimationFrame(() => window.dispatchEvent(new Event('resize')))
    const r2 = setTimeout(() => window.dispatchEvent(new Event('resize')), 200)

    let st
    if (!reduce) {
      st = ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: true,
        onUpdate: (self) => {
          progress.current = self.progress
          root.current?.style.setProperty('--p', self.progress.toFixed(3))
        },
      })
    }

    const r3 = setTimeout(() => ScrollTrigger.refresh(), 320)
    return () => {
      cancelAnimationFrame(r1)
      clearTimeout(r2)
      clearTimeout(r3)
      st?.kill()
    }
  }, [])

  return (
    <section className="dh" ref={root}>
      <div className="dh__sticky">
        <div className="dh__wash" />

        <div className="dh__canvas">
          <Canvas
            camera={{ position: [0, 0, 4.4], fov: 38 }}
            dpr={[1, 1.75]}
            gl={{ antialias: true, alpha: true, powerPreference: 'high-performance' }}
          >
            <ambientLight intensity={0.5} />
            <directionalLight position={[3, 4, 5]} intensity={0.8} />
            {/* Brand-wash gradient behind the drop: this is what the glass
                refracts (transmission samples the rendered scene), and it doubles
                as the canvas background. */}
            <mesh position={[0, 0, -4]} scale={[46, 28, 1]}>
              <planeGeometry />
              <meshBasicMaterial toneMapped={false}>
                <GradientTexture
                  stops={[0, 0.4, 0.6, 1]}
                  colors={['#bfe1ef', '#e2f0f7', '#f6e7ef', '#f3cedb']}
                  size={1024}
                />
              </meshBasicMaterial>
            </mesh>
            <Droplet progress={progress} />
            <DropEnvironment />
          </Canvas>
        </div>

        <div className="container dh__copy">
          <span className="eyebrow">Raw Beauté · Made in Malaysia</span>
          <h1>
            Hydration,
            <br />
            <em>engineered.</em>
          </h1>
          <p className="lede">
            Plant-based, probiotic skincare that floods the skin with moisture and
            rebuilds the barrier — clinically gentle, visibly dewy.
          </p>
          <div className="dh__cta">
            <Link to="/shop" className="btn">
              Shop the ritual
            </Link>
            <Link to="/about" className="textlink">
              Our science →
            </Link>
          </div>
        </div>

        <div className="dh__scroll">
          <span className="dh__line" />
          Scroll
        </div>
      </div>
    </section>
  )
}
