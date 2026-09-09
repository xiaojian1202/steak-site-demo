// Tasteful WebGL image treatment: a single plane + shader, not a scene.
// Renders `img` onto `canvas` and ripples the texture UVs around the
// pointer on hover — a premium micro-interaction, not a 3D showpiece.
import * as THREE from 'three'

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`

const fragmentShader = /* glsl */ `
  uniform sampler2D uTexture;
  uniform vec2 uMouse;
  uniform float uStrength;
  varying vec2 vUv;

  void main() {
    vec2 uv = vUv;
    float dist = distance(uv, uMouse);
    float ripple = sin(dist * 28.0 - uStrength * 6.0) * 0.02 * uStrength;
    vec2 dir = normalize(uv - uMouse + 0.0001);
    uv += dir * ripple;
    gl_FragColor = texture2D(uTexture, uv);
  }
`

export class WebGLImageDistort {
  private renderer: THREE.WebGLRenderer
  private scene = new THREE.Scene()
  private camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1)
  private material: THREE.ShaderMaterial
  private strength = 0
  private targetStrength = 0
  private raf = 0
  private destroyed = false

  constructor(canvas: HTMLCanvasElement, img: HTMLImageElement) {
    this.renderer = new THREE.WebGLRenderer({canvas, alpha: true, antialias: true})
    const texture = new THREE.Texture(img)
    texture.needsUpdate = true

    this.material = new THREE.ShaderMaterial({
      uniforms: {
        uTexture: {value: texture},
        uMouse: {value: new THREE.Vector2(0.5, 0.5)},
        uStrength: {value: 0},
      },
      vertexShader,
      fragmentShader,
    })
    this.scene.add(new THREE.Mesh(new THREE.PlaneGeometry(2, 2), this.material))

    this.resize()
    canvas.addEventListener('pointermove', this.onPointerMove)
    canvas.addEventListener('pointerenter', this.onPointerEnter)
    canvas.addEventListener('pointerleave', this.onPointerLeave)
    this.tick()
  }

  private onPointerMove = (event: PointerEvent) => {
    const rect = this.renderer.domElement.getBoundingClientRect()
    const x = (event.clientX - rect.left) / rect.width
    const y = 1 - (event.clientY - rect.top) / rect.height
    this.material.uniforms.uMouse.value.set(x, y)
  }

  private onPointerEnter = () => {
    this.targetStrength = 1
  }

  private onPointerLeave = () => {
    this.targetStrength = 0
  }

  resize() {
    const {clientWidth, clientHeight} = this.renderer.domElement
    this.renderer.setSize(clientWidth, clientHeight, false)
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
  }

  private tick = () => {
    if (this.destroyed) return
    this.strength += (this.targetStrength - this.strength) * 0.08
    this.material.uniforms.uStrength.value = this.strength
    this.renderer.render(this.scene, this.camera)
    this.raf = requestAnimationFrame(this.tick)
  }

  destroy() {
    this.destroyed = true
    cancelAnimationFrame(this.raf)
    const canvas = this.renderer.domElement
    canvas.removeEventListener('pointermove', this.onPointerMove)
    canvas.removeEventListener('pointerenter', this.onPointerEnter)
    canvas.removeEventListener('pointerleave', this.onPointerLeave)
    this.material.dispose()
    this.renderer.dispose()
  }
}
