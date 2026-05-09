import cv2
import numpy as np
import requests
import logging
from app.services.image_processing.spill_confidence_calculator import calculate_spill_confidence

logger = logging.getLogger(__name__)

class SpillDetectionService:
    def process_spill_image(self, image_data: dict, vessel_data: dict, anomaly_result: dict) -> dict:
        base_confidence = calculate_spill_confidence(vessel_data, anomaly_result)
        
        cv_confidence = 0.0
        thumbnail_url = image_data.get("thumbnail_url")
        
        # Simulated Computer Vision Pipeline using OpenCV
        if thumbnail_url:
            try:
                # 1. Download the satellite thumbnail image
                response = requests.get(thumbnail_url, timeout=5)
                if response.status_code == 200:
                    image_bytes = np.asarray(bytearray(response.content), dtype="uint8")
                    img = cv2.imdecode(image_bytes, cv2.IMREAD_COLOR)
                    
                    if img is not None:
                        # 2. Convert to Grayscale (Simulating SAR intensity)
                        gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
                        
                        # 3. Apply Gaussian Blur to reduce noise (waves/clouds)
                        blurred = cv2.GaussianBlur(gray, (5, 5), 0)
                        
                        # 4. Thresholding to find "Dark Spots" (Potential Oil Slicks)
                        # Oil slicks appear dark on SAR and some optical imagery due to wave dampening
                        _, thresh = cv2.threshold(blurred, 50, 255, cv2.THRESH_BINARY_INV)
                        
                        # 5. Find contours of the dark spots
                        contours, _ = cv2.findContours(thresh, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
                        
                        # 6. Analyze contours to calculate CV confidence
                        significant_spots = 0
                        total_spill_area = 0
                        
                        for cnt in contours:
                            area = cv2.contourArea(cnt)
                            # Filter out tiny noise and massive landmasses
                            if 100 < area < 50000:
                                significant_spots += 1
                                total_spill_area += area
                        
                        if significant_spots > 0:
                            logger.info(f"OpenCV detected {significant_spots} potential spill zones.")
                            cv_confidence = min(30.0, significant_spots * 5 + (total_spill_area / 1000))
                        else:
                            logger.info("OpenCV found no significant dark spots.")
            except Exception as e:
                logger.error(f"OpenCV processing failed: {e}")

        # Combine base kinematic heuristics with Computer Vision analysis
        final_confidence = min(100.0, base_confidence + cv_confidence)
        spill_detected = final_confidence >= 50

        return {
            "spill_detected": spill_detected,
            "confidence_score": round(final_confidence, 2),
            "base_score": base_confidence,
            "cv_score": round(cv_confidence, 2),
            "message": "Possible spill pattern detected via CV & Kinematics" if spill_detected else "No significant spill pattern detected",
            "image_reference": image_data.get("image_reference", "unknown"),
        }