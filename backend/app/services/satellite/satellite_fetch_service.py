import logging
import requests
import json
from datetime import datetime, timedelta
from app.core.config import settings

logger = logging.getLogger(__name__)


class SatelliteFetchService:
    """Service for fetching satellite imagery from Planet API"""

    def __init__(self):
        self.api_key = settings.planet_api_key
        self.auth = (self.api_key, "")
        self.base_url = "https://api.planet.com/data/v1"

    def fetch_satellite_image(self, latitude: float, longitude: float, anomaly_score: float) -> dict:
        """
        Search for the latest satellite imagery around coordinates.
        Returns metadata and thumbnail URL.
        """
        if not self.api_key:
            logger.warning("No Planet API key configured. Returning mock data.")
            return self._mock_satellite_data(latitude, longitude, anomaly_score)

        try:
            # 1. Define search filter (1 day ago to now, near coordinates)
            item_types = ["PSScene"] # PlanetScope Scene
            
            geometry_filter = {
                "type": "GeometryFilter",
                "field_name": "geometry",
                "config": {
                    "type": "Point",
                    "coordinates": [longitude, latitude]
                }
            }
            
            date_filter = {
                "type": "DateRangeFilter",
                "field_name": "acquired",
                "config": {
                    "gte": (datetime.utcnow() - timedelta(days=7)).isoformat() + "Z"
                }
            }
            
            combined_filter = {
                "type": "AndFilter",
                "config": [geometry_filter, date_filter]
            }
            
            search_request = {
                "item_types": item_types,
                "filter": combined_filter
            }
            
            # 2. Execute search
            response = requests.post(
                f"{self.base_url}/quick-search",
                auth=self.auth,
                json=search_request,
                timeout=15
            )
            
            if response.status_code != 200:
                logger.error(f"Planet API error: {response.text}")
                return self._mock_satellite_data(latitude, longitude, anomaly_score)

            data = response.json()
            features = data.get("features", [])
            
            if not features:
                logger.warning(f"No Planet imagery found for ({latitude}, {longitude}) in the last 7 days.")
                return self._mock_satellite_data(latitude, longitude, anomaly_score)

            # 3. Get the most recent feature
            latest_feature = features[0]
            item_id = latest_feature["id"]
            properties = latest_feature["properties"]
            
            # 4. Get thumbnail URL
            # Extract thumbnail link from the feature's _links, falling back to constructing it if missing
            thumbnail_url = latest_feature.get("_links", {}).get("thumbnail") or f"https://tiles.planet.com/data/v1/item-types/PSScene/items/{item_id}/thumb"
            
            logger.info(f"Successfully fetched Planet imagery metadata for {item_id}")
            
            return {
                "status": "success",
                "latitude": latitude,
                "longitude": longitude,
                "source": "Planet API",
                "provider": properties.get("provider", "planetscope"),
                "acquired": properties.get("acquired"),
                "cloud_cover": properties.get("cloud_cover"),
                "item_id": item_id,
                "thumbnail_url": thumbnail_url,
                "priority": "high" if anomaly_score >= 60 else "medium",
                "image_reference": f"planet_{item_id}.png"
            }

        except Exception as e:
            logger.error(f"Error fetching from Planet API: {str(e)}")
            return self._mock_satellite_data(latitude, longitude, anomaly_score)

    def _mock_satellite_data(self, latitude: float, longitude: float, anomaly_score: float) -> dict:
        priority = "high" if anomaly_score >= 60 else "medium"
        return {
            "status": "success",
            "latitude": latitude,
            "longitude": longitude,
            "source": "simulated-satellite-provider (Planet Mock)",
            "priority": priority,
            "image_reference": f"satellite_{latitude}_{longitude}.png",
            "thumbnail_url": "https://upload.wikimedia.org/wikipedia/commons/f/f9/Oil_spill_from_Montara_offshore_oil_platform_in_the_Timor_Sea_-_radar_image_by_TerraSAR-X.jpg"
        }