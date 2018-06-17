import * as THREE from "./threeTest/node_modules/three/build/three.module.js"
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(
  45, window.innerWidth/window.innerHeight, 0.1, 1000
 )
const renderer = new THREE.WebGLRenderer()
 


const initStats =()=>{
  const stats = new Stats()
  stats.setMode(0)
  stats.domElement.style.position = "absolute"
  stats.domElement.style.left = "0px"
  stats.domElement.style.top = "0px"
  document.getElementById("Stats-output").appendChild(stats.domElement)
  return stats
}
const onResize =()=>{
  camera.aspect = window.innerWidth/window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(innerWidth, innerHeight)
}

const init=()=>{
  const stats = initStats()
  renderer.setClearColor(new THREE.Color(0xEEEEEE))
  renderer.setSize(window.innerWidth, window.innerHeight)
  renderer.shadowMap.enabled = true

  const axes = new THREE.AxesHelper(20)
  scene.add(axes)
 
  const planeGeometry = new THREE.PlaneGeometry(60, 20)
  const planeMaterial = new THREE.MeshLambertMaterial({
    color: 0xffffff  })
  const plane = new THREE.Mesh(planeGeometry, planeMaterial)

  plane.rotation.x = - 0.5 * Math.PI
  plane.position.x = 15
  plane.position.y = 0
  plane.position.z = 0
  plane.receiveShadow = true
  scene.add(plane)

  const N = 8 
  const d = 360/N
  const x = [...Array(N)].map((v,i)=>5*Math.cos(i*d/180*Math.PI))
  const y = [0,10] 
  const z = [...Array(N)].map((v,i)=>5*Math.sin(i*d/180*Math.PI))


  const points = y.map((y0,i)=>
    x.map((x0,j)=>[x0, y0, z[j]])
  )
  console.log(points)
  const pointLine = [].concat(...points)
  const vertices= pointLine.map(v=>new THREE.Vector3(v[0], v[1],v[2]))

  const faceList = [...Array(points.length-1)].map((p,i)=>{
    const j0  =  N*i
    const section = [...Array(N)].map((v,j)=>{
      const face1 = new THREE.Face3(j0+j,j0+j+N, (j+1>N-1 ? j0+0 : j0+j+1))
      const face2 = new THREE.Face3(j0+j,(j==0 ? j0+2*N-1:j0+j+N-1),j0+j+N)
      const face = [face1, face2]
      return face
    })
    return [].concat(...section)
  })
  const faces = [].concat(...faceList)

  const geom = new THREE.Geometry()
  geom.vertices = vertices
  geom.faces = faces
  geom.computeFaceNormals()

  const cylinderMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff, side:THREE.DoubleSide, wireframe: false 
  })
  const cylinder =  new THREE.Mesh(geom, cylinderMaterial)

  cylinder.position.x = 0 
  cylinder.position.y = 0 
  cylinder.position.z = 0 

  cylinder.castShadow = true

  scene.add(cylinder)

  const spotLight = new THREE.SpotLight(0xffffff)
  spotLight.position.set(-20, 30, -5)

  spotLight.castShadow = true

  scene.add(spotLight)

  camera.position.x = -20
  camera.position.y = 40
  camera.position.z = 30
  camera.lookAt(scene.position)

  const controls = {
    rotationSpeed :0.02,
    bouncingSpeed : 0.03
  }
  const gui = new dat.GUI()
  gui.add(controls, "rotationSpeed", 0, 0.5)
  gui.add(controls, "bouncingSpeed", 0, 0.5)

  document.getElementById("WebGL-output").appendChild(renderer.domElement)
  window.addEventListener("resize",onResize,false)

  renderer.render(scene, camera)
}


init()
