import { useEffect, useMemo, useRef } from 'react'
import { Link } from 'react-router-dom'
import { Canvas, useFrame } from '@react-three/fiber'
import { MeshTransmissionMaterial, Environment, Lightformer, GradientTexture } from '@react-three/drei'
import * as THREE from 'three'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useCart } from '../store/cart.js'
import { useIntro } from '../store/intro.js'
import Magnetic from '../lib/Magnetic.jsx'
import { getProduct, formatPrice } from '../data/products.js'

const flagship = getProduct('probiotic-amino-cleanser')

/* Main refractive droplet — falls + elongates on scroll, with idle wobble. */
function Droplet({ progress }) {
  const mesh = useRef()
  useFrame((state) => {
    const m = mesh.current
    if (!m) return
    const p = Math.min(1, progress.current / 0.55)
    const t = state.clock.elapsedTime
    m.position.x = 1.05
    m.position.y = THREE.MathUtils.lerp(0.55, -1.2, p) + Math.sin(t * 0.6) * 0.05
    m.scale.set(1 / (1 + p * 0.08), (1 + p * 0.3) * (1 - p * 0.18), 1 / (1 + p * 0.08))
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

/* Lightweight glass micro-droplets (env-refraction only — no scene buffer pass,
   so they're cheap). They drift and parallax up as you scroll. */
function MicroDrop({ pos, r, sp, progress }) {
  const ref = useRef()
  useFrame((state) => {
    const m = ref.current
    if (!m) return
    const t = state.clock.elapsedTime
    m.position.x = pos[0] + Math.cos(t * sp * 0.7) * 0.08
    m.position.y = pos[1] + Math.sin(t * sp + pos[0]) * 0.16 - progress.current * 0.6
  })
  return (
    <mesh ref={ref} position={pos}>
      <sphereGeometry args={[r, 48, 48]} />
      <meshPhysicalMaterial
        transmission={1}
        thickness={0.4}
        roughness={0.04}
        ior={1.33}
        metalness={0}
        clearcoat={1}
        transparent
      />
    </mesh>
  )
}

function MicroDrops({ progress }) {
  const drops = useMemo(
    () => [
      { pos: [-1.7, 1.25, 0.6], r: 0.17, sp: 0.8 },
      { pos: [2.5, -0.5, 0.9], r: 0.11, sp: 1.1 },
      { pos: [-0.5, -1.45, 1.0], r: 0.14, sp: 0.6 },
      { pos: [2.1, 1.7, -0.4], r: 0.09, sp: 1.3 },
      { pos: [-2.3, -0.1, -0.3], r: 0.12, sp: 0.95 },
    ],
    []
  )
  return drops.map((d, i) => <MicroDrop key={i} {...d} progress={progress} />)
}

/* A soft halo "ripple" that expands + fades as the drop falls. */
function Ripple({ progress }) {
  const ref = useRef()
  useFrame(() => {
    const m = ref.current
    if (!m) return
    const p = progress.current
    const grow = THREE.MathUtils.clamp((p - 0.28) / 0.35, 0, 1)
    m.scale.setScalar(0.4 + grow * 2.2)
    m.material.opacity = Math.sin(grow * Math.PI) * 0.5
  })
  return (
    <mesh ref={ref} position={[1.05, -1.25, 0.2]}>
      <ringGeometry args={[0.7, 0.78, 64]} />
      <meshBasicMaterial color="#bfe1ef" transparent opacity={0} toneMapped={false} side={THREE.DoubleSide} />
    </mesh>
  )
}

function DropEnvironment() {
  return (
    <Environment resolution={256}>
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
  const add = useCart((s) => s.add)
  const introDone = useIntro((s) => s.done)

  /* Park the intro copy off-screen immediately so it can rise in once the
     preloader curtain lifts. Skipped entirely under reduced motion. */
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap.set('.dh__copy .word', { yPercent: 110 })
      gsap.set(['.dh__copy .eyebrow', '.dh__copy .lede', '.dh__cta'], { autoAlpha: 0, y: 18 })
    }, root)
    return () => ctx.revert()
  }, [])

  /* Choreograph the headline reveal to the moment the curtain finishes. */
  useEffect(() => {
    if (!introDone) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power4.out' } })
        .to('.dh__copy .eyebrow', { autoAlpha: 1, y: 0, duration: 0.6 })
        .to('.dh__copy .word', { yPercent: 0, duration: 1.1, stagger: 0.12 }, '-=0.25')
        .to('.dh__copy .lede', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.7')
        .to('.dh__cta', { autoAlpha: 1, y: 0, duration: 0.9 }, '-=0.7')
    }, root)
    return () => ctx.revert()
  }, [introDone])

  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
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
          root.current?.classList.toggle('dh--revealed', self.progress > 0.34)
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
            {/* brand-wash gradient the glass refracts + canvas backdrop */}
            <mesh position={[0, 0, -4]} scale={[46, 28, 1]}>
              <planeGeometry />
              <meshBasicMaterial toneMapped={false}>
                <GradientTexture stops={[0, 0.4, 0.6, 1]} colors={['#bfe1ef', '#e2f0f7', '#f6e7ef', '#f3cedb']} size={1024} />
              </meshBasicMaterial>
            </mesh>
            <Droplet progress={progress} />
            <MicroDrops progress={progress} />
            <Ripple progress={progress} />
            <DropEnvironment />
          </Canvas>
        </div>

        {/* Intro copy — fades out as you scroll into the product reveal */}
        <div className="container dh__copy">
          <span className="eyebrow">Raw Beauté · Made in Malaysia</span>
          <h1 className="dh__title">
            <span className="line">
              <span className="word">Hydration,</span>
            </span>
            <span className="line">
              <span className="word">
                <em>engineered.</em>
              </span>
            </span>
          </h1>
          <p className="lede">
            Plant-based, probiotic skincare that floods the skin with moisture and
            rebuilds the barrier — clinically gentle, visibly dewy.
          </p>
          <div className="dh__cta">
            <Magnetic className="dh__magnet">
              <Link to="/shop" className="btn">
                Shop the ritual
              </Link>
            </Magnetic>
            <Magnetic className="dh__magnet" strength={0.3}>
              <Link to="/about" className="textlink">
                Our science →
              </Link>
            </Magnetic>
          </div>
        </div>

        {/* Product reveal — emerges on scroll. (Swap the image for a clean
            transparent bottle / frame sequence once provided.) */}
        <div className="container dh__reveal">
          <div className="dh__reveal-media">
            <img src={flagship.img} alt={flagship.name} />
          </div>
          <div className="dh__reveal-info">
            <span className="eyebrow">{flagship.eyebrow}</span>
            <h2>{flagship.name}</h2>
            <p>The everyday first step — low-pH amino cleanse, probiotic ferment.</p>
            <div className="dh__reveal-cta">
              <button className="btn" onClick={() => add(flagship)}>
                Add to bag — {formatPrice(flagship.price)}
              </button>
              <Link to={`/product/${flagship.slug}`} className="textlink">
                Details →
              </Link>
            </div>
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
