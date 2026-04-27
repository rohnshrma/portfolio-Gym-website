import { useCallback, useMemo } from 'react'
import Particles from '@tsparticles/react'
import { loadSlim } from '@tsparticles/slim'

function ThemeParticles() {
  const particlesInit = useCallback(async (engine) => {
    await loadSlim(engine)
  }, [])

  const options = useMemo(
    () => ({
      background: { color: { value: 'transparent' } },
      fullScreen: { enable: true, zIndex: 0 },
      fpsLimit: 60,
      detectRetina: true,
      particles: {
        number: { value: 90, density: { enable: true, area: 900 } },
        color: { value: ['#31ffc6', '#4ce5ff', '#8defff'] },
        links: {
          enable: true,
          distance: 140,
          color: '#31ffc6',
          opacity: 0.15,
          width: 1,
        },
        move: {
          enable: true,
          speed: 1.1,
          direction: 'none',
          random: false,
          straight: false,
          outModes: { default: 'out' },
        },
        opacity: { value: { min: 0.1, max: 0.35 } },
        size: { value: { min: 1, max: 3.5 } },
      },
      interactivity: {
        events: {
          onHover: { enable: false, mode: 'grab' },
          resize: { enable: true },
        },
        modes: {
          grab: { distance: 180, links: { opacity: 0.32 } },
        },
      },
    }),
    [],
  )

  return <Particles id="theme-particles" init={particlesInit} options={options} />
}

export default ThemeParticles
