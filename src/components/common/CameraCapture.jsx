import { useCallback, useEffect, useRef, useState } from 'react';
import { Camera, RotateCcw, Check, AlertTriangle } from 'lucide-react';

// --- Image quality checks -------------------------------------------------
// Sharpness: variance of a Laplacian edge-response over a grayscale, downscaled
// copy of the frame. Low variance => flat/blurry image => reject.
// Exposure: mean brightness of the same grayscale sample. Too dark or blown-out
// => customer's face/features won't be legible => reject.

const BLUR_VARIANCE_THRESHOLD = 25; // tune per camera quality if needed
const MIN_BRIGHTNESS = 35; // 0-255 scale
const MAX_BRIGHTNESS = 225;
const SAMPLE_WIDTH = 220;
const SAMPLE_HEIGHT = 165;

function toGrayscale(imageData) {
  const { data, width, height } = imageData;
  const gray = new Float32Array(width * height);
  for (let i = 0, p = 0; i < data.length; i += 4, p++) {
    // luminosity method
    gray[p] = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
  }
  return { gray, width, height };
}

function laplacianVariance(gray, width, height) {
  const responses = [];
  for (let y = 1; y < height - 1; y++) {
    for (let x = 1; x < width - 1; x++) {
      const idx = y * width + x;
      const lap =
        4 * gray[idx] -
        gray[idx - 1] -
        gray[idx + 1] -
        gray[idx - width] -
        gray[idx + width];
      responses.push(lap);
    }
  }
  const mean = responses.reduce((a, b) => a + b, 0) / responses.length;
  const variance = responses.reduce((a, b) => a + (b - mean) ** 2, 0) / responses.length;
  return variance;
}

function meanBrightness(gray) {
  let sum = 0;
  for (let i = 0; i < gray.length; i++) sum += gray[i];
  return sum / gray.length;
}

function assessQuality(canvas) {
  const ctx = canvas.getContext('2d');
  const sample = document.createElement('canvas');
  sample.width = SAMPLE_WIDTH;
  sample.height = SAMPLE_HEIGHT;
  sample.getContext('2d').drawImage(canvas, 0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);

  const imageData = sample.getContext('2d').getImageData(0, 0, SAMPLE_WIDTH, SAMPLE_HEIGHT);
  const { gray, width, height } = toGrayscale(imageData);

  const variance = laplacianVariance(gray, width, height);
  const brightness = meanBrightness(gray);

  const isBlurry = variance < BLUR_VARIANCE_THRESHOLD;
  const isTooDark = brightness < MIN_BRIGHTNESS;
  const isTooBright = brightness > MAX_BRIGHTNESS;

  let reason = null;
  if (isBlurry) reason = 'Photo is too blurry — hold the camera steady and try again.';
  else if (isTooDark) reason = 'Photo is too dark — move to better lighting and try again.';
  else if (isTooBright) reason = 'Photo is overexposed — reduce glare or backlight and try again.';

  return { passed: !reason, reason, variance, brightness };
}

// ---------------------------------------------------------------------------

export default function CameraCapture({ onCapture, onCancel }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const [error, setError] = useState('');
  const [capturedUrl, setCapturedUrl] = useState(null);
  const [rejection, setRejection] = useState(null);
  const [starting, setStarting] = useState(true);

  const startCamera = useCallback(async () => {
    setStarting(true);
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 720 }, height: { ideal: 540 } },
        audio: false,
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
    } catch (err) {
      setError(
        err.name === 'NotAllowedError'
          ? 'Camera access was denied. Allow camera permission and try again.'
          : 'Could not access the camera on this device.'
      );
    } finally {
      setStarting(false);
    }
  }, []);

  useEffect(() => {
    startCamera();
    return () => {
      streamRef.current?.getTracks().forEach((t) => t.stop());
    };
  }, [startCamera]);

  const handleCapture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.getContext('2d').drawImage(video, 0, 0);

    const quality = assessQuality(canvas);

    if (!quality.passed) {
      setRejection(quality.reason);
      setCapturedUrl(null);
      return;
    }

    setRejection(null);
    setCapturedUrl(canvas.toDataURL('image/jpeg', 0.9));
    streamRef.current?.getTracks().forEach((t) => t.stop());
  };

  const handleRetake = () => {
    setCapturedUrl(null);
    setRejection(null);
    startCamera();
  };

  const handleConfirm = () => {
    if (capturedUrl) onCapture(capturedUrl);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col">
      <div className="flex-1 relative flex items-center justify-center overflow-hidden">
        {error ? (
          <div className="text-white text-center px-8">
            <AlertTriangle size={28} className="mx-auto mb-2 text-warning" />
            <p className="text-sm">{error}</p>
          </div>
        ) : capturedUrl ? (
          <img src={capturedUrl} alt="Captured customer photo" className="max-h-full max-w-full object-contain" />
        ) : (
          <video ref={videoRef} className="max-h-full max-w-full object-contain" muted playsInline />
        )}
        <canvas ref={canvasRef} className="hidden" />

        {rejection && (
          <div className="absolute bottom-24 left-4 right-4 bg-danger/95 text-white text-sm rounded-xl px-4 py-3 flex items-start gap-2">
            <AlertTriangle size={18} className="shrink-0 mt-0.5" />
            <span>{rejection}</span>
          </div>
        )}
      </div>

      <div className="bg-black/90 px-6 py-6 flex items-center justify-center gap-6">
        {capturedUrl ? (
          <>
            <button
              onClick={handleRetake}
              className="flex flex-col items-center gap-1 text-white text-xs"
            >
              <span className="w-12 h-12 rounded-full border-2 border-white flex items-center justify-center">
                <RotateCcw size={20} />
              </span>
              Retake
            </button>
            <button
              onClick={handleConfirm}
              className="flex flex-col items-center gap-1 text-white text-xs"
            >
              <span className="w-14 h-14 rounded-full bg-success flex items-center justify-center">
                <Check size={24} />
              </span>
              Use photo
            </button>
          </>
        ) : (
          <>
            <button onClick={onCancel} className="text-white text-sm px-3">
              Cancel
            </button>
            <button
              onClick={handleCapture}
              disabled={starting || !!error}
              className="w-16 h-16 rounded-full bg-white border-4 border-white/40 disabled:opacity-40 flex items-center justify-center"
            >
              <Camera size={26} className="text-ink" />
            </button>
            <span className="w-12" />
          </>
        )}
      </div>
    </div>
  );
}
