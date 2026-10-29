"use client";

import { useEffect, useImperativeHandle, useRef, useState, type Ref } from "react";

// La balance (« mizan ») : l'assiette à gauche, les dirhams à droite.
// - `tilt` (-1 à 1) pilote l'inclinaison de l'extérieur : positif, l'assiette pèse plus lourd que le budget.
// - Sans `tilt`, la balance réagit aux objets déposés avec `drop`.
export type ScaleHandle = { drop: (side: "food" | "coin") => void; reset: () => void };

type Props = {
  tilt?: number;
  className?: string;
  label: string;
  handleRef?: Ref<ScaleHandle>;
  onCount?: (food: number, coins: number) => void;
};

const MAX_ITEMS = 9;

export default function Scale3D({ tilt, className = "", label, handleRef, onCount }: Props) {
  const host = useRef<HTMLDivElement>(null);
  const api = useRef<ScaleHandle | null>(null);
  const tiltRef = useRef<number | undefined>(tilt);
  const onCountRef = useRef(onCount);
  const [failed, setFailed] = useState(false);

  tiltRef.current = tilt;
  onCountRef.current = onCount;

  useImperativeHandle(handleRef, () => ({
    drop: (side) => api.current?.drop(side),
    reset: () => api.current?.reset(),
  }));

  useEffect(() => {
    const el = host.current;
    if (!el) return;
    let disposed = false;
    let cleanup = () => {};

    import("three").then((THREE) => {
      if (disposed) return;
      const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

      let renderer: InstanceType<typeof THREE.WebGLRenderer>;
      try {
        renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
      } catch {
        setFailed(true);
        return;
      }
      renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
      renderer.domElement.setAttribute("aria-hidden", "true");
      renderer.domElement.style.touchAction = "pan-y";
      el.appendChild(renderer.domElement);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
      camera.position.set(0, 3.2, 11);
      camera.lookAt(0, 2.1, 0);

      scene.add(new THREE.HemisphereLight(0xfff4e6, 0x6b4a3a, 1.6));
      const sun = new THREE.DirectionalLight(0xffffff, 2.2);
      sun.position.set(4, 8, 6);
      scene.add(sun);

      // Rendu « dessin animé » : 3 paliers de lumière.
      const ramp = new THREE.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, THREE.RedFormat);
      ramp.minFilter = ramp.magFilter = THREE.NearestFilter;
      ramp.needsUpdate = true;
      const toon = (color: number) => new THREE.MeshToonMaterial({ color, gradientMap: ramp });

      const brass = toon(0xd4a03c);
      const brassDark = toon(0xa8782a);
      const plate = toon(0xf6efe6);

      const root = new THREE.Group();
      scene.add(root);

      // Socle et colonne
      const base = new THREE.Mesh(new THREE.CylinderGeometry(1.1, 1.35, 0.3, 40), brassDark);
      base.position.y = 0.15;
      const column = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.16, 3.4, 20), brass);
      column.position.y = 2;
      const knob = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), brass);
      knob.position.y = 3.85;
      root.add(base, column, knob);

      // Ombre douce au sol
      const shadowCanvas = document.createElement("canvas");
      shadowCanvas.width = shadowCanvas.height = 64;
      const sctx = shadowCanvas.getContext("2d")!;
      const grad = sctx.createRadialGradient(32, 32, 2, 32, 32, 32);
      grad.addColorStop(0, "rgba(0,0,0,0.35)");
      grad.addColorStop(1, "rgba(0,0,0,0)");
      sctx.fillStyle = grad;
      sctx.fillRect(0, 0, 64, 64);
      const shadow = new THREE.Mesh(
        new THREE.PlaneGeometry(7.5, 2.4),
        new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(shadowCanvas), transparent: true, depthWrite: false }),
      );
      shadow.rotation.x = -Math.PI / 2;
      shadow.position.y = 0.01;
      root.add(shadow);

      // Fléau
      const beam = new THREE.Group();
      beam.position.y = 3.6;
      root.add(beam);
      const bar = new THREE.Mesh(new THREE.BoxGeometry(5.4, 0.14, 0.16), brass);
      beam.add(bar);

      const makePan = (x: number) => {
        const hanger = new THREE.Group();
        hanger.position.x = x;
        beam.add(hanger);
        const ring = new THREE.Mesh(new THREE.TorusGeometry(0.1, 0.03, 8, 20), brassDark);
        hanger.add(ring);
        for (const a of [0, (2 * Math.PI) / 3, (4 * Math.PI) / 3]) {
          const end = new THREE.Vector3(Math.cos(a) * 0.85, -1.7, Math.sin(a) * 0.85);
          const len = end.length();
          const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, len, 6), brassDark);
          cord.position.copy(end.clone().multiplyScalar(0.5));
          cord.quaternion.setFromUnitVectors(new THREE.Vector3(0, -1, 0), end.clone().normalize());
          hanger.add(cord);
        }
        const dish = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 0.75, 0.14, 40), plate);
        dish.position.y = -1.75;
        const rim = new THREE.Mesh(new THREE.TorusGeometry(0.98, 0.05, 10, 48), brass);
        rim.rotation.x = Math.PI / 2;
        rim.position.y = -1.68;
        hanger.add(dish, rim);
        const load = new THREE.Group();
        load.position.y = -1.67;
        hanger.add(load);
        return { hanger, load };
      };
      const left = makePan(-2.5);
      const right = makePan(2.5);

      // Aliments et pièces
      const foods = [
        () => {
          const g = new THREE.Group();
          const t = new THREE.Mesh(new THREE.SphereGeometry(0.3, 24, 16), toon(0xe0402f));
          t.scale.y = 0.85;
          const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.12, 5), toon(0x3f8f3a));
          leaf.position.y = 0.27;
          g.add(t, leaf);
          return { obj: g, h: 0.5 };
        },
        () => {
          const e = new THREE.Mesh(new THREE.SphereGeometry(0.22, 24, 16), toon(0xf3e2c4));
          e.scale.y = 1.3;
          return { obj: e, h: 0.55 };
        },
        () => {
          const c = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.8, 16), toon(0xf08a24));
          c.rotation.z = Math.PI / 2;
          return { obj: c, h: 0.24 };
        },
        () => {
          const g = new THREE.Group();
          const m = new THREE.Mesh(new THREE.BoxGeometry(0.55, 0.22, 0.38), toon(0xb8473b));
          const fat = new THREE.Mesh(new THREE.BoxGeometry(0.56, 0.06, 0.39), toon(0xf4ddd0));
          fat.position.y = 0.12;
          g.add(m, fat);
          return { obj: g, h: 0.28 };
        },
        () => {
          const l = new THREE.Mesh(new THREE.SphereGeometry(0.26, 20, 14), toon(0x7fb24a));
          l.scale.set(1, 0.75, 1);
          return { obj: l, h: 0.4 };
        },
      ];
      const coinMat = toon(0xf2c14e);
      const coinGeo = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);

      type Item = { obj: InstanceType<typeof THREE.Object3D>; targetY: number; y: number; v: number; landed: boolean };
      const items: Item[] = [];
      let foodCount = 0;
      let coinCount = 0;
      let foodHeight = 0;
      let foodIndex = 0;

      const spots = [
        [0, 0], [-0.42, 0.2], [0.42, -0.2], [0.05, 0.42], [-0.2, -0.4], [0.45, 0.28], [-0.48, -0.15], [0.2, -0.45], [-0.05, 0.05],
      ];

      const drop = (side: "food" | "coin") => {
        if (side === "food" && foodCount >= MAX_ITEMS) return;
        if (side === "coin" && coinCount >= MAX_ITEMS * 2) return;
        let obj: InstanceType<typeof THREE.Object3D>;
        let targetY: number;
        if (side === "food") {
          const f = foods[foodIndex++ % foods.length]();
          obj = f.obj;
          const [sx, sz] = spots[foodCount];
          obj.position.set(sx, 0, sz);
          obj.rotation.y = Math.random() * Math.PI;
          targetY = f.h / 2 + (foodCount >= 5 ? 0.25 : 0);
          foodHeight = Math.max(foodHeight, targetY);
          left.load.add(obj);
          foodCount++;
        } else {
          obj = new THREE.Mesh(coinGeo, coinMat);
          const stack = coinCount % 3;
          const level = Math.floor(coinCount / 3);
          obj.position.set((stack - 1) * 0.5, 0, stack === 1 ? 0.25 : -0.15);
          obj.rotation.y = Math.random();
          targetY = 0.04 + level * 0.085;
          right.load.add(obj);
          coinCount++;
        }
        const it: Item = { obj, targetY, y: reduce ? targetY : targetY + 3, v: 0, landed: reduce };
        obj.position.y = it.y;
        items.push(it);
        onCountRef.current?.(foodCount, coinCount);
        wake();
      };

      const reset = () => {
        for (const it of items) it.obj.parent?.remove(it.obj);
        items.length = 0;
        foodCount = coinCount = 0;
        foodHeight = 0;
        onCountRef.current?.(0, 0);
        wake();
      };
      api.current = { drop, reset };

      // État de la boucle d'animation (déclaré avant tout appel à wake()).
      let raf = 0;
      let running = false;
      let visible = true;
      let last = performance.now();
      let idleFrames = 0;

      // Inclinaison du fléau : ressort amorti vers la cible.
      let angle = 0;
      let velocity = 0;
      let pointerX = 0;
      let yaw = 0;
      const targetAngle = () => {
        const t = tiltRef.current;
        const balance = t !== undefined ? Math.max(-1, Math.min(1, t)) : Math.max(-1, Math.min(1, (foodCount * 2 - coinCount) / 8));
        return balance * 0.32; // positif = côté assiette (gauche) plus bas
      };

      const resize = () => {
        const w = el.clientWidth;
        const h = el.clientHeight;
        if (!w || !h) return;
        renderer.setSize(w, h, false);
        renderer.domElement.style.width = "100%";
        renderer.domElement.style.height = "100%";
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        wake();
      };
      const ro = new ResizeObserver(resize);
      ro.observe(el);
      resize();

      const onPointer = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        pointerX = ((e.clientX - r.left) / r.width) * 2 - 1;
        wake();
      };
      const onLeave = () => {
        pointerX = 0;
        wake();
      };
      el.addEventListener("pointermove", onPointer);
      el.addEventListener("pointerleave", onLeave);

      function frame(now: number) {
        const dt = Math.min(0.05, (now - last) / 1000);
        last = now;
        const target = targetAngle();
        if (reduce) {
          angle = target;
          velocity = 0;
        } else {
          velocity += ((target - angle) * 28 - velocity * 5.5) * dt;
          angle += velocity * dt;
        }
        beam.rotation.z = angle;
        left.hanger.rotation.z = -angle;
        right.hanger.rotation.z = -angle;

        const sway = reduce ? 0 : Math.sin(now / 1600) * 0.12;
        yaw += (pointerX * 0.45 + sway - yaw) * Math.min(1, dt * 4);
        root.rotation.y = yaw;

        let moving = Math.abs(target - angle) > 0.0005 || Math.abs(velocity) > 0.0005;
        for (const it of items) {
          if (it.landed) continue;
          it.v -= 18 * dt;
          it.y += it.v * dt;
          if (it.y <= it.targetY) {
            it.y = it.targetY;
            if (Math.abs(it.v) > 2) {
              it.v = -it.v * 0.28;
              velocity += (it.obj.parent === left.load ? 1 : -1) * 0.25;
            } else {
              it.landed = true;
            }
          }
          it.obj.position.y = it.y;
          moving = true;
        }
        renderer.render(scene, camera);

        // Hors animation réduite, la balance « respire » en continu ; sinon on s'arrête dès qu'elle est stable.
        idleFrames = moving ? 0 : idleFrames + 1;
        if (visible && (!reduce || idleFrames < 2)) raf = requestAnimationFrame(frame);
        else running = false;
      }
      function wake() {
        if (running || !visible) return;
        running = true;
        last = performance.now();
        raf = requestAnimationFrame(frame);
      }

      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting && !document.hidden;
        if (visible) wake();
      });
      io.observe(el);
      const onVis = () => {
        visible = !document.hidden;
        if (visible) wake();
      };
      document.addEventListener("visibilitychange", onVis);
      wake();

      cleanup = () => {
        cancelAnimationFrame(raf);
        ro.disconnect();
        io.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        el.removeEventListener("pointermove", onPointer);
        el.removeEventListener("pointerleave", onLeave);
        scene.traverse((o) => {
          const m = o as InstanceType<typeof THREE.Mesh>;
          if (m.isMesh) {
            m.geometry.dispose();
            const mats = Array.isArray(m.material) ? m.material : [m.material];
            mats.forEach((mat) => mat.dispose());
          }
        });
        ramp.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        api.current = null;
      };
      // Relance l'animation quand la cible pilotée change.
      (el as HTMLDivElement & { __wake?: () => void }).__wake = wake;
    });

    return () => {
      disposed = true;
      cleanup();
    };
  }, []);

  // Une nouvelle inclinaison pilotée réveille la boucle d'animation.
  useEffect(() => {
    (host.current as (HTMLDivElement & { __wake?: () => void }) | null)?.__wake?.();
  }, [tilt]);

  return (
    <div ref={host} role="img" aria-label={label} className={`relative ${className}`}>
      {failed && (
        <span aria-hidden="true" className="absolute inset-0 grid place-items-center text-8xl">
          ⚖️
        </span>
      )}
    </div>
  );
}
