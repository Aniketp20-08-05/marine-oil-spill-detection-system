class SatelliteFetchService:
    def fetch_satellite_image(self, latitude: float, longitude: float, anomaly_score: float) -> dict:
        priority = "high" if anomaly_score >= 60 else "medium"

        return {
            "status": "success",
            "latitude": latitude,
            "longitude": longitude,
            "source": "simulated-satellite-provider",
            "priority": priority,
            "image_reference": f"satellite_{latitude}_{longitude}.png",
        }