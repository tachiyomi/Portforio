//import React from 'react';
import * as THREE from 'three';
import * as TWEEN from 'tween';

import postVertexSource from './shaders/post.vert';
import postFragmentSource from './shaders/post.frag';

export default class Canvas {
  constructor() {
    // ウィンドウサイズ
    this.w = window.innerWidth;
    this.h = window.innerHeight;

    this.mouse = new THREE.Vector2(0, 0);

    // レンダラーを作成
    this.renderer = new THREE.WebGLRenderer({alpha: true});
    this.renderer.setSize(this.w, this.h); // 描画サイズ
    this.renderer.setPixelRatio(window.devicePixelRatio);
    //this.renderer.shadowMap.enabled = true;

    // #canvas-containerにレンダラーのcanvasを追加
    const container = document.getElementById('canvas-container');
    container.appendChild(this.renderer.domElement);

    this.baseCamera = new THREE.PerspectiveCamera(50, this.w / this.h, 0.1, 1000);
    this.baseCamera.position.z = 20;

    // シーンを作成
    this.baseScene = new THREE.Scene();

    // ライトを作成
    this.ambient = new THREE.AmbientLight(0xffffff, 0.65);
    this.baseScene.add(this.ambient);

    this.light = new THREE.DirectionalLight(0xffffff, 0.35);
    this.light.position.set(0, 0, 0); // ライトの位置を設定
    this.light.shadow.mapSize.width = 512;
    this.light.shadow.mapSize.height = 512;
    this.light.shadow.camera.near = 1;
    this.light.shadow.camera.far = 800;
    //this.light.castShadow = true;

    // ライトをシーンに追加
    this.baseScene.add(this.light);

    // 立方体のジオメトリを作成(幅, 高さ, 奥行き)
    const baseGeometry = new THREE.BoxGeometry(15, 15, 15);
    //const baseMaterial = new THREE.ShaderMaterial({uniforms: this.baseUniforms, vertexShader: baseVertexSource, fragmentShader: baseFragmentSource});
    const baseMaterial = new THREE.MeshLambertMaterial({color: 0x3e60d4});
    this.targetBoxColor = new THREE.Color(0x3e60d4);

    // ジオメトリとマテリアルからメッシュを作成
    this.baseMesh = new THREE.Mesh(baseGeometry, baseMaterial);
    this.baseMesh.position.z = -100;
    //this.baseMesh.castShadow = true;
    this.light.target = this.baseMesh;

    // メッシュをシーンに追加
    this.baseScene.add(this.baseMesh);

    const flatGeometry = new THREE.PlaneGeometry(120, 100, 1, 1);
    const flatMaterial = new THREE.MeshLambertMaterial({color: 0xc0c0c0});
    this.targetFlatColor = new THREE.Color(0xc0c0c0);
    this.flatMesh = new THREE.Mesh(flatGeometry, flatMaterial);
    this.flatMesh.position.z = -300;
    //this.flatMesh.receiveShadow = true;
    this.baseScene.add(this.flatMesh);

    this.renderTarget = new THREE.WebGLRenderTarget(this.w, this.h, {
      magFilter: THREE.NearestFilter,
      minFilter: THREE.NearestFilter,
      wrapS: THREE.ClampToEdgeWrapping,
      wrapT: THREE.ClampToEdgeWrapping
    });

    this.postScene = new THREE.Scene();
    this.postCamera = new THREE.PerspectiveCamera(60, this.w / this.h, 0.1, 1000);
    this.postCamera.position.z = 20;
    const postGeometry = new THREE.Geometry();
    const aspect = this.w / this.h;
    postGeometry.vertices = [
      new THREE.Vector3(-1.0 * aspect, 1.0, 0.0),
      new THREE.Vector3(1.0 * aspect, 1.0, 0.0),
      new THREE.Vector3(-1.0 * aspect, -1.0, 0.0),
      new THREE.Vector3(1.0 * aspect, -1.0, 0.0)
    ];
    postGeometry.faces = [
      new THREE.Face3(0, 2, 1),
      new THREE.Face3(1, 2, 3)
    ];
    this.postUniforms = {
      uTex: {
        value: this.renderTarget
      },
      uTime: {
        value: 0.0
      }
    };
    const postMaterial = new THREE.ShaderMaterial({uniforms: this.postUniforms, vertexShader: postVertexSource, fragmentShader: postFragmentSource});
    this.postMesh = new THREE.Mesh(postGeometry, postMaterial);
    this.postScene.add(this.postMesh);

    this.animate();
    this.render();
  }

  changeColor(n) {
    switch (n) {
      case 1:
        this.targetBoxColor = new THREE.Color(0x43658b);
        break;
      case 2:
        this.targetBoxColor = new THREE.Color(0x519872);
        break;
      case 3:
        this.targetBoxColor = new THREE.Color(0xf1c5c5);
        break;
      case 4:
        this.targetBoxColor = new THREE.Color(0x99d8d0);
        break;
      case 5:
        this.targetBoxColor = new THREE.Color(0x856c8b);
        break;
      case 6:
        this.targetBoxColor = new THREE.Color(0x363636);
        break;
      default:
        this.targetBoxColor = new THREE.Color(0xffffff);
    }

    new TWEEN.Tween(this.baseMesh.material.color).to({
      r: this.targetBoxColor.r,
      g: this.targetBoxColor.g,
      b: this.targetBoxColor.b
    }, 1200).easing(TWEEN.Easing.Cubic.InOut).start();
  }

  resize() {
    this.w = window.innerWidth;
    this.h = window.innerHeight;
  }

  click() {
    this.baseMesh.material.wireframe = !this.baseMesh.material.wireframe;

    this.targetFlatColor = this.baseMesh.material.wireframe
      ? new THREE.Color(0x101010)
      : new THREE.Color(0xc0c0c0);
    //this.light.castShadow = !this.light.castShadow;
    new TWEEN.Tween(this.flatMesh.material.color).to({
      r: this.targetFlatColor.r,
      g: this.targetFlatColor.g,
      b: this.targetFlatColor.b
    }, 4000).easing(TWEEN.Easing.Back.InOut).start();
  }

  mousemove(x, y) {
    if (!this.baseMesh.material.wireframe) {
      this.mouse.x = x - (this.w / 2);
      this.mouse.y = -y + (this.h / 2);
    } else {
      this.mouse.x = 0;
      this.mouse.y = 0;
    }

    this.light.position.x = this.mouse.x;
    this.light.position.y = this.mouse.y;
  }

  animate() {
    TWEEN.update();
  }

  render() {
    requestAnimationFrame(() => {
      this.animate();
      this.render();
    });

    const sec = performance.now() / 1000;
    //this.postUniforms.uTime.value = sec;

    //this.postUniforms.uMouse.value.lerp(this.mouse, 0.3);

    this.baseMesh.rotation.x = sec / 4;
    this.baseMesh.rotation.z = sec / 4;

    //this.renderer.setRenderTarget(this.renderTarget);
    //this.renderer.setClearColor(new THREE.Color(0xffffff), 1.0);
    this.renderer.render(this.baseScene, this.baseCamera);

    //this.renderer.setRenderTarget(null);
    //this.renderer.setClearColor(new THREE.Color(0x000000), 1.0);
    //this.renderer.render(this.postScene, this.postCamera);
  }
};
