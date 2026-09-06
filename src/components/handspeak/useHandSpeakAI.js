import { useEffect, useRef, useState, useCallback } from 'react';
import { FilesetResolver, HandLandmarker } from '@mediapipe/tasks-vision';
import * as tflite from '@tensorflow/tfjs-tflite';
import * as tf from '@tensorflow/tfjs';
import { HandFeatureExtractor } from './handFeatureExtractor';
import { BISINDO_LABELS } from './labels';

const HAND_CONNECTIONS = [
  [0, 1], [1, 2], [2, 3], [3, 4],       // Thumb
  [0, 5], [5, 6], [6, 7], [7, 8],       // Index
  [0, 9], [9, 10], [10, 11], [11, 12],  // Middle
  [0, 13], [13, 14], [14, 15], [15, 16],// Ring
  [0, 17], [17, 18], [18, 19], [19, 20],// Pinky
  [5, 9], [9, 13], [13, 17],            // Palm base
];

export function useHandSpeakAI(videoRef, canvasRef) {
  const [state, setState] = useState({
    isModelLoading: true,
    isModelReady: false,
    isCameraActive: false,
    error: null,
    currentLetter: '-',
    confidence: 0,
    stableLetter: '-',
    accumulatedText: '',
    feedback: 'Menyiapkan modul AI...',
    detectedHandsCount: 0,
    showSkeleton: true,
  });

  const handLandmarkerRef = useRef(null);
  const tfliteModelRef = useRef(null);
  const animFrameIdRef = useRef(null);
  const lastProcessTimeRef = useRef(0);
  const recentPredictionsRef = useRef([]);
  const lastCommittedTimeRef = useRef(0);
  const lastCommittedLetterRef = useRef(null);
  const showSkeletonRef = useRef(true);

  // 1. Inisialisasi Model MediaPipe Tasks Vision & TFLite
  useEffect(() => {
    let isMounted = true;

    async function initModels() {
      try {
        setState((s) => ({ ...s, isModelLoading: true, feedback: 'Memuat MediaPipe & TFLite Model...' }));

        // Inisialisasi MediaPipe Tasks Vision
        const vision = await FilesetResolver.forVisionTasks(
          'https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@latest/wasm'
        );

        const landmarker = await HandLandmarker.createFromOptions(vision, {
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

        // Set local WASM path untuk TFLite runner
        try {
          tflite.setWasmPath('/wasm/');
        } catch (e) {
          console.warn('tflite.setWasmPath notice:', e);
        }

        // Inisialisasi TensorFlow & TFLite model
        await tf.ready();
        const model = await tflite.loadTFLiteModel('/models/bisindo_az_2hands_aug.tflite');

        if (isMounted) {
          handLandmarkerRef.current = landmarker;
          tfliteModelRef.current = model;
          setState((s) => ({
            ...s,
            isModelLoading: false,
            isModelReady: true,
            feedback: 'Model AI siap! Tekan "Buka Kamera" untuk mulai.',
          }));
        }
      } catch (err) {
        console.error('Failed to initialize models:', err);
        if (isMounted) {
          setState((s) => ({
            ...s,
            isModelLoading: false,
            error: err.message || 'Gagal memuat model AI HandSpeak.',
            feedback: 'Error saat inisialisasi model.',
          }));
        }
      }
    }

    initModels();

    return () => {
      isMounted = false;
      stopCamera();
    };
  }, []);

  // 2. Start Camera
  const startCamera = useCallback(async () => {
    if (!videoRef.current) return;

    try {
      setState((s) => ({ ...s, error: null, feedback: 'Membuka kamera...' }));
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

      setState((s) => ({ ...s, isCameraActive: true, feedback: 'Deteksi gesture aktif.' }));
      startLoop();
    } catch (err) {
      console.error('Camera access error:', err);
      setState((s) => ({
        ...s,
        isCameraActive: false,
        error: 'Tidak dapat mengakses kamera. Pastikan izin kamera telah diberikan pada browser.',
        feedback: 'Kamera diblokir atau tidak tersedia.',
      }));
    }
  }, []);

  // 3. Stop Camera
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

  // 4. Draw Landmarks Canvas
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

  // 5. Inference Processing Loop
  const startLoop = useCallback(() => {
    const processFrame = () => {
      const video = videoRef.current;
      const landmarker = handLandmarkerRef.current;
      const model = tfliteModelRef.current;

      if (!video || !landmarker || !model || video.readyState < 2) {
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
            const outputTensor = model.predict(inputTensor);
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

            const predictedLetter = BISINDO_LABELS[bestIdx] || '-';
            const score = maxScore;

            // Voting filter untuk stabilitas
            if (score >= 0.50) {
              recentPredictionsRef.current.push(predictedLetter);
              if (recentPredictionsRef.current.length > 5) {
                recentPredictionsRef.current.shift();
              }

              const counts = {};
              recentPredictionsRef.current.forEach((l) => {
                counts[l] = (counts[l] || 0) + 1;
              });

              let stableCandidate = predictedLetter;
              let bestCount = 0;
              Object.entries(counts).forEach(([l, c]) => {
                if (c > bestCount) {
                  bestCount = c;
                  stableCandidate = l;
                }
              });

              // Commit text logic (score >= 0.65, count >= 2, cooldown 650ms)
              let textUpdate = null;
              if (score >= 0.65 && bestCount >= 2) {
                const canCommit =
                  lastCommittedLetterRef.current !== stableCandidate ||
                  now - lastCommittedTimeRef.current >= 650;

                if (canCommit) {
                  lastCommittedLetterRef.current = stableCandidate;
                  lastCommittedTimeRef.current = now;
                  textUpdate = stableCandidate;
                }
              }

              setState((s) => ({
                ...s,
                currentLetter: predictedLetter,
                confidence: score,
                stableLetter: stableCandidate,
                detectedHandsCount: results.landmarks.length,
                accumulatedText: textUpdate ? s.accumulatedText + textUpdate : s.accumulatedText,
                feedback:
                  score >= 0.85
                    ? '🎯 Gestur Sangat Jelas!'
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
    setState((s) => ({ ...s, accumulatedText: s.accumulatedText.slice(0, -1) }));
  }, []);

  return {
    ...state,
    startCamera,
    stopCamera,
    toggleSkeleton,
    clearText,
    addSpace,
    backspace,
  };
}