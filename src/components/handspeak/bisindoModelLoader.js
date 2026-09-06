import * as tf from '@tensorflow/tfjs';

/**
 * Memuat bobot binary model Dense Neural Network BISINDO ke dalam TensorFlow.js tensors.
 * Format binary:
 * [uint32 num_layers]
 * Untuk setiap layer:
 *   [uint32 in_dim, uint32 out_dim]
 *   [Float32Array kernel (in_dim * out_dim)]
 *   [Float32Array bias (out_dim)]
 */
export async function loadDenseModelFromBin(url) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Gagal mengunduh file bobot model dari ${url} (HTTP ${res.status})`);
  }
  const buf = await res.arrayBuffer();
  const view = new DataView(buf);
  let offset = 0;

  const numLayers = view.getUint32(offset, true);
  offset += 4;

  const layers = [];
  for (let l = 0; l < numLayers; l++) {
    const inDim = view.getUint32(offset, true);
    offset += 4;
    const outDim = view.getUint32(offset, true);
    offset += 4;

    const kSize = inDim * outDim;
    // Salin data ke Float32Array terisolasi untuk pembuatan tensor yang stabil
    const kernelData = new Float32Array(buf.slice(offset, offset + kSize * 4));
    offset += kSize * 4;

    const biasData = new Float32Array(buf.slice(offset, offset + outDim * 4));
    offset += outDim * 4;

    const kernelTensor = tf.tensor2d(kernelData, [inDim, outDim], 'float32');
    const biasTensor = tf.tensor1d(biasData, 'float32');

    layers.push({ kernelTensor, biasTensor });
  }

  return {
    predict(inputTensor) {
      return tf.tidy(() => {
        let h = inputTensor;
        for (let i = 0; i < layers.length; i++) {
          const { kernelTensor, biasTensor } = layers[i];
          h = tf.add(tf.matMul(h, kernelTensor), biasTensor);
          if (i < layers.length - 1) {
            h = tf.relu(h);
          }
        }
        return tf.softmax(h);
      });
    },
    dispose() {
      layers.forEach(({ kernelTensor, biasTensor }) => {
        kernelTensor.dispose();
        biasTensor.dispose();
      });
    },
  };
}