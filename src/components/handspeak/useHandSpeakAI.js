import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as tf from '@tensorflow/tfjs';
import { loadDenseModelFromBin } from './bisindoModelLoader';
import { HandFeatureExtractor } from './handFeatureExtractor';
import {
  BISINDO_LETTER_LABELS,
  BISINDO_WORD_LABELS_38,
  BISINDO_LABELS,
} from './labels';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16],// Ring
  [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [5, 9], [9, 13], [13, 17],            // Palm base
];

export function useHandSpeakAI(videoRef, canvasRef) {
  const [mode, setMode] = useState('letters');
  const [state, setState] = useState({
    mode: 'letters',
    isModelLoading: true,
    isModelReady: false,
    isCameraActive: false,
    error: null,
    currentLetter: '-',
    currentPrediction: '-',
    confidence: 0,
    stableLetter: '-',
    stablePrediction: '-',
    accumulatedText: '',
    feedback: 'Menyiapkan modul AI...',
    detectedHandsCount: 0,
    showSkeleton: true,
  });

  const modeRef = useRef('letters');
  const handLandmarkerRef = useRef(null);
  const letterModelRef = useRef(null);
  const wordModelRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastProcessTimeRef = useRef(0);
  const recentPredictionsRef = useRef([]);
  const lastCommittedTimeRef = useRef(0);
  const lastCommittedPredictionRef = useRef(null);
  const showSkeletonRef = useRef(true);

  // Stop Camera
  const stopCamera = useCallback(() => {
    if (animFrameIdRef.current) {
      cancelAnimationFrame(animFrameIdRef.current);
      animFrameIdRef.current = null;
    }

    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      stream.getTracks().forEach((track) => track.stop());
      videoRef.current.srcObject = null;
    }

    if (canvasRef && canvasRef.current) {
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    setState((s) => ({
      ...s,
      isCameraActive: false,
      currentLetter: '-',
      confidence: 0,
      detectedHandsCount: 0,
      feedback: 'Kamera dinonaktifkan.',
    }));
  }, []);

  // Draw Landmarks Canvas
  const drawLandmarks = (landmarksList) => {
    if (!canvasRef || !canvasRef.current || !videoRef.current) return;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    if (canvas.width !== videoRef.current.videoWidth || canvas.height !== videoRef.current.videoHeight) {
      canvas.width = videoRef.current.videoWidth || 640;
      canvas.height = videoRef.current.videoHeight || 480;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (!showSkeletonRef.current || !landmarksList || landmarksList.length === 0) return;

    const w = canvas.width;
    const h = canvas.height;

    landmarksList.forEach((landmarks) => {
      // Gambar tulang / connections
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#818cf8';
      ctx.lineCap = 'round';

      HAND_CONNECTIONS.forEach(([i, j]) => {
        const ptA = landmarks[i];
        const ptB = landmarks[j];
        if (!ptA || !ptB) return;

        ctx.beginPath();
        ctx.moveTo(ptA.x * w, ptA.y * h);
        ctx.lineTo(ptB.x * w, ptB.y * h);
        ctx.stroke();
      });

      // Gambar titik sendi
      landmarks.forEach((pt, idx) => {
        const x = pt.x * w;
        const y = pt.y * h;

        ctx.beginPath();
        ctx.arc(x, y, idx === 4 || idx === 8 || idx === 12 || idx === 16 || idx === 20 ? 5 : 3, 0, 2 * Math.PI);
        ctx.fillStyle = idx % 4 === 0 ? '#34d399' : '#ffffff';
        ctx.fill();
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#070709';
        ctx.stroke();
      });
    });
  };

  // Inference Processing Loop
  const startLoop = useCallback(() => {
    const processFrame = () => {
      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      const currentMode = modeRef.current;
      const activeModel = currentMode === 'letters' ? letterModelRef.current : wordModelRef.current;
      const activeLabels = currentMode === 'letters' ? BISINDO_LETTER_LABELS : BISINDO_WORD_LABELS_38;

      if (!video || !landmarker || !activeModel || video.readyState < 2) {
        animFrameIdRef.current = requestAnimationFrame(processFrame);
        return;
      }

      const now = performance.now();
      // Throttling: eksekusi setiap ~100ms agar browser tetap stabil di 60 FPS
      if (now - lastProcessTimeRef.current >= 100) {
        lastProcessTimeRef.current = now;

        try {
          const results = landmarker.detectForVideo(video, now);

          if (!results.landmarks || results.landmarks.length === 0) {
            recentPredictionsRef.current = [];
            if (canvasRef && canvasRef.current) {
              const ctx = canvasRef.current.getContext('2d');
              if (ctx) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
            }

            setState((s) => ({
              ...s,
              currentLetter: '-',
              currentPrediction: '-',
              confidence: 0,
              detectedHandsCount: 0,
              feedback: 'Tangan tidak terdeteksi. Posisikan tangan di depan kamera.',
            }));
          } else {
            // Render landmarks pada canvas
            drawLandmarks(results.landmarks);

            // Format data tangan
            const detectedHands = results.landmarks.map((lms, idx) => ({
              landmarks: lms.map((pt) => ({ x: pt.x, y: pt.y, z: pt.z })),
              handedness: results.handednesses?.[idx]?.[0]?.categoryName || 'Unknown',
            }));

            // Ekstraksi 176 fitur geometri & mirror correction
            const orderedHands = HandFeatureExtractor.normalizeHandsOrder(detectedHands);
            let features = HandFeatureExtractor.buildFeature176(orderedHands);
            features = HandFeatureExtractor.correctFrontCameraFeatures(features);

            // Inferensi Model TFLite
            const inputTensor = tf.tensor2d([features], [1, 176], 'float32');
            const outputTensor = activeModel.predict(inputTensor);
            const probabilities = Array.from(outputTensor.dataSync());
            inputTensor.dispose();
            outputTensor.dispose();

            // Cari probabilitas tertinggi
            let bestIdx = 0;
            let maxScore = probabilities[0];
            for (let i = 1; i < probabilities.length; i++) {
              if (probabilities[i] > maxScore) {
                maxScore = probabilities[i];
                bestIdx = i;
              }
            }

            const predictedLabel = activeLabels[bestIdx] || '-';
            const score = maxScore;

            // Voting filter untuk stabilitas (0.9s hold duration untuk menyusun huruf/kosakata)
            const liveThreshold = currentMode === 'letters' ? 0.55 : 0.50;
            const commitThreshold = currentMode === 'letters' ? 0.65 : 0.60;
            const cooldown = currentMode === 'letters' ? 900 : 1400;

            if (score >= liveThreshold) {
              recentPredictionsRef.current.push(predictedLabel);
              if (recentPredictionsRef.current.length > 7) {
                recentPredictionsRef.current.shift();
              }

              const counts = {};
              recentPredictionsRef.current.forEach((l) => {
                counts[l] = (counts[l] || 0) + 1;
              });

              let stableCandidate = predictedLabel;
              let bestCount = 0;
              Object.entries(counts).forEach(([l, c]) => {
                if (c > bestCount) {
                  bestCount = c;
                  stableCandidate = l;
                }
              });

              // Commit text logic (tahan posisi gestur stabil ~0.9 detik)
              let textUpdate = null;
              if (score >= commitThreshold && bestCount >= 3) {
                const canCommit =
                  lastCommittedPredictionRef.current !== stableCandidate ||
                  now - lastCommittedTimeRef.current >= cooldown;

                if (canCommit) {
                  lastCommittedPredictionRef.current = stableCandidate;
                  lastCommittedTimeRef.current = now;
                  textUpdate = currentMode === 'letters' ? stableCandidate : ` ${stableCandidate} `;
                }
              }

              setState((s) => ({
                ...s,
                currentLetter: predictedLabel,
                currentPrediction: predictedLabel,
                confidence: score,
                stableLetter: stableCandidate,
                stablePrediction: stableCandidate,
                detectedHandsCount: results.landmarks.length,
                accumulatedText: textUpdate
                  ? (s.accumulatedText + textUpdate).trimStart()
                  : s.accumulatedText,
                feedback:
                  score >= 0.85
                    ? (currentMode === 'letters' ? '🎯 Huruf Sangat Jelas!' : '🎯 Kosakata Terdeteksi Mantap!')
                    : score >= 0.70
                    ? '👍 Bagus, tahan posisinya'
                    : '✋ Coba perjelas arah gestur',
              }));
            }
          }
        } catch (e) {
          console.error('Frame inference error:', e);
        }
      }

      animFrameIdRef.current = requestAnimationFrame(processFrame);
    };

    animFrameIdRef.current = requestAnimationFrame(processFrame);
  }, []);

  // Start Camera
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setState((s) => ({
        ...s,
        error: 'Browser Anda tidak mendukung akses kamera (MediaDevices API). Pastikan menggunakan browser modern (Chrome, Edge, Firefox, Safari) dengan protokol HTTPS.',
        feedback: 'Kamera tidak didukung browser.',
      }));
      return;
    }

    try {
      setState((s) => ({
        ...s,
        error: null,
        feedback: 'Menunggu izin akses kamera dari browser...',
      }));

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user', // front camera
        },
        audio: false,
      });

      videoRef.current.srcObject = stream;
      await videoRef.current.play();

      setState((s) => ({
        ...s,
        isCameraActive: true,
        error: null,
        feedback: s.isModelReady ? 'Kamera aktif & deteksi gesture berjalan.' : 'Kamera aktif. Menyiapkan model AI...',
      }));
      startLoop();
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMsg = 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan pada browser.';
      if (err.name === 'NotAllowedError' || err.name === 'PermissionDeniedError') {
        errorMsg = 'Izin kamera ditolak. Silakan klik ikon gembok/setelan di sebelah kiri URL browser Anda, pilih "Izinkan" untuk kamera, lalu tekan Buka Kamera lagi.';
      } else if (err.name === 'NotFoundError' || err.name === 'DevicesNotFoundError') {
        errorMsg = 'Kamera tidak ditemukan pada perangkat Anda. Pastikan webcam terpasang.';
      } else if (err.name === 'NotReadableError' || err.name === 'TrackStartError') {
        errorMsg = 'Kamera sedang digunakan oleh aplikasi lain (seperti Zoom, Google Meet, dll). Tutup aplikasi tersebut dan coba lagi.';
      }
      setState((s) => ({
        ...s,
        isCameraActive: false,
        error: errorMsg,
        feedback: 'Akses kamera gagal.',
      }));
    }
  }, [startLoop]);

  // Switch Mode (Huruf vs Kosakata)
  const switchMode = useCallback((newMode) => {
    setMode(newMode);
    modeRef.current = newMode;
    recentPredictionsRef.current = [];
    lastCommittedPredictionRef.current = null;
    setState((s) => ({
      ...s,
      mode: newMode,
      currentLetter: '-',
      currentPrediction: '-',
      confidence: 0,
      stableLetter: '-',
      stablePrediction: '-',
      feedback:
        newMode === 'letters'
          ? 'Beralih ke Mode Huruf (A–Z)'
          : 'Beralih ke Mode Kosakata (38 Kata)',
    }));
  }, []);

  // Inisialisasi Model MediaPipe Tasks Vision & Kedua Model Dense BISINDO
  useEffect(() => {
    let isMounted = true;

    async function initModels() {
      try {
        setState((s) => ({
          ...s,
          isModelLoading: true,
          error: null,
          feedback: 'Memuat MediaPipe Hand Landmarker...',
        }));

        // Inisialisasi MediaPipe Tasks Vision (Prioritas local WASM, fallback ke CDN)
        let vision;
        try {
          vision = await FilesetResolver.forVisionTasks('/wasm/mediapipe');
        } catch {
          vision = await FilesetResolver.forVisionTasks(
            'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
          );
        }

        // Inisialisasi HandLandmarker (GPU dengan fallback otomatis ke CPU)
        let landmarker;
        try {
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/hand_landmarker.task',
              delegate: 'GPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.35,
            minHandPresenceConfidence: 0.35,
            minTrackingConfidence: 0.35,
          });
        } catch (gpuErr) {
          console.warn('GPU delegate gagal, menggunakan fallback CPU:', gpuErr);
          landmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
              modelAssetPath: '/models/hand_landmarker.task',
              delegate: 'CPU',
            },
            runningMode: 'VIDEO',
            numHands: 2,
            minHandDetectionConfidence: 0.35,
            minHandPresenceConfidence: 0.35,
            minTrackingConfidence: 0.35,
          });
        }

        if (!isMounted) return;

        setState((s) => ({
          ...s,
          feedback: 'Memuat Neural Network BISINDO (Huruf + Kosakata)...',
        }));

        // Inisialisasi TensorFlow.js backend
        await tf.ready();

        // Unduh dan inisialisasi kedua model Dense Neural Network secara native
        const [letterModel, wordModel] = await Promise.all([
          loadDenseModelFromBin('/models/bisindo_az_weights.bin'),
          loadDenseModelFromBin('/models/bisindo_words_weights.bin'),
        ]);

        if (isMounted) {
          handLandmarkerRef.current = landmarker;
          letterModelRef.current = letterModel;
          wordModelRef.current = wordModel;
          setState((s) => ({
            ...s,
            isModelLoading: false,
            isModelReady: true,
            feedback: s.isCameraActive
              ? 'Model siap & deteksi gesture berjalan.'
              : 'Model Huruf & Kosakata siap! Tekan "Buka Kamera" untuk mulai.',
          }));
        }
      } catch (err) {
        console.error('Failed to initialize models:', err);
        if (isMounted) {
          setState((s) => ({
            ...s,
            isModelLoading: false,
            error: err.message || 'Gagal memuat model AI HandSpeak.',
            feedback: 'Error saat inisialisasi model: ' + (err.message || 'Unknown error'),
          }));
        }
      }
    }

    initModels();

    return () => {
      isMounted = false;
      stopCamera();
      letterModelRef.current?.dispose?.();
      wordModelRef.current?.dispose?.();
    };
  }, [stopCamera]);

  const toggleSkeleton = useCallback(() => {
    showSkeletonRef.current = !showSkeletonRef.current;
    setState((s) => ({ ...s, showSkeleton: showSkeletonRef.current }));
  }, []);

  const clearText = useCallback(() => {
    setState((s) => ({ ...s, accumulatedText: '' }));
  }, []);

  const addSpace = useCallback(() => {
    setState((s) => ({ ...s, accumulatedText: s.accumulatedText + ' ' }));
  }, []);

  const backspace = useCallback(() => {
    setState((s) => ({
      ...s,
      accumulatedText: s.accumulatedText.trimEnd().slice(0, -1),
    }));
  }, []);

  return {
    ...state,
    switchMode,
    startCamera,
    stopCamera,
    toggleSkeleton,
    clearText,
    addSpace,
    backspace,
  };
}