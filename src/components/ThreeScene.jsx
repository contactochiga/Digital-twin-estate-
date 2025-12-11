import React, {useEffect, useRef} from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function ThreeScene(){
  const containerRef = useRef();

  useEffect(()=>{
    const container = containerRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeef2f5);

    const renderer = new THREE.WebGLRenderer({antialias:true});
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const camera = new THREE.PerspectiveCamera(35, container.clientWidth/container.clientHeight, 0.1, 2000);
    camera.position.set(40, 30, 60);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0,6,0);
    controls.update();

    // lights
    const hemi = new THREE.HemisphereLight(0xffffff, 0x444444, 0.9);
    hemi.position.set(0,50,0);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 0.7);
    dir.position.set(-20,30,10);
    scene.add(dir);

    const grid = new THREE.GridHelper(120, 24, 0xcccccc, 0xcccccc);
    grid.position.y = 0;
    scene.add(grid);

    const building = new THREE.Group();
    scene.add(building);

    // fetch inventory (local JSON)
    let inventory = null;
    fetch("/PT1_inventory.json").then(r=>r.json()).then(j=>{
      inventory = j;
      buildFromInventory(j);
    }).catch(err=>{
      // fallback - small sample inventory
      inventory = {
        "footprint_m": {"width":24,"depth":20},
        "floors":[
          {"floor":1,"units":[{"uid":"OCH-PT1-F01-A","type":"3B"},{"uid":"OCH-PT1-F01-B","type":"2B"},{"uid":"OCH-PT1-F01-C","type":"3B"},{"uid":"OCH-PT1-F01-D","type":"2B"}]},
          {"floor":2,"units":[{"uid":"OCH-PT1-F02-A","type":"3B"},{"uid":"OCH-PT1-F02-B","type":"2B"},{"uid":"OCH-PT1-F02-C","type":"3B"},{"uid":"OCH-PT1-F02-D","type":"2B"}]},
          {"floor":3,"units":[{"uid":"OCH-PT1-F03-A","type":"3B"},{"uid":"OCH-PT1-F03-B","type":"2B"},{"uid":"OCH-PT1-F03-C","type":"3B"},{"uid":"OCH-PT1-F03-D","type":"2B"}]},
          {"floor":4,"units":[{"uid":"OCH-PT1-F04-A","type":"3B"},{"uid":"OCH-PT1-F04-B","type":"2B"},{"uid":"OCH-PT1-F04-C","type":"3B"},{"uid":"OCH-PT1-F04-D","type":"2B"}]},
          {"floor":5,"units":[{"uid":"OCH-PT1-F05-A","type":"3B"},{"uid":"OCH-PT1-F05-B","type":"2B"},{"uid":"OCH-PT1-F05-C","type":"3B"},{"uid":"OCH-PT1-F05-D","type":"2B"}]}
        ]
      };
      buildFromInventory(inventory);
    });

    // Materials
    const matWall = new THREE.MeshStandardMaterial({color:0xf7f4f1});
    const matOrange = new THREE.MeshStandardMaterial({color:0xe8602f});
    const matBal = new THREE.MeshStandardMaterial({color:0xdddddd});
    const matGlass = new THREE.MeshStandardMaterial({color:0x7fa7ff, opacity:0.9, transparent:true});

    const clickable = [];

    function buildFromInventory(inventory){
      const footprintW = inventory.footprint_m.width;
      const footprintD = inventory.footprint_m.depth;
      const floorHeight = 3.2;
      const floors = inventory.floors.length;
      const coreWidth = 4;
      const usableWidth = footprintW - coreWidth;
      const blockWidth = usableWidth/2;
      const unitWidth = blockWidth / 2;
      const unitDepth = footprintD;

      // core
      const coreGeom = new THREE.BoxGeometry(coreWidth, floors*floorHeight+0.2, footprintD);
      const coreMesh = new THREE.Mesh(coreGeom, new THREE.MeshStandardMaterial({color:0xeeeeee}));
      coreMesh.position.set(0, floors*floorHeight/2, 0);
      building.add(coreMesh);

      for(let f=0; f<floors; f++){
        const floorY = (f+0.5) * floorHeight;
        const floorGroup = new THREE.Group();
        floorGroup.name = "floor-"+(f+1);
        floorGroup.position.y = floorY;

        const leftBlockOriginX = -(coreWidth/2 + blockWidth/2);
        const rightBlockOriginX = (coreWidth/2 + blockWidth/2);

        const unitPositions = [
          {x: leftBlockOriginX - blockWidth/2 + unitWidth/2, idSuffix:"A"},
          {x: leftBlockOriginX - blockWidth/2 + unitWidth*1.5, idSuffix:"B"},
          {x: rightBlockOriginX - blockWidth/2 + unitWidth/2, idSuffix:"C"},
          {x: rightBlockOriginX - blockWidth/2 + unitWidth*1.5, idSuffix:"D"},
        ];

        for(let u=0; u<4; u++){
          const pos = unitPositions[u];
          const w = unitWidth - 0.15;
          const h = floorHeight * 0.95;
          const d = unitDepth - 0.15;
          const geom = new THREE.BoxGeometry(w, h, d);
          const mesh = new THREE.Mesh(geom, matWall.clone());
          // local group
          const unitGroup = new THREE.Group();
          const balDepth = 1.4;
          const balGeom = new THREE.BoxGeometry(w*0.95, 0.18, balDepth);
          const bal = new THREE.Mesh(balGeom, matBal);
          bal.position.set(0, -(floorHeight/2) + 0.18/2 + 0.02, -(d/2 + balDepth/2 - 0.05));
          const orangeGeom = new THREE.BoxGeometry(w*0.95, h*0.6, 0.1);
          const orange = new THREE.Mesh(orangeGeom, matOrange);
          orange.position.set(0, 0.28, -(d/2 - 0.02));
          const winGeom = new THREE.PlaneGeometry(w*0.6, h*0.4);
          const win = new THREE.Mesh(winGeom, matGlass);
          win.position.set(0, 0.15, -(d/2 - 0.06));

          unitGroup.add(mesh);
          unitGroup.add(bal);
          unitGroup.add(orange);
          unitGroup.add(win);

          // meta
          const unitMeta = inventory.floors[f].units[u];
          unitGroup.userData = {
            uid: unitMeta.uid,
            unitType: unitMeta.type,
            floor: f+1,
            meters: unitMeta.meters || {},
            ont: unitMeta.ont || null
          };

          // small label
          const canvas = document.createElement('canvas');
          canvas.width = 256; canvas.height = 64;
          const ctx = canvas.getContext('2d');
          ctx.fillStyle = 'rgba(255,255,255,0.0)'; ctx.fillRect(0,0,256,64);
          ctx.fillStyle = '#111'; ctx.font = 'bold 20px Arial'; ctx.fillText(unitMeta.uid.split('-').slice(-1)[0], 8, 36);
          const tex = new THREE.CanvasTexture(canvas);
          const sprite = new THREE.Sprite(new THREE.SpriteMaterial({map:tex}));
          sprite.scale.set(6, 1.5, 1);
          sprite.position.set(0, h/2 - 0.5, d/2 + 0.5);
          unitGroup.add(sprite);

          unitGroup.position.set(pos.x, 0, 0);
          floorGroup.add(unitGroup);

          clickable.push(unitGroup);
        }

        building.add(floorGroup);
      }

      // dispatch event to UI listing ready if needed
      window.dispatchEvent(new CustomEvent("ochiga-scene-ready"));
    }

    // raycaster & clicks
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let selected = null;

    function onPointerDown(event){
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = - ((event.clientY - rect.top) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(clickable, true);
      if(intersects.length > 0){
        let o = intersects[0].object;
        while(o && !o.userData?.uid) { o = o.parent; }
        if(o){
          // highlight scale
          if(selected && selected !== o) selected.scale.set(1,1,1);
          selected = o;
          selected.scale.set(1.03,1.03,1.03);
          // send event to UI
          window.dispatchEvent(new CustomEvent("ochiga-select-unit", {detail: selected.userData}));
        }
      }
    }

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // focus floor based on UI clicks
    function onFocusFloor(e){
      const floor = e.detail;
      const y = (floor - 0.5) * 3.2;
      controls.target.set(0, y + 0.8, 0);
      controls.update();
    }
    window.addEventListener("ochiga-focus-floor", onFocusFloor);

    // resize handling
    function onWindowResize(){
      renderer.setSize(container.clientWidth, container.clientHeight);
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
    }
    window.addEventListener("resize", onWindowResize);

    // animate
    function animate(){ requestAnimationFrame(animate); renderer.render(scene, camera); }
    animate();

    // cleanup
    return () => {
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("resize", onWindowResize);
      window.removeEventListener("ochiga-focus-floor", onFocusFloor);
      container.removeChild(renderer.domElement);
      // dispose scene
    };
  }, []);

  return <div ref={containerRef} style={{width:"100%", height:"100%"}} />;
}
