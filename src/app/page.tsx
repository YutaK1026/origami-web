"use client";
// pages/index.js
import { useEffect } from 'react';
import * as THREE from 'three';

export default function Home() {
  useEffect(() => {
    // シーンのセットアップ
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    // ライトを追加
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(0, 1, 1).normalize();
    scene.add(light);

    // 紙（平面）のジオメトリを作成（200x200サイズ相当）
    const geometry = new THREE.PlaneGeometry(2, 2, 10, 10); // 200px相当のサイズ、10x10の分割で柔軟に折れるようにする
    const frontMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000, side: THREE.DoubleSide }); // 表: 赤
    const backMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff, side: THREE.DoubleSide }); // 裏: 青
    const plane = new THREE.Mesh(geometry, [frontMaterial, backMaterial]);
    scene.add(plane);

    // カメラ位置の調整
    camera.position.z = 5;

    // 折り動作の準備
    let foldAngle = 0; // 初期角度
    const targetFoldAngle = Math.PI * (140 / 180); // 140度に折る（ラジアン）

    // 紙を折り曲げる関数
    const foldPaper = (angle: number) => {
      const position = plane.geometry.attributes.position;

      // 真ん中を軸にして、y > 0の部分を折り曲げる
      for (let i = 0; i < position.count; i++) {
        const y = position.getY(i);

        // 折り目を中心に、上側の頂点を回転させる
        if (y > 0) {
          const z = position.getZ(i);
          const newY = Math.cos(angle) * y - Math.sin(angle) * z;
          const newZ = Math.sin(angle) * y + Math.cos(angle) * z;
          position.setY(i, newY);
          position.setZ(i, newZ);
        }
      }
      position.needsUpdate = true; // ジオメトリを更新
    };

    // アニメーションの作成
    const animate = () => {
      requestAnimationFrame(animate);

      // 140度まで折り曲げる
      if (foldAngle < targetFoldAngle) {
        foldAngle += 0.01; // 徐々に角度を増やす
        foldPaper(foldAngle);
      }

      renderer.render(scene, camera);
    };

    // アニメーション開始
    animate();

    // クリーンアップ
    return () => {
      document.body.removeChild(renderer.domElement);
    };
  }, []);

  return null;  // 描画はThree.jsで行うため、JSXは不要
}