from app.services.image_processing.spill_confidence_calculator import calculate_spill_confidence


class SpillDetectionService:
    def process_spill_image(self, image_data: dict, vessel_data: dict, anomaly_result: dict) -> dict:
        confidence_score = calculate_spill_confidence(vessel_data, anomaly_result)
        spill_detected = confidence_score >= 50

        return {
            "spill_detected": spill_detected,
            "confidence_score": confidence_score,
            "message": "Possible spill pattern detected" if spill_detected else "No significant spill pattern detected",
            "image_reference": image_data["image_reference"],
        }