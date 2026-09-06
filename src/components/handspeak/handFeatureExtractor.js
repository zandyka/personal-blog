/**
 * HandFeatureExtractor
 * Porting dari hand_feature_extractor.dart
 * Menghasilkan vektor fitur 176-dimensi untuk klasifikasi huruf BISINDO (A-Z).
 */

export class HandFeatureExtractor {
  /**
   * Ekstraksi 176 fitur dari hasil deteksi tangan MediaPipe
   * Struktur vektor: [LeftLm(63), RightLm(63), LeftD(25), RightD(25)]
   */
  static buildFeature176(hands) {
    let leftLm = new Array(63).fill(0.0);
    let rightLm = new Array(63).fill(0.0);
    let leftD = new Array(25).fill(0.0);
    let rightD = new Array(25).fill(0.0);

    for (const hand of hands) {
      if (!hand.landmarks || hand.landmarks.length < 21) continue;

      const xyz = hand.landmarks.map((p) => [p.x, p.y, p.z]);

      const normed = this.normalizeHand(xyz);
      const flat63 = normed.flat();
      const d25 = this.distanceFeatures(normed);

      const handedness = hand.handedness;

      if (handedness === 'Left') {
        leftLm = flat63;
        leftD = d25;
      } else if (handedness === 'Right') {
        rightLm = flat63;
        rightD = d25;
      } else {
        const leftEmpty = leftLm.every((v) => v === 0.0);
        if (leftEmpty) {
          leftLm = flat63;
          leftD = d25;
        } else {
          rightLm = flat63;
          rightD = d25;
        }
      }
    }

    return [...leftLm, ...rightLm, ...leftD, ...rightD];
  }

  /**
   * Mengurutkan tangan dari kiri ke kanan berdasarkan koordinat X wrist
   */
  static normalizeHandsOrder(hands) {
    if (hands.length <= 1) return hands;
    return [...hands].sort((a, b) => a.landmarks[0].x - b.landmarks[0].x);
  }

  /**
   * Koreksi fitur untuk kamera depan (mirroring webcam):
   * 1. Negasi koordinat sumbu X pada landmark
   * 2. Menukar tangan kiri dan kanan agar sesuai orientasi dataset training
   */
  static correctFrontCameraFeatures(features) {
    if (features.length !== 176) return features;

    const leftLm = features.slice(0, 63);
    const rightLm = features.slice(63, 126);
    const leftD = features.slice(126, 151);
    const rightD = features.slice(151, 176);

    const negateX = (lm) => {
      const res = [...lm];
      for (let i = 0; i < res.length; i += 3) {
        res[i] = -res[i];
      }
      return res;
    };

    const correctedLeftLm = negateX(leftLm);
    const correctedRightLm = negateX(rightLm);

    // Swap kiri dan kanan
    return [
      ...correctedRightLm,
      ...correctedLeftLm,
      ...rightD,
      ...leftD,
    ];
  }

  /**
   * Normalisasi koordinat:
   * Wrist (landmark 0) sebagai origin (0,0,0)
   * Dibagi jarak terjauh agar scale-invariant (jarak tangan ke kamera bebas)
   */
  static normalizeHand(xyz) {
    const wrist = xyz[0];
    const centered = xyz.map((p) => [
      p[0] - wrist[0],
      p[1] - wrist[1],
      p[2] - wrist[2],
    ]);

    let maxDist = 0.0;
    for (const p of centered) {
      const d = Math.sqrt(p[0] * p[0] + p[1] * p[1] + p[2] * p[2]);
      if (d > maxDist) maxDist = d;
    }
    if (maxDist < 1e-9) maxDist = 1.0;

    return centered.map((p) => [
      p[0] / maxDist,
      p[1] / maxDist,
      p[2] / maxDist,
    ]);
  }

  /**
   * Ekstraksi 25 fitur jarak geometris per tangan:
   * - 10 jarak antar ujung jari (tip-to-tip)
   * - 5 jarak ujung jari ke pergelangan tangan (tip-to-wrist)
   * - 5 jarak MCP (buku jari) ke pergelangan tangan (mcp-to-wrist)
   * - 5 jarak ujung jari ke MCP masing-masing (finger length)
   */
  static distanceFeatures(hand) {
    const wrist = 0;
    const thumbTip = 4;
    const indexTip = 8;
    const middleTip = 12;
    const ringTip = 16;
    const pinkyTip = 20;

    const thumbMcp = 2;
    const indexMcp = 5;
    const middleMcp = 9;
    const ringMcp = 13;
    const pinkyMcp = 17;

    const dist = (a, b) => {
      const dx = hand[a][0] - hand[b][0];
      const dy = hand[a][1] - hand[b][1];
      const dz = hand[a][2] - hand[b][2];
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
    };

    const feats = [];
    const tips = [thumbTip, indexTip, middleTip, ringTip, pinkyTip];

    // 10 jarak antar ujung jari
    for (let i = 0; i < tips.length; i++) {
      for (let j = i + 1; j < tips.length; j++) {
        feats.push(dist(tips[i], tips[j]));
      }
    }

    // 5 jarak ujung jari ke pergelangan
    for (const t of tips) {
      feats.push(dist(t, wrist));
    }

    // 5 jarak MCP ke pergelangan
    const mcps = [thumbMcp, indexMcp, middleMcp, ringMcp, pinkyMcp];
    for (const m of mcps) {
      feats.push(dist(m, wrist));
    }

    // 5 jarak ujung jari ke MCP sendiri
    const pairs = [
      [thumbTip, thumbMcp],
      [indexTip, indexMcp],
      [middleTip, middleMcp],
      [ringTip, ringMcp],
      [pinkyTip, pinkyMcp],
    ];

    for (const p of pairs) {
      feats.push(dist(p[0], p[1]));
    }

    return feats;
  }
}